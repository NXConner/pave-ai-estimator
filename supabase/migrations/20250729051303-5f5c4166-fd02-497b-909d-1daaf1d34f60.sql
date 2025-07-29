-- Final Security Fixes Migration - Only Missing Policies

-- 1. Files table policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can view their own files') THEN
    EXECUTE 'CREATE POLICY "Users can view their own files" ON public.files FOR SELECT USING (uploadedby = auth.uid())';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can upload their own files') THEN
    EXECUTE 'CREATE POLICY "Users can upload their own files" ON public.files FOR INSERT WITH CHECK (uploadedby = auth.uid())';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can update their own files') THEN
    EXECUTE 'CREATE POLICY "Users can update their own files" ON public.files FOR UPDATE USING (uploadedby = auth.uid())';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'files' AND policyname = 'Users can delete their own files') THEN
    EXECUTE 'CREATE POLICY "Users can delete their own files" ON public.files FOR DELETE USING (uploadedby = auth.uid())';
  END IF;
END $$;

-- 2. Backups table policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'backups' AND policyname = 'Admins can manage backups') THEN
    EXECUTE 'CREATE POLICY "Admins can manage backups" ON public.backups FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND (is_admin = true OR role = ''super_admin'')))';
  END IF;
END $$;

-- 3. Jobs table policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Users can view jobs assigned to them') THEN
    EXECUTE 'CREATE POLICY "Users can view jobs assigned to them" ON public.jobs FOR SELECT USING (assigned_to = auth.uid() OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND (is_admin = true OR role IN (''super_admin'', ''project_manager''))))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Admins can manage jobs') THEN
    EXECUTE 'CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND (is_admin = true OR role IN (''super_admin'', ''project_manager''))))';
  END IF;
END $$;

-- 4. Rate limits policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rate_limits' AND policyname = 'System can manage rate limits') THEN
    EXECUTE 'CREATE POLICY "System can manage rate limits" ON public.rate_limits FOR ALL USING (true)';
  END IF;
END $$;

-- 5. Vehicles policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Users can view vehicles assigned to them') THEN
    EXECUTE 'CREATE POLICY "Users can view vehicles assigned to them" ON public.vehicles FOR SELECT USING (assigned_to = auth.uid() OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND (is_admin = true OR role IN (''super_admin'', ''fleet_manager''))))';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Fleet managers can manage vehicles') THEN
    EXECUTE 'CREATE POLICY "Fleet managers can manage vehicles" ON public.vehicles FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND (is_admin = true OR role IN (''super_admin'', ''fleet_manager''))))';
  END IF;
END $$;

-- 6. Create security audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Security audit log policy (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_audit_log' AND policyname = 'Admins can view security audit log') THEN
    EXECUTE 'CREATE POLICY "Admins can view security audit log" ON public.security_audit_log FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND (is_admin = true OR role = ''super_admin'')))';
  END IF;
END $$;

-- 7. Add input validation trigger for critical tables
CREATE OR REPLACE FUNCTION public.validate_input_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate email format in profiles
  IF TG_TABLE_NAME = 'profiles' AND NEW.email IS NOT NULL THEN
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
      RAISE EXCEPTION 'Invalid email format';
    END IF;
  END IF;
  
  -- Validate phone format if provided
  IF TG_TABLE_NAME = 'profiles' AND NEW.phone IS NOT NULL THEN
    -- Remove all non-digit characters for validation
    IF length(regexp_replace(NEW.phone, '[^0-9]', '', 'g')) < 10 THEN
      RAISE EXCEPTION 'Invalid phone number format';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply validation trigger to profiles table
DROP TRIGGER IF EXISTS validate_profiles_input ON public.profiles;
CREATE TRIGGER validate_profiles_input
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_input_data();

-- 8. Create function to securely log security events
CREATE OR REPLACE FUNCTION public.log_security_event(p_action text, p_resource_type text DEFAULT NULL::text, p_resource_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO security_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  );
EXCEPTION
  WHEN others THEN
    NULL; -- Don't fail if logging fails
END;
$$;