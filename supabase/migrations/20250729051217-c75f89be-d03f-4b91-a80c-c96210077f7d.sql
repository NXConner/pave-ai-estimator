-- Critical Security Fixes Migration (Corrected)

-- 1. Enable RLS on unprotected tables (already done)
-- ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for tables missing policies with correct column names

-- Files table policies (uploadedby instead of owner_id)
CREATE POLICY "Users can view their own files" ON public.files
  FOR SELECT USING (uploadedby = auth.uid());

CREATE POLICY "Users can upload their own files" ON public.files
  FOR INSERT WITH CHECK (uploadedby = auth.uid());

CREATE POLICY "Users can update their own files" ON public.files
  FOR UPDATE USING (uploadedby = auth.uid());

CREATE POLICY "Users can delete their own files" ON public.files
  FOR DELETE USING (uploadedby = auth.uid());

-- Backups table policies (no user-specific column, admin only)
CREATE POLICY "Admins can manage backups" ON public.backups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
    )
  );

-- Jobs policies (no created_by column found, using assigned_to)
CREATE POLICY "Users can view jobs assigned to them" ON public.jobs
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'project_manager'))
    )
  );

CREATE POLICY "Admins can manage jobs" ON public.jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'project_manager'))
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (user_id = auth.uid());

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Projects policies
CREATE POLICY "Users can view projects they created or are assigned to" ON public.projects
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'project_manager'))
    )
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Project creators and admins can update projects" ON public.projects
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'project_manager'))
    )
  );

-- Proposals policies
CREATE POLICY "Users can view proposals they created" ON public.proposals
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
    )
  );

CREATE POLICY "Users can create proposals" ON public.proposals
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Proposal creators can update proposals" ON public.proposals
  FOR UPDATE USING (created_by = auth.uid());

-- Rate limits policies (system table)
CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL USING (true);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Vehicles policies
CREATE POLICY "Users can view vehicles assigned to them" ON public.vehicles
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'fleet_manager'))
    )
  );

CREATE POLICY "Fleet managers can manage vehicles" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'fleet_manager'))
    )
  );

-- 3. Create security audit log table if it doesn't exist
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

CREATE POLICY "Admins can view security audit log" ON public.security_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
    )
  );

-- 4. Add input validation trigger for critical tables
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