-- PHASE 1: Enable RLS on unprotected tables
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- PHASE 2: Create essential RLS policies for tables with RLS but no policies

-- Document permissions policies
CREATE POLICY "Users can manage their own document permissions" 
ON public.document_permissions 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Document owners can manage permissions" 
ON public.document_permissions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM documents d 
  WHERE d.id = document_permissions.document_id 
  AND d.owner_id = auth.uid()
));

-- Files policies
CREATE POLICY "Users can manage their own files" 
ON public.files 
FOR ALL 
USING (uploaded_by = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Proposals policies
CREATE POLICY "Users can manage their own proposals" 
ON public.proposals 
FOR ALL 
USING (created_by = auth.uid());

CREATE POLICY "Public can view approved proposals" 
ON public.proposals 
FOR SELECT 
USING (status = 'approved');

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (user_id = auth.uid());

-- Rate limits policies (admin only)
CREATE POLICY "Admins can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Security audit log policies (admin only)
CREATE POLICY "Admins can view security logs" 
ON public.security_audit_log 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Weather data policies
CREATE POLICY "Authenticated users can view weather data" 
ON public.weather_data 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage weather data" 
ON public.weather_data 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Compliance zones policies
CREATE POLICY "Authenticated users can view compliance zones" 
ON public.compliance_zones 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage compliance zones" 
ON public.compliance_zones 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Resource allocations policies
CREATE POLICY "Authenticated users can view resource allocations" 
ON public.resource_allocations 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage resource allocations" 
ON public.resource_allocations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Compliance notifications policies
CREATE POLICY "Users can view their compliance notifications" 
ON public.compliance_notifications 
FOR SELECT 
USING (user_id = auth.uid());

-- Debriefs policies
CREATE POLICY "Users can manage their own debriefs" 
ON public.debriefs 
FOR ALL 
USING (user_id = auth.uid());

-- Project tasks policies
CREATE POLICY "Users can view project tasks" 
ON public.project_tasks 
FOR SELECT 
USING (assigned_to = auth.uid() OR EXISTS (
  SELECT 1 FROM projects p 
  WHERE p.id = project_tasks.project_id 
  AND p.created_by = auth.uid()
));

CREATE POLICY "Project creators can manage tasks" 
ON public.project_tasks 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p 
  WHERE p.id = project_tasks.project_id 
  AND p.created_by = auth.uid()
));

-- Sync status policies
CREATE POLICY "Users can view their sync status" 
ON public.sync_status 
FOR SELECT 
USING (user_id = auth.uid());

-- Analytics policies
CREATE POLICY "Admins can view analytics" 
ON public.analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Jobs policies
CREATE POLICY "Authenticated users can view jobs" 
ON public.jobs 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their assigned jobs" 
ON public.jobs 
FOR ALL 
USING (assigned_to = auth.uid());

-- Performance reviews policies
CREATE POLICY "Users can view their own performance reviews" 
ON public.performance_reviews 
FOR SELECT 
USING (employee_id = auth.uid());

CREATE POLICY "Managers can manage performance reviews" 
ON public.performance_reviews 
FOR ALL 
USING (reviewer_id = auth.uid() OR EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role IN ('super_admin', 'hr_manager'))
));

-- Time records policies
CREATE POLICY "Users can manage their own time records" 
ON public.time_records 
FOR ALL 
USING (user_id = auth.uid());

-- Work schedules policies
CREATE POLICY "Users can view their own work schedule" 
ON public.work_schedules 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Managers can manage work schedules" 
ON public.work_schedules 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role IN ('super_admin', 'operations_manager'))
));

-- Employee scores policies
CREATE POLICY "Users can view their own scores" 
ON public.employee_scores 
FOR SELECT 
USING (employee_id = auth.uid());

-- Backups policies (admin only)
CREATE POLICY "Admins can manage backups" 
ON public.backups 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Contracts policies
CREATE POLICY "Authenticated users can view contracts" 
ON public.contracts 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage contracts" 
ON public.contracts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Email templates policies
CREATE POLICY "Admins can manage email templates" 
ON public.email_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Maintenance logs policies
CREATE POLICY "Authenticated users can view maintenance logs" 
ON public.maintenance_logs 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Technicians can manage maintenance logs" 
ON public.maintenance_logs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('super_admin', 'admin', 'technician')
));

-- Vendors policies
CREATE POLICY "Authenticated users can view vendors" 
ON public.vendors 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage vendors" 
ON public.vendors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Receipts policies
CREATE POLICY "Users can manage their own receipts" 
ON public.receipts 
FOR ALL 
USING (user_id = auth.uid());

-- Expense categories policies
CREATE POLICY "Authenticated users can view expense categories" 
ON public.expense_categories 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage expense categories" 
ON public.expense_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Customers policies
CREATE POLICY "Authenticated users can view customers" 
ON public.customers 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage customers" 
ON public.customers 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Users policies
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Admins can manage users" 
ON public.users 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Vehicles policies
CREATE POLICY "Authenticated users can view vehicles" 
ON public.vehicles 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Fleet managers can manage vehicles" 
ON public.vehicles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('super_admin', 'admin', 'fleet_manager')
));

-- Maintenance records policies
CREATE POLICY "Fleet staff can view maintenance records" 
ON public.maintenance_records 
FOR SELECT 
USING (performed_by = auth.uid() OR EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('super_admin', 'admin', 'fleet_manager', 'technician')
));

CREATE POLICY "Technicians can manage maintenance records" 
ON public.maintenance_records 
FOR ALL 
USING (performed_by = auth.uid() OR EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('super_admin', 'admin', 'technician')
));

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- Scheduling entries policies
CREATE POLICY "Users can view their own schedule" 
ON public.scheduling_entries 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Managers can manage schedules" 
ON public.scheduling_entries 
FOR ALL 
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND role IN ('super_admin', 'admin', 'operations_manager')
));

-- Email logs policies (admin only)
CREATE POLICY "Admins can view email logs" 
ON public.email_logs 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() 
  AND (is_admin = true OR role = 'super_admin')
));

-- PHASE 3: Fix database function security issues
-- Update functions to use proper search paths

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Update prevent_role_escalation function
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only admins can change roles
  IF OLD.role IS DISTINCT FROM NEW.role OR OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    IF NOT EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND (is_admin = true OR role = 'super_admin')
    ) THEN
      RAISE EXCEPTION 'Insufficient privileges to change role or admin status';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(p_action text, p_resource_type text DEFAULT NULL::text, p_resource_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only proceed if security_audit_log table exists
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
$function$;

-- Update check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_action text, p_limit integer DEFAULT 10, p_window_minutes integer DEFAULT 15)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;