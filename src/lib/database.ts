import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DetailedEstimate } from './calculationEngine';

// Database types
export interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  customer_type: 'residential' | 'commercial' | 'industrial';
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id?: string;
  customer_id: string;
  name: string;
  address: string;
  job_type: 'driveway' | 'parking-lot';
  area: number;
  status: 'draft' | 'estimated' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  region: string;
  customer_type: 'residential' | 'commercial' | 'industrial';
  estimated_cost?: number;
  final_cost?: number;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

export interface EstimateRecord {
  id?: string;
  project_id: string;
  estimate_data: DetailedEstimate;
  version: number;
  is_current: boolean;
  notes?: string;
  created_at?: string;
  user_id: string;
}

export interface ProjectFile {
  id?: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_type: 'image' | 'pdf' | 'excel' | 'other';
  file_size: number;
  uploaded_at?: string;
  user_id: string;
}

export interface ActivityLog {
  id?: string;
  project_id?: string;
  customer_id?: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  created_at?: string;
  user_id: string;
}

export class DatabaseService {
  // Customer Management
  async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (error) throw error;

      await this.logActivity('customer_created', `Created customer: ${customer.name}`, { customer_id: data.id });
      toast.success('Customer created successfully');
      return data;
    } catch (error) {
      toast.error('Failed to create customer');
      throw error;
    }
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await this.logActivity('customer_updated', `Updated customer: ${data.name}`, { customer_id: id });
      toast.success('Customer updated successfully');
      return data;
    } catch (error) {
      toast.error('Failed to update customer');
      throw error;
    }
  }

  async getCustomers(limit: number = 50, offset: number = 0): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error('Failed to fetch customers');
      throw error;
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error('Failed to search customers');
      throw error;
    }
  }

  // Project Management
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Project> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, user_id: user.id }])
        .select(`
          *,
          customer:customers(*)
        `)
        .single();

      if (error) throw error;

      await this.logActivity('project_created', `Created project: ${project.name}`, { project_id: data.id });
      toast.success('Project created successfully');
      return data;
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          customer:customers(*)
        `)
        .single();

      if (error) throw error;

      await this.logActivity('project_updated', `Updated project: ${data.name}`, { project_id: id });
      toast.success('Project updated successfully');
      return data;
    } catch (error) {
      toast.error('Failed to update project');
      throw error;
    }
  }

  async getProjects(
    filters: {
      status?: Project['status'];
      customer_id?: string;
      job_type?: Project['job_type'];
    } = {},
    limit: number = 50,
    offset: number = 0
  ): Promise<Project[]> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          customer:customers(*),
          current_estimate:estimates!inner(estimate_data, created_at)
        `)
        .eq('estimates.is_current', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters.job_type) {
        query = query.eq('job_type', filters.job_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error('Failed to fetch projects');
      throw error;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          customer:customers(*),
          estimates(*),
          files:project_files(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Failed to fetch project');
      throw error;
    }
  }

  // Estimate Management
  async saveEstimate(estimate: Omit<EstimateRecord, 'id' | 'created_at' | 'user_id' | 'version'>): Promise<EstimateRecord> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Get the next version number
      const { data: existingEstimates } = await supabase
        .from('estimates')
        .select('version')
        .eq('project_id', estimate.project_id)
        .order('version', { ascending: false })
        .limit(1);

      const nextVersion = existingEstimates && existingEstimates.length > 0 
        ? existingEstimates[0].version + 1 
        : 1;

      // Mark all existing estimates as not current
      if (estimate.is_current) {
        await supabase
          .from('estimates')
          .update({ is_current: false })
          .eq('project_id', estimate.project_id);
      }

      const { data, error } = await supabase
        .from('estimates')
        .insert([{
          ...estimate,
          version: nextVersion,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Update project with estimated cost
      if (estimate.is_current) {
        await this.updateProject(estimate.project_id, {
          estimated_cost: estimate.estimate_data.pricing.finalTotal,
          status: 'estimated'
        });
      }

      await this.logActivity(
        'estimate_saved', 
        `Saved estimate v${nextVersion}`, 
        { 
          project_id: estimate.project_id, 
          estimate_id: data.id,
          version: nextVersion 
        }
      );

      toast.success('Estimate saved successfully');
      return data;
    } catch (error) {
      toast.error('Failed to save estimate');
      throw error;
    }
  }

  async getEstimateHistory(projectId: string): Promise<EstimateRecord[]> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('project_id', projectId)
        .order('version', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error('Failed to fetch estimate history');
      throw error;
    }
  }

  async getCurrentEstimate(projectId: string): Promise<EstimateRecord | null> {
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_current', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    } catch (error) {
      toast.error('Failed to fetch current estimate');
      throw error;
    }
  }

  // File Management
  async uploadFile(
    projectId: string, 
    file: File, 
    fileType: ProjectFile['file_type'] = 'other'
  ): Promise<ProjectFile> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${projectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file record to database
      const fileRecord: Omit<ProjectFile, 'id' | 'uploaded_at'> = {
        project_id: projectId,
        file_name: file.name,
        file_path: filePath,
        file_type: fileType,
        file_size: file.size,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('project_files')
        .insert([fileRecord])
        .select()
        .single();

      if (error) throw error;

      await this.logActivity(
        'file_uploaded', 
        `Uploaded file: ${file.name}`, 
        { project_id: projectId, file_id: data.id }
      );

      toast.success('File uploaded successfully');
      return data;
    } catch (error) {
      toast.error('Failed to upload file');
      throw error;
    }
  }

  async getFileUrl(filePath: string): Promise<string> {
    try {
      const { data } = await supabase.storage
        .from('project-files')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (!data?.signedUrl) throw new Error('Failed to generate file URL');
      return data.signedUrl;
    } catch (error) {
      toast.error('Failed to get file URL');
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file info first
      const { data: fileData, error: fetchError } = await supabase
        .from('project_files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([fileData.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      await this.logActivity(
        'file_deleted', 
        `Deleted file: ${fileData.file_name}`, 
        { project_id: fileData.project_id, file_id: fileId }
      );

      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
      throw error;
    }
  }

  // Activity Logging
  async logActivity(
    action: string, 
    description: string, 
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return; // Don't log if user not authenticated

      await supabase
        .from('activity_logs')
        .insert([{
          action,
          description,
          metadata,
          user_id: user.id,
          project_id: metadata.project_id,
          customer_id: metadata.customer_id
        }]);
    } catch (error) {
      // Don't show errors for activity logging to avoid annoying users
      console.error('Failed to log activity:', error);
    }
  }

  async getActivityLog(
    filters: {
      project_id?: string;
      customer_id?: string;
      action?: string;
    } = {},
    limit: number = 50
  ): Promise<ActivityLog[]> {
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters.project_id) {
        query = query.eq('project_id', filters.project_id);
      }
      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      toast.error('Failed to fetch activity log');
      throw error;
    }
  }

  // Analytics and Reports
  async getDashboardStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalRevenue: number;
    avgProjectValue: number;
    customerCount: number;
    recentActivity: ActivityLog[];
  }> {
    try {
      const [
        projectsData,
        revenueData,
        customerData,
        activityData
      ] = await Promise.all([
        supabase.from('projects').select('status, estimated_cost'),
        supabase.from('projects').select('final_cost, estimated_cost').not('final_cost', 'is', null),
        supabase.from('customers').select('id'),
        this.getActivityLog({}, 10)
      ]);

      const projects = projectsData.data || [];
      const revenue = revenueData.data || [];
      const customers = customerData.data || [];

      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => 
        ['estimated', 'approved', 'in_progress'].includes(p.status)
      ).length;

      const totalRevenue = revenue.reduce((sum, p) => 
        sum + (p.final_cost || p.estimated_cost || 0), 0
      );

      const avgProjectValue = totalRevenue / Math.max(revenue.length, 1);

      return {
        totalProjects,
        activeProjects,
        totalRevenue,
        avgProjectValue,
        customerCount: customers.length,
        recentActivity: activityData
      };
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
      throw error;
    }
  }

  // Utility methods
  private async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async exportData(type: 'projects' | 'customers' | 'estimates'): Promise<any[]> {
    try {
      let data;
      
      switch (type) {
        case 'projects':
          const projectsResult = await supabase
            .from('projects')
            .select(`
              *,
              customer:customers(name, email),
              current_estimate:estimates!inner(estimate_data)
            `)
            .eq('estimates.is_current', true);
          data = projectsResult.data;
          break;
          
        case 'customers':
          const customersResult = await supabase
            .from('customers')
            .select('*');
          data = customersResult.data;
          break;
          
        case 'estimates':
          const estimatesResult = await supabase
            .from('estimates')
            .select(`
              *,
              project:projects(name, address)
            `)
            .eq('is_current', true);
          data = estimatesResult.data;
          break;
          
        default:
          throw new Error('Invalid export type');
      }

      toast.success(`${type} data exported successfully`);
      return data || [];
    } catch (error) {
      toast.error(`Failed to export ${type} data`);
      throw error;
    }
  }
}

// Create singleton instance
export const db = new DatabaseService();

// Export types
export type { Customer, Project, EstimateRecord, ProjectFile, ActivityLog };