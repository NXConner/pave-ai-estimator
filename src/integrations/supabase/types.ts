export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_at: string | null
          description: string | null
          id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          achieved_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          achieved_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          created_at: string | null
          details: Json | null
          event: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_assignments: {
        Row: {
          asset_id: string | null
          asset_type: string
          assigned_at: string | null
          assigned_to: string | null
          condition_in: string | null
          condition_out: string | null
          id: string
          job_id: string | null
          notes: string | null
          returned_at: string | null
        }
        Insert: {
          asset_id?: string | null
          asset_type: string
          assigned_at?: string | null
          assigned_to?: string | null
          condition_in?: string | null
          condition_out?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          returned_at?: string | null
        }
        Update: {
          asset_id?: string | null
          asset_type?: string
          assigned_at?: string | null
          assigned_to?: string | null
          condition_in?: string | null
          condition_out?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          returned_at?: string | null
        }
        Relationships: []
      }
      backups: {
        Row: {
          createdat: string | null
          description: string | null
          downloadurl: string | null
          id: string
          name: string | null
          recordcount: number | null
          size: number | null
          status: string | null
          tables: string[] | null
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          downloadurl?: string | null
          id?: string
          name?: string | null
          recordcount?: number | null
          size?: number | null
          status?: string | null
          tables?: string[] | null
        }
        Update: {
          createdat?: string | null
          description?: string | null
          downloadurl?: string | null
          id?: string
          name?: string | null
          recordcount?: number | null
          size?: number | null
          status?: string | null
          tables?: string[] | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          awarded_at: string | null
          description: string | null
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_allocations: {
        Row: {
          allocated_amount: number
          category_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          job_id: string | null
          spent_amount: number | null
        }
        Insert: {
          allocated_amount: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          job_id?: string | null
          spent_amount?: number | null
        }
        Update: {
          allocated_amount?: number
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          job_id?: string | null
          spent_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_allocations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_notifications: {
        Row: {
          acknowledged: boolean | null
          employee_id: string
          id: string
          message: string
          notification_type: string
          read_at: string | null
          rule_id: string | null
          sent_at: string | null
          task_id: string | null
          title: string
        }
        Insert: {
          acknowledged?: boolean | null
          employee_id: string
          id?: string
          message: string
          notification_type: string
          read_at?: string | null
          rule_id?: string | null
          sent_at?: string | null
          task_id?: string | null
          title: string
        }
        Update: {
          acknowledged?: boolean | null
          employee_id?: string
          id?: string
          message?: string
          notification_type?: string
          read_at?: string | null
          rule_id?: string | null
          sent_at?: string | null
          task_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_notifications_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "compliance_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_rules: {
        Row: {
          auto_enforce: boolean | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          point_deduction: number
          severity: string
          updated_at: string | null
        }
        Insert: {
          auto_enforce?: boolean | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          point_deduction?: number
          severity?: string
          updated_at?: string | null
        }
        Update: {
          auto_enforce?: boolean | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          point_deduction?: number
          severity?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      compliance_zones: {
        Row: {
          created_at: string | null
          geom: unknown | null
          id: string
          name: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          geom?: unknown | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          geom?: unknown | null
          id?: string
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          contract_url: string | null
          created_at: string | null
          customer: string | null
          id: string
          job_id: string | null
          signed: boolean | null
          signed_at: string | null
          signed_by: string | null
          template_id: string | null
          terms: Json | null
        }
        Insert: {
          contract_url?: string | null
          created_at?: string | null
          customer?: string | null
          id?: string
          job_id?: string | null
          signed?: boolean | null
          signed_at?: string | null
          signed_by?: string | null
          template_id?: string | null
          terms?: Json | null
        }
        Update: {
          contract_url?: string | null
          created_at?: string | null
          customer?: string | null
          id?: string
          job_id?: string | null
          signed?: boolean | null
          signed_at?: string | null
          signed_by?: string | null
          template_id?: string | null
          terms?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_signed_by_fkey"
            columns: ["signed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      debriefs: {
        Row: {
          content: string | null
          created_at: string
          date: string
          id: string
          title: string | null
          type: string
          user_id: string
          week_end: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          date: string
          id?: string
          title?: string | null
          type: string
          user_id: string
          week_end?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          title?: string | null
          type?: string
          user_id?: string
          week_end?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          document_type: string | null
          document_url: string | null
          id: string
          job_id: string | null
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          document_type?: string | null
          document_url?: string | null
          id?: string
          job_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          document_type?: string | null
          document_url?: string | null
          id?: string
          job_id?: string | null
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          error_message: string | null
          from_email: string
          id: string
          sent_at: string | null
          status: string | null
          subject: string
          template_name: string | null
          to_email: string
        }
        Insert: {
          error_message?: string | null
          from_email: string
          id?: string
          sent_at?: string | null
          status?: string | null
          subject: string
          template_name?: string | null
          to_email: string
        }
        Update: {
          error_message?: string | null
          from_email?: string
          id?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_name?: string | null
          to_email?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          id: string
          name: string
          subject: string
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          name: string
          subject: string
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          variables?: Json | null
        }
        Relationships: []
      }
      employee_certifications: {
        Row: {
          certificate_number: string | null
          employee_id: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          name: string | null
          status: string | null
        }
        Insert: {
          certificate_number?: string | null
          employee_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          name?: string | null
          status?: string | null
        }
        Update: {
          certificate_number?: string | null
          employee_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_certifications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_scores: {
        Row: {
          created_at: string | null
          current_score: number | null
          employee_id: string
          id: string
          last_updated: string | null
          total_violations: number | null
        }
        Insert: {
          created_at?: string | null
          current_score?: number | null
          employee_id: string
          id?: string
          last_updated?: string | null
          total_violations?: number | null
        }
        Update: {
          created_at?: string | null
          current_score?: number | null
          employee_id?: string
          id?: string
          last_updated?: string | null
          total_violations?: number | null
        }
        Relationships: []
      }
      employee_violations: {
        Row: {
          auto_generated: boolean | null
          created_at: string | null
          description: string | null
          employee_id: string
          id: string
          points_deducted: number
          resolved: boolean | null
          resolved_at: string | null
          rule_id: string | null
          violation_date: string | null
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          employee_id: string
          id?: string
          points_deducted: number
          resolved?: boolean | null
          resolved_at?: string | null
          rule_id?: string | null
          violation_date?: string | null
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          points_deducted?: number
          resolved?: boolean | null
          resolved_at?: string | null
          rule_id?: string | null
          violation_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_violations_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "compliance_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          driver_license_expiry: string | null
          driver_license_number: string | null
          email: string
          emergency_contact_name: string | null
          employment_status: string | null
          first_name: string
          hire_date: string | null
          hourly_rate: number | null
          id: string
          last_name: string
          performance_score: number | null
          phone: string | null
          role: string | null
          salary: number | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          weekly_hours: number | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          driver_license_expiry?: string | null
          driver_license_number?: string | null
          email: string
          emergency_contact_name?: string | null
          employment_status?: string | null
          first_name: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name: string
          performance_score?: number | null
          phone?: string | null
          role?: string | null
          salary?: number | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekly_hours?: number | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          driver_license_expiry?: string | null
          driver_license_number?: string | null
          email?: string
          emergency_contact_name?: string | null
          employment_status?: string | null
          first_name?: string
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          last_name?: string
          performance_score?: number | null
          phone?: string | null
          role?: string | null
          salary?: number | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          weekly_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          created_at: string | null
          id: string
          last_maintenance: string | null
          location: string | null
          model: string | null
          name: string
          next_maintenance: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          type: string
          warranty_expiry: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          model?: string | null
          name: string
          next_maintenance?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          type: string
          warranty_expiry?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          model?: string | null
          name?: string
          next_maintenance?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          type?: string
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      estimates: {
        Row: {
          amount: number | null
          created_at: string | null
          created_by: string | null
          customer: string | null
          id: string
          job_id: string | null
          line_items: Json | null
          notes: string | null
          status: string | null
          valid_until: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer?: string | null
          id?: string
          job_id?: string | null
          line_items?: Json | null
          notes?: string | null
          status?: string | null
          valid_until?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer?: string | null
          id?: string
          job_id?: string | null
          line_items?: Json | null
          notes?: string | null
          status?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_category_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          id: string
          metadata: Json | null
          name: string | null
          path: string | null
          size: number | null
          type: string | null
          uploadedat: string | null
          uploadedby: string | null
          url: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          name?: string | null
          path?: string | null
          size?: number | null
          type?: string | null
          uploadedat?: string | null
          uploadedby?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          name?: string | null
          path?: string | null
          size?: number | null
          type?: string | null
          uploadedat?: string | null
          uploadedby?: string | null
          url?: string | null
        }
        Relationships: []
      }
      fleet_assets: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          license_plate: string | null
          make: string | null
          model: string | null
          name: string
          registration_card_url: string | null
          registration_expiry: string | null
          type: string
          vin: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          license_plate?: string | null
          make?: string | null
          model?: string | null
          name: string
          registration_card_url?: string | null
          registration_expiry?: string | null
          type: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          license_plate?: string | null
          make?: string | null
          model?: string | null
          name?: string
          registration_card_url?: string | null
          registration_expiry?: string | null
          type?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_checklists: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          template: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          template?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          template?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_results: {
        Row: {
          answers: Json | null
          checklist_id: string | null
          completed_at: string | null
          id: string
          job_id: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          checklist_id?: string | null
          completed_at?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          checklist_id?: string | null
          completed_at?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_results_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "inspection_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          quantity: number | null
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          quantity?: number | null
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          quantity?: number | null
          sku?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          crew_size_required: number | null
          customer_id: string | null
          description: string | null
          equipment_needed: string[] | null
          estimated_duration: unknown | null
          id: string
          location_address: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          crew_size_required?: number | null
          customer_id?: string | null
          description?: string | null
          equipment_needed?: string[] | null
          estimated_duration?: unknown | null
          id?: string
          location_address?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          crew_size_required?: number | null
          customer_id?: string | null
          description?: string | null
          equipment_needed?: string[] | null
          estimated_duration?: unknown | null
          id?: string
          location_address?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          last_updated: string | null
          points: number | null
          user_id: string
        }
        Insert: {
          last_updated?: string | null
          points?: number | null
          user_id: string
        }
        Update: {
          last_updated?: string | null
          points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          coordinates: unknown | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_logs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          performed_at: string | null
          performed_by: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          asset_id: string
          created_at: string | null
          filter_notes: string | null
          id: string
          maintenance_notes: string | null
          oil_change_date: string | null
          oil_filter_change_date: string | null
          oil_filter_number: string | null
          oil_quantity: number | null
          oil_type: string | null
          oil_weight: string | null
          plug_size: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          filter_notes?: string | null
          id?: string
          maintenance_notes?: string | null
          oil_change_date?: string | null
          oil_filter_change_date?: string | null
          oil_filter_number?: string | null
          oil_quantity?: number | null
          oil_type?: string | null
          oil_weight?: string | null
          plug_size?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          filter_notes?: string | null
          id?: string
          maintenance_notes?: string | null
          oil_change_date?: string | null
          oil_filter_change_date?: string | null
          oil_filter_number?: string | null
          oil_quantity?: number | null
          oil_type?: string | null
          oil_weight?: string | null
          plug_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "fleet_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_date: string | null
          proposal_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          proposal_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_date?: string | null
          proposal_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          created_at: string | null
          gross_amount: number | null
          id: string
          net_amount: number | null
          pay_period_end: string | null
          pay_period_start: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          pay_period_end?: string | null
          pay_period_start?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          gross_amount?: number | null
          id?: string
          net_amount?: number | null
          pay_period_end?: string | null
          pay_period_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          areas_for_improvement: string[] | null
          comments: string | null
          communication: number | null
          employee_id: string | null
          goals: string[] | null
          id: string
          overall_rating: number | null
          productivity: number | null
          quality_of_work: number | null
          reliability: number | null
          review_date: string | null
          review_period_end: string | null
          review_period_start: string | null
          reviewer_id: string | null
          strengths: string[] | null
          teamwork: number | null
        }
        Insert: {
          areas_for_improvement?: string[] | null
          comments?: string | null
          communication?: number | null
          employee_id?: string | null
          goals?: string[] | null
          id?: string
          overall_rating?: number | null
          productivity?: number | null
          quality_of_work?: number | null
          reliability?: number | null
          review_date?: string | null
          review_period_end?: string | null
          review_period_start?: string | null
          reviewer_id?: string | null
          strengths?: string[] | null
          teamwork?: number | null
        }
        Update: {
          areas_for_improvement?: string[] | null
          comments?: string | null
          communication?: number | null
          employee_id?: string | null
          goals?: string[] | null
          id?: string
          overall_rating?: number | null
          productivity?: number | null
          quality_of_work?: number | null
          reliability?: number | null
          review_date?: string | null
          review_period_end?: string | null
          review_period_start?: string | null
          reviewer_id?: string | null
          strengths?: string[] | null
          teamwork?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contract_signed: boolean | null
          contract_signed_date: string | null
          created_at: string | null
          driver_license_url: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string | null
          full_name: string | null
          hire_date: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          contract_signed?: boolean | null
          contract_signed_date?: string | null
          created_at?: string | null
          driver_license_url?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          full_name?: string | null
          hire_date?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          contract_signed?: boolean | null
          contract_signed_date?: string | null
          created_at?: string | null
          driver_license_url?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string | null
          full_name?: string | null
          hire_date?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          id: string
          name: string | null
          project_id: string | null
          size: number | null
          type: string | null
          uploaded_at: string | null
          uploaded_by: string | null
          url: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          project_id?: string | null
          size?: number | null
          type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          project_id?: string | null
          size?: number | null
          type?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completed_date: string | null
          description: string | null
          id: string
          project_id: string | null
          status: string | null
          target_date: string | null
          tasks: string[] | null
          title: string | null
        }
        Insert: {
          completed_date?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          target_date?: string | null
          tasks?: string[] | null
          title?: string | null
        }
        Update: {
          completed_date?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          target_date?: string | null
          tasks?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          completed_date: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: string | null
          progress: number | null
          project_id: string | null
          project_name: string | null
          start_date: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          project_name?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          progress?: number | null
          project_id?: string | null
          project_name?: string | null
          start_date?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          amount: number
          client_name: string
          created_at: string | null
          created_by: string | null
          id: string
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          cost_id: string | null
          created_at: string | null
          file_url: string | null
          id: string
          uploaded_by: string | null
        }
        Insert: {
          cost_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          cost_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_allocations: {
        Row: {
          allocated_at: string | null
          id: string
          job_id: string | null
          quantity: number | null
          resource_id: string | null
        }
        Insert: {
          allocated_at?: string | null
          id?: string
          job_id?: string | null
          quantity?: number | null
          resource_id?: string | null
        }
        Update: {
          allocated_at?: string | null
          id?: string
          job_id?: string | null
          quantity?: number | null
          resource_id?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          awarded_at: string | null
          description: string | null
          id: string
          reward_type: string | null
          user_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          description?: string | null
          id?: string
          reward_type?: string | null
          user_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          description?: string | null
          id?: string
          reward_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      samples: {
        Row: {
          collected_by: string | null
          created_at: string | null
          data: Json | null
          id: string
          project_id: string | null
        }
        Insert: {
          collected_by?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          project_id?: string | null
        }
        Update: {
          collected_by?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "samples_collected_by_fkey"
            columns: ["collected_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "samples_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduling_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_time: string | null
          id: string
          job_id: string | null
          resource_id: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          id?: string
          job_id?: string | null
          resource_id?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          id?: string
          job_id?: string | null
          resource_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      sync_status: {
        Row: {
          errormessage: string | null
          id: string
          lastsync: string | null
          recordcount: number | null
          status: string | null
          table: string | null
        }
        Insert: {
          errormessage?: string | null
          id?: string
          lastsync?: string | null
          recordcount?: number | null
          status?: string | null
          table?: string | null
        }
        Update: {
          errormessage?: string | null
          id?: string
          lastsync?: string | null
          recordcount?: number | null
          status?: string | null
          table?: string | null
        }
        Relationships: []
      }
      tests: {
        Row: {
          created_at: string | null
          id: string
          result: Json | null
          sample_id: string | null
          test_type: string
          tested_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          result?: Json | null
          sample_id?: string | null
          test_type: string
          tested_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          result?: Json | null
          sample_id?: string | null
          test_type?: string
          tested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "samples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tests_tested_by_fkey"
            columns: ["tested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      time_records: {
        Row: {
          break_duration: number | null
          clock_in: string | null
          clock_out: string | null
          date: string | null
          employee_id: string | null
          id: string
          notes: string | null
          overtime_hours: number | null
          project_id: string | null
          status: string | null
          total_hours: number | null
        }
        Insert: {
          break_duration?: number | null
          clock_in?: string | null
          clock_out?: string | null
          date?: string | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          project_id?: string | null
          status?: string | null
          total_hours?: number | null
        }
        Update: {
          break_duration?: number | null
          clock_in?: string | null
          clock_out?: string | null
          date?: string | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          project_id?: string | null
          status?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "time_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_records_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string
          last_maintenance: string | null
          license_plate: string | null
          location: string | null
          name: string
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          last_maintenance?: string | null
          license_plate?: string | null
          location?: string | null
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string
          last_maintenance?: string | null
          license_plate?: string | null
          location?: string | null
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          contact_info: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          condition: Database["public"]["Enums"]["weather_condition"] | null
          humidity: number | null
          id: string
          location_id: string | null
          recorded_at: string | null
          temperature: number | null
          wind_speed: number | null
        }
        Insert: {
          condition?: Database["public"]["Enums"]["weather_condition"] | null
          humidity?: number | null
          id?: string
          location_id?: string | null
          recorded_at?: string | null
          temperature?: number | null
          wind_speed?: number | null
        }
        Update: {
          condition?: Database["public"]["Enums"]["weather_condition"] | null
          humidity?: number | null
          id?: string
          location_id?: string | null
          recorded_at?: string | null
          temperature?: number | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_data_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      work_schedules: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          created_at: string | null
          crew_member_id: string | null
          id: string
          job_id: string | null
          notes: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          crew_member_id?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          crew_member_id?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown | null
          f_table_catalog: unknown | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown | null
          f_table_catalog: string | null
          f_table_name: unknown | null
          f_table_schema: unknown | null
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown | null
          f_table_catalog?: string | null
          f_table_name?: unknown | null
          f_table_schema?: unknown | null
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { oldname: string; newname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { tbl: unknown; col: string }
        Returns: unknown
      }
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      _postgis_selectivity: {
        Args: { tbl: unknown; att_name: string; geom: unknown; mode?: string }
        Returns: number
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_bestsrid: {
        Args: { "": unknown }
        Returns: number
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_pointoutside: {
        Args: { "": unknown }
        Returns: unknown
      }
      _st_sortablehash: {
        Args: { geom: unknown }
        Returns: number
      }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          g1: unknown
          clip?: unknown
          tolerance?: number
          return_polygons?: boolean
        }
        Returns: unknown
      }
      _st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      addauth: {
        Args: { "": string }
        Returns: boolean
      }
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
              new_srid_in: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              schema_name: string
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
          | {
              table_name: string
              column_name: string
              new_srid: number
              new_type: string
              new_dim: number
              use_typmod?: boolean
            }
        Returns: string
      }
      box: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box2d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box2df_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d: {
        Args: { "": unknown } | { "": unknown }
        Returns: unknown
      }
      box3d_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3d_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      box3dtobox: {
        Args: { "": unknown }
        Returns: unknown
      }
      bytea: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      create_violation: {
        Args: { emp_id: string; rule_id: string; description_text?: string }
        Returns: string
      }
      disablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string
              schema_name: string
              table_name: string
              column_name: string
            }
          | { schema_name: string; table_name: string; column_name: string }
          | { table_name: string; column_name: string }
        Returns: string
      }
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string }
        Returns: string
      }
      enablelongtransactions: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geography: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      geography_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geography_gist_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_gist_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_send: {
        Args: { "": unknown }
        Returns: string
      }
      geography_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geography_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geography_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
        Returns: unknown
      }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_analyze: {
        Args: { "": unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_decompress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_hash: {
        Args: { "": unknown }
        Returns: number
      }
      geometry_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_send: {
        Args: { "": unknown }
        Returns: string
      }
      geometry_sortsupport: {
        Args: { "": unknown }
        Returns: undefined
      }
      geometry_spgist_compress_2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_3d: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_spgist_compress_nd: {
        Args: { "": unknown }
        Returns: unknown
      }
      geometry_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      geometry_typmod_out: {
        Args: { "": number }
        Returns: unknown
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometrytype: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      get_proj4_from_srid: {
        Args: { "": number }
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gettransactionid: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      gidx_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gidx_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      json: {
        Args: { "": unknown }
        Returns: Json
      }
      jsonb: {
        Args: { "": unknown }
        Returns: Json
      }
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      path: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_finalfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_asmvt_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown }
        Returns: unknown[]
      }
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown }
        Returns: string
      }
      point: {
        Args: { "": unknown }
        Returns: unknown
      }
      polygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean }
        Returns: string
      }
      postgis_addbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_constraint_dims: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomschema: string; geomtable: string; geomcolumn: string }
        Returns: string
      }
      postgis_dropbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_full_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_geos_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_geos_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_getbbox: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_hasbbox: {
        Args: { "": unknown }
        Returns: boolean
      }
      postgis_index_supportfn: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_lib_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_noop: {
        Args: { "": unknown }
        Returns: unknown
      }
      postgis_proj_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_svn_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_type_name: {
        Args: {
          geomname: string
          coord_dimension: number
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_typmod_dims: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_srid: {
        Args: { "": number }
        Returns: number
      }
      postgis_typmod_type: {
        Args: { "": number }
        Returns: string
      }
      postgis_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      spheroid_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      spheroid_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlength: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dperimeter: {
        Args: { "": unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
        Returns: number
      }
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_area2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_asbinary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              r: Record<string, unknown>
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
            }
        Returns: string
      }
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              version: number
              geog: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
          | {
              version: number
              geom: unknown
              maxdecimaldigits?: number
              options?: number
              nprefix?: string
              id?: string
            }
        Returns: string
      }
      st_ashexewkb: {
        Args: { "": unknown }
        Returns: string
      }
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
        Returns: string
      }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: {
        Args: { geom: unknown; format?: string }
        Returns: string
      }
      st_asmvtgeom: {
        Args: {
          geom: unknown
          bounds: unknown
          extent?: number
          buffer?: number
          clip_geom?: boolean
        }
        Returns: unknown
      }
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; rel?: number; maxdecimaldigits?: number }
          | { geom: unknown; rel?: number; maxdecimaldigits?: number }
        Returns: string
      }
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      st_astwkb: {
        Args:
          | {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
          | {
              geom: unknown
              prec?: number
              prec_z?: number
              prec_m?: number
              with_sizes?: boolean
              with_boxes?: boolean
            }
        Returns: string
      }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_boundary: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_boundingdiagonal: {
        Args: { geom: unknown; fits?: boolean }
        Returns: unknown
      }
      st_buffer: {
        Args:
          | { geom: unknown; radius: number; options?: string }
          | { geom: unknown; radius: number; quadsegs: number }
        Returns: unknown
      }
      st_buildarea: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_centroid: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      st_cleangeometry: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_clipbybox2d: {
        Args: { geom: unknown; box: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_clusterintersecting: {
        Args: { "": unknown[] }
        Returns: unknown[]
      }
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collectionextract: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_collectionhomogenize: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_concavehull: {
        Args: {
          param_geom: unknown
          param_pctconvex: number
          param_allow_holes?: boolean
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_convexhull: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_coorddim: {
        Args: { geometry: unknown }
        Returns: number
      }
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_curvetoline: {
        Args: { geom: unknown; tol?: number; toltype?: number; flags?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { g1: unknown; tolerance?: number; flags?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_dimension: {
        Args: { "": unknown }
        Returns: number
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number }
        Returns: number
      }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dump: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumppoints: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumprings: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dumpsegments: {
        Args: { "": unknown }
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][]
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_endpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_envelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_equals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { geom: unknown; dx: number; dy: number; dz?: number; dm?: number }
        Returns: unknown
      }
      st_exteriorring: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_flipcoordinates: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force2d: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_force3d: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; zvalue?: number; mvalue?: number }
        Returns: unknown
      }
      st_forcecollection: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcecurve: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygonccw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcepolygoncw: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcerhr: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_forcesfs: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number }
        Returns: unknown
      }
      st_geogfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geogfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geographyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number }
        Returns: string
      }
      st_geomcollfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomcollfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometricmedian: {
        Args: {
          g: unknown
          tolerance?: number
          max_iter?: number
          fail_if_not_converged?: boolean
        }
        Returns: unknown
      }
      st_geometryfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geometrytype: {
        Args: { "": unknown }
        Returns: string
      }
      st_geomfromewkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromewkt: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string }
        Returns: unknown
      }
      st_geomfromgml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromkml: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfrommarc21: {
        Args: { marc21xml: string }
        Returns: unknown
      }
      st_geomfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromtwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_geomfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_gmltosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_hasarc: {
        Args: { geometry: unknown }
        Returns: boolean
      }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_isclosed: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_iscollection: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isempty: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygonccw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_ispolygoncw: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isring: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_issimple: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvalid: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_isvaliddetail: {
        Args: { geom: unknown; flags?: number }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
      }
      st_isvalidreason: {
        Args: { "": unknown }
        Returns: string
      }
      st_isvalidtrajectory: {
        Args: { "": unknown }
        Returns: boolean
      }
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_length2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_letters: {
        Args: { letters: string; font?: Json }
        Returns: unknown
      }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { txtin: string; nprecision?: number }
        Returns: unknown
      }
      st_linefrommultipoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_linefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linemerge: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_linestringfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_linetocurve: {
        Args: { geometry: unknown }
        Returns: unknown
      }
      st_locatealong: {
        Args: { geometry: unknown; measure: number; leftrightoffset?: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          geometry: unknown
          frommeasure: number
          tomeasure: number
          leftrightoffset?: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { geometry: unknown; fromelevation: number; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_m: {
        Args: { "": unknown }
        Returns: number
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makepolygon: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_maximuminscribedcircle: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_memsize: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_minimumboundingradius: {
        Args: { "": unknown }
        Returns: Record<string, unknown>
      }
      st_minimumclearance: {
        Args: { "": unknown }
        Returns: number
      }
      st_minimumclearanceline: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_mlinefromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mlinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_mpolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multi: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_multilinefromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multilinestringfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_multipolygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_ndims: {
        Args: { "": unknown }
        Returns: number
      }
      st_node: {
        Args: { g: unknown }
        Returns: unknown
      }
      st_normalize: {
        Args: { geom: unknown }
        Returns: unknown
      }
      st_npoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_nrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numgeometries: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorring: {
        Args: { "": unknown }
        Returns: number
      }
      st_numinteriorrings: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpatches: {
        Args: { "": unknown }
        Returns: number
      }
      st_numpoints: {
        Args: { "": unknown }
        Returns: number
      }
      st_offsetcurve: {
        Args: { line: unknown; distance: number; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_orientedenvelope: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_perimeter2d: {
        Args: { "": unknown }
        Returns: number
      }
      st_pointfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_pointm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointonsurface: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_points: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
          mcoordinate: number
          srid?: number
        }
        Returns: unknown
      }
      st_polyfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polyfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromtext: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonfromwkb: {
        Args: { "": string }
        Returns: unknown
      }
      st_polygonize: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      st_project: {
        Args: { geog: unknown; distance: number; azimuth: number }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_x: number
          prec_y?: number
          prec_z?: number
          prec_m?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: string
      }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_reverse: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number }
        Returns: unknown
      }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shiftlongitude: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; vertex_fraction: number; is_outer?: boolean }
        Returns: unknown
      }
      st_split: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_square: {
        Args: { size: number; cell_i: number; cell_j: number; origin?: unknown }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { size: number; bounds: unknown }
        Returns: Record<string, unknown>[]
      }
      st_srid: {
        Args: { geog: unknown } | { geom: unknown }
        Returns: number
      }
      st_startpoint: {
        Args: { "": unknown }
        Returns: unknown
      }
      st_subdivide: {
        Args: { geom: unknown; maxvertices?: number; gridsize?: number }
        Returns: unknown[]
      }
      st_summary: {
        Args: { "": unknown } | { "": unknown }
        Returns: string
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          zoom: number
          x: number
          y: number
          bounds?: unknown
          margin?: number
        }
        Returns: unknown
      }
      st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_transform: {
        Args:
          | { geom: unknown; from_proj: string; to_proj: string }
          | { geom: unknown; from_proj: string; to_srid: number }
          | { geom: unknown; to_proj: string }
        Returns: unknown
      }
      st_triangulatepolygon: {
        Args: { g1: unknown }
        Returns: unknown
      }
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number }
        Returns: unknown
      }
      st_voronoilines: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { g1: unknown; tolerance?: number; extend_to?: unknown }
        Returns: unknown
      }
      st_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_wkbtosql: {
        Args: { wkb: string }
        Returns: unknown
      }
      st_wkttosql: {
        Args: { "": string }
        Returns: unknown
      }
      st_wrapx: {
        Args: { geom: unknown; wrap: number; move: number }
        Returns: unknown
      }
      st_x: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_xmin: {
        Args: { "": unknown }
        Returns: number
      }
      st_y: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymax: {
        Args: { "": unknown }
        Returns: number
      }
      st_ymin: {
        Args: { "": unknown }
        Returns: number
      }
      st_z: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmax: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmflag: {
        Args: { "": unknown }
        Returns: number
      }
      st_zmin: {
        Args: { "": unknown }
        Returns: number
      }
      text: {
        Args: { "": unknown }
        Returns: string
      }
      unlockrows: {
        Args: { "": string }
        Returns: number
      }
      update_employee_score: {
        Args: { emp_id: string; points_change: number }
        Returns: undefined
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          schema_name: string
          table_name: string
          column_name: string
          new_srid_in: number
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "Super Administrator"
        | "Administrator"
        | "Estimator"
        | "Field Crew Lead"
        | "Field Technician"
        | "Client"
      project_status: "pending" | "in_progress" | "completed" | "cancelled"
      user_role: "admin" | "manager" | "user"
      weather_condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "Super Administrator",
        "Administrator",
        "Estimator",
        "Field Crew Lead",
        "Field Technician",
        "Client",
      ],
      project_status: ["pending", "in_progress", "completed", "cancelled"],
      user_role: ["admin", "manager", "user"],
      weather_condition: ["sunny", "cloudy", "rainy", "snowy", "windy"],
    },
  },
} as const
