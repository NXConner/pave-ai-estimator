-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('residential', 'commercial', 'industrial')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('driveway', 'parking-lot')),
    area DECIMAL(10,2) NOT NULL CHECK (area > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'estimated', 'approved', 'in_progress', 'completed', 'cancelled')),
    region VARCHAR(100) NOT NULL DEFAULT 'virginia',
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('residential', 'commercial', 'industrial')),
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create estimates table
CREATE TABLE estimates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    estimate_data JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    is_current BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create project_files table for file attachments
CREATE TABLE project_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('image', 'pdf', 'excel', 'other')),
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create activity_logs table for audit trail
CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create regional_pricing table for advanced pricing configurations
CREATE TABLE regional_pricing (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(10) NOT NULL,
    pricing_data JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create user_preferences table for customization
CREATE TABLE user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(50) DEFAULT 'default',
    default_region VARCHAR(100) DEFAULT 'virginia',
    company_info JSONB,
    notification_settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_type ON customers(customer_type);

CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_job_type ON projects(job_type);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_estimates_project_id ON estimates(project_id);
CREATE INDEX idx_estimates_is_current ON estimates(is_current);
CREATE INDEX idx_estimates_version ON estimates(version);
CREATE INDEX idx_estimates_user_id ON estimates(user_id);

CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_files_file_type ON project_files(file_type);
CREATE INDEX idx_project_files_user_id ON project_files(user_id);

CREATE INDEX idx_activity_logs_project_id ON activity_logs(project_id);
CREATE INDEX idx_activity_logs_customer_id ON activity_logs(customer_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

CREATE INDEX idx_regional_pricing_region ON regional_pricing(region);
CREATE INDEX idx_regional_pricing_is_active ON regional_pricing(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regional_pricing_updated_at BEFORE UPDATE ON regional_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers
CREATE POLICY "Users can view all customers" ON customers
    FOR SELECT USING (true);

CREATE POLICY "Users can insert customers" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update customers" ON customers
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete customers" ON customers
    FOR DELETE USING (true);

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for estimates
CREATE POLICY "Users can view estimates for their projects" ON estimates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert estimates for their projects" ON estimates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update estimates for their projects" ON estimates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete estimates for their projects" ON estimates
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for project_files
CREATE POLICY "Users can view files for their projects" ON project_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert files for their projects" ON project_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update files for their projects" ON project_files
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete files for their projects" ON project_files
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for activity_logs
CREATE POLICY "Users can view their own activity logs" ON activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity logs" ON activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for regional_pricing
CREATE POLICY "Users can view active regional pricing" ON regional_pricing
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own regional pricing" ON regional_pricing
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- Create storage policies
CREATE POLICY "Users can upload project files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view project files" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update project files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete project files" ON storage.objects
    FOR DELETE USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');

-- Insert default regional pricing data
INSERT INTO regional_pricing (region, state, pricing_data, user_id) VALUES 
('virginia', 'VA', '{
  "region": "Virginia",
  "state": "VA",
  "taxRate": 0.053,
  "materials": {
    "sealer": {
      "pricePerGallon": 3.65,
      "coverageRate": 7.69,
      "supplier": "SealMaster"
    },
    "sand": {
      "pricePerBag": 10.00,
      "bagsPerGallon": 0.02,
      "supplier": "Local Supplier"
    },
    "fastDry": {
      "pricePerBucket": 50.00,
      "bucketsPerGallon": 0.0067,
      "supplier": "SealMaster"
    },
    "prepSeal": {
      "pricePerBucket": 50.00,
      "bucketsPerProject": 1,
      "supplier": "SealMaster"
    },
    "crackFiller": {
      "pricePerBox": 44.99,
      "coveragePerBox": 100,
      "supplier": "SealMaster"
    },
    "propane": {
      "pricePerTank": 10.00,
      "tanksPerLinearFoot": 0.005,
      "supplier": "Local Gas Station"
    }
  },
  "labor": {
    "hourlyRate": 12.00,
    "hoursPerSqFt": 0.001,
    "minimumHours": 2,
    "overtimeMultiplier": 1.5,
    "skillLevel": "intermediate"
  },
  "fuel": {
    "pricePerGallon": 3.50,
    "mpg": 8,
    "roundTripDistance": 90
  },
  "businessCosts": {
    "insuranceRate": 0.02,
    "equipmentDepreciation": 25.00,
    "permitCosts": 0.00
  }
}', '00000000-0000-0000-0000-000000000000'::uuid);

-- Create views for common queries
CREATE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.address,
    p.job_type,
    p.area,
    p.status,
    p.estimated_cost,
    p.final_cost,
    p.created_at,
    c.name as customer_name,
    c.customer_type,
    (SELECT COUNT(*) FROM estimates e WHERE e.project_id = p.id) as estimate_count,
    (SELECT e.estimate_data->>'finalTotal' FROM estimates e WHERE e.project_id = p.id AND e.is_current = true) as current_estimate_total
FROM projects p
JOIN customers c ON p.customer_id = c.id;

-- Create function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_uuid UUID)
RETURNS TABLE (
    total_projects BIGINT,
    active_projects BIGINT,
    total_revenue NUMERIC,
    avg_project_value NUMERIC,
    customer_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM projects WHERE user_id = user_uuid) as total_projects,
        (SELECT COUNT(*) FROM projects WHERE user_id = user_uuid AND status IN ('estimated', 'approved', 'in_progress')) as active_projects,
        (SELECT COALESCE(SUM(COALESCE(final_cost, estimated_cost)), 0) FROM projects WHERE user_id = user_uuid) as total_revenue,
        (SELECT COALESCE(AVG(COALESCE(final_cost, estimated_cost)), 0) FROM projects WHERE user_id = user_uuid AND (final_cost IS NOT NULL OR estimated_cost IS NOT NULL)) as avg_project_value,
        (SELECT COUNT(DISTINCT customer_id) FROM projects WHERE user_id = user_uuid) as customer_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE customers IS 'Customer information and contact details';
COMMENT ON TABLE projects IS 'Project information including location, type, and status';
COMMENT ON TABLE estimates IS 'Project estimates with versioning and detailed calculations';
COMMENT ON TABLE project_files IS 'File attachments for projects (images, PDFs, etc.)';
COMMENT ON TABLE activity_logs IS 'Audit trail of all system activities';
COMMENT ON TABLE regional_pricing IS 'Regional pricing configurations for different areas';
COMMENT ON TABLE user_preferences IS 'User-specific settings and preferences';

COMMENT ON COLUMN projects.area IS 'Project area in square feet';
COMMENT ON COLUMN estimates.estimate_data IS 'Complete estimate data as JSON including materials, labor, and pricing';
COMMENT ON COLUMN estimates.is_current IS 'Whether this is the current active estimate for the project';
COMMENT ON COLUMN regional_pricing.pricing_data IS 'Complete regional pricing configuration as JSON';