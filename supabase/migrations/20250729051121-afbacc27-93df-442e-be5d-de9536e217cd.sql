-- Critical Security Fixes Migration

-- 1. Enable RLS on unprotected tables
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- 2. Create user profiles trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    CASE 
      WHEN NEW.email = 'n8ter8@gmail.com' THEN 'super_admin'
      ELSE 'user'
    END,
    CASE 
      WHEN NEW.email = 'n8ter8@gmail.com' THEN true
      ELSE false
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Create RLS policies for tables missing policies

-- Files table policies
CREATE POLICY "Users can view their own files" ON public.files
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can upload their own files" ON public.files
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own files" ON public.files
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own files" ON public.files
  FOR DELETE USING (owner_id = auth.uid());

-- Backups table policies
CREATE POLICY "Admins can manage backups" ON public.backups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
    )
  );

-- Budget categories policies  
CREATE POLICY "Users can view budget categories" ON public.budget_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage budget categories" ON public.budget_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
    )
  );

-- Document permissions policies
CREATE POLICY "Users can view permissions for their documents" ON public.document_permissions
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

CREATE POLICY "Document owners can manage permissions" ON public.document_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM documents d 
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

-- Jobs policies
CREATE POLICY "Users can view jobs" ON public.jobs
  FOR SELECT USING (
    created_by = auth.uid() OR assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'project_manager'))
    )
  );

CREATE POLICY "Users can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Job creators and admins can update jobs" ON public.jobs
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role IN ('super_admin', 'project_manager'))
    )
  );

-- Materials policies
CREATE POLICY "Users can view materials" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage materials" ON public.materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
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

-- Profiles policies (if missing)
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

-- Rate limits policies
CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL USING (true);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Vehicles policies
CREATE POLICY "Users can view vehicles" ON public.vehicles
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

-- 4. Fix security definer functions with proper search_path
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
    NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_action text, p_limit integer DEFAULT 10, p_window_minutes integer DEFAULT 15)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_count integer;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  DELETE FROM rate_limits 
  WHERE window_start < (now() - (p_window_minutes || ' minutes')::interval);
  
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM rate_limits
  WHERE identifier = p_identifier 
    AND action = p_action 
    AND window_start >= window_start;
  
  IF current_count < p_limit THEN
    INSERT INTO rate_limits (identifier, action, count, window_start)
    VALUES (p_identifier, p_action, 1, now())
    ON CONFLICT (identifier, action) 
    DO UPDATE SET count = rate_limits.count + 1, created_at = now();
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 5. Create security audit log table if it doesn't exist
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