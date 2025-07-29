import { toast } from 'sonner';
import { db } from './database';

// Business Service Interfaces
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: [number, number];
  };
  customerType: 'residential' | 'commercial' | 'government';
  status: 'lead' | 'active' | 'inactive' | 'suspended';
  notes: string;
  tags: string[];
  totalProjects: number;
  totalRevenue: number;
  averageProjectValue: number;
  lastContact: Date;
  leadSource: string;
  creditRating?: 'excellent' | 'good' | 'fair' | 'poor';
  paymentTerms: number; // days
  discountRate: number; // percentage
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  customer_id: string;
  name: string;
  description: string;
  status: 'draft' | 'quoted' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  job_type: 'driveway' | 'parking-lot' | 'walkway' | 'patio' | 'other';
  location: {
    address: string;
    coordinates: [number, number];
    siteConditions: string;
    accessNotes: string;
  };
  timeline: {
    estimatedStart: Date;
    estimatedCompletion: Date;
    actualStart?: Date;
    actualCompletion?: Date;
    milestones: ProjectMilestone[];
  };
  budget: {
    estimated: number;
    approved?: number;
    actual?: number;
    changeOrders: ChangeOrder[];
  };
  team: {
    projectManager: string;
    crew: string[];
    supervisor: string;
  };
  materials: MaterialRequirement[];
  weather_dependency: boolean;
  permit_required: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
}

export interface ChangeOrder {
  id: string;
  description: string;
  amount: number;
  reason: string;
  approvedBy?: string;
  approvedDate?: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MaterialRequirement {
  id: string;
  name: string;
  category: 'sealcoat' | 'crack_filler' | 'primer' | 'sand' | 'equipment' | 'other';
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier: string;
  orderDate?: Date;
  deliveryDate?: Date;
  status: 'pending' | 'ordered' | 'delivered' | 'used';
}

export interface Proposal {
  id: string;
  project_id: string;
  customer_id: string;
  version: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  sections: ProposalSection[];
  terms: string;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentSchedule: PaymentSchedule[];
  digitalSignature?: {
    customerName: string;
    signedDate: Date;
    ipAddress: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface ProposalSection {
  id: string;
  title: string;
  description: string;
  items: ProposalItem[];
  subtotal: number;
}

export interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface PaymentSchedule {
  id: string;
  description: string;
  percentage: number;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidDate?: Date;
}

export interface Invoice {
  id: string;
  project_id: string;
  customer_id: string;
  proposal_id?: string;
  invoiceNumber: string;
  type: 'estimate' | 'progress' | 'final' | 'change_order';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentHistory: PaymentRecord[];
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  taxable: boolean;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'online';
  reference: string;
  notes?: string;
}

export interface BusinessAnalytics {
  revenue: {
    total: number;
    monthly: MonthlyRevenue[];
    byJobType: RevenueByCategory[];
    growth: number; // percentage
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
    averageDuration: number; // days
  };
  customers: {
    total: number;
    active: number;
    acquisitionRate: number;
    retentionRate: number;
    averageLifetimeValue: number;
  };
  profitability: {
    grossMargin: number;
    netMargin: number;
    costBreakdown: CostCategory[];
  };
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  projects: number;
}

export interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
}

export interface CostCategory {
  category: string;
  amount: number;
  percentage: number;
}

// Customer Relationship Management Service
export class CRMService {
  private static instance: CRMService;

  static getInstance(): CRMService {
    if (!this.instance) {
      this.instance = new CRMService();
    }
    return this.instance;
  }

  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'totalProjects' | 'totalRevenue' | 'averageProjectValue'>): Promise<Customer> {
    try {
      const customer = await db.createCustomer({
        ...customerData,
        totalProjects: 0,
        totalRevenue: 0,
        averageProjectValue: 0
      });
      
      toast.success('Customer created successfully');
      return customer;
    } catch (error) {
      toast.error('Failed to create customer');
      throw error;
    }
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const customer = await db.updateCustomer(id, updates);
      toast.success('Customer updated successfully');
      return customer;
    } catch (error) {
      toast.error('Failed to update customer');
      throw error;
    }
  }

  async getCustomers(filters?: { status?: Customer['status']; customerType?: Customer['customerType']; search?: string }): Promise<Customer[]> {
    try {
      if (filters?.search) {
        return await db.searchCustomers(filters.search);
      }
      return await db.getCustomers();
    } catch (error) {
      toast.error('Failed to load customers');
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      return await db.getCustomers().then(customers => customers.find(c => c.id === id) || null);
    } catch (error) {
      toast.error('Failed to load customer');
      throw error;
    }
  }

  async getCustomerProjects(customerId: string): Promise<Project[]> {
    try {
      return await db.getProjects({ customer_id: customerId });
    } catch (error) {
      toast.error('Failed to load customer projects');
      throw error;
    }
  }

  async calculateCustomerLifetimeValue(customerId: string): Promise<number> {
    try {
      const projects = await this.getCustomerProjects(customerId);
      return projects.reduce((total, project) => total + (project.budget.actual || project.budget.estimated), 0);
    } catch (error) {
      return 0;
    }
  }

  async segmentCustomers(): Promise<{ segment: string; customers: Customer[]; characteristics: string[] }[]> {
    const customers = await this.getCustomers();
    
    const segments = [
      {
        segment: 'High Value',
        customers: customers.filter(c => c.totalRevenue > 10000),
        characteristics: ['Revenue > $10,000', 'Multiple projects', 'Commercial/Government']
      },
      {
        segment: 'Regular Residential',
        customers: customers.filter(c => c.customerType === 'residential' && c.totalRevenue > 1000),
        characteristics: ['Residential customers', 'Repeat business', 'Revenue > $1,000']
      },
      {
        segment: 'New Leads',
        customers: customers.filter(c => c.status === 'lead'),
        characteristics: ['Potential customers', 'Not yet converted', 'Require follow-up']
      }
    ];

    return segments;
  }
}

// Project Management Service
export class ProjectManagementService {
  private static instance: ProjectManagementService;

  static getInstance(): ProjectManagementService {
    if (!this.instance) {
      this.instance = new ProjectManagementService();
    }
    return this.instance;
  }

  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    try {
      const project = await db.createProject(projectData);
      
      // Log activity
      await db.logActivity('project_created', `Project "${project.name}" created`, {
        project_id: project.id,
        customer_id: project.customer_id
      });
      
      toast.success('Project created successfully');
      return project;
    } catch (error) {
      toast.error('Failed to create project');
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const project = await db.updateProject(id, updates);
      
      // Log activity for status changes
      if (updates.status) {
        await db.logActivity('project_status_change', `Project status changed to ${updates.status}`, {
          project_id: id,
          old_status: project.status,
          new_status: updates.status
        });
      }
      
      toast.success('Project updated successfully');
      return project;
    } catch (error) {
      toast.error('Failed to update project');
      throw error;
    }
  }

  async getProjects(filters?: { status?: Project['status']; priority?: Project['priority']; customer_id?: string }): Promise<Project[]> {
    try {
      return await db.getProjects(filters);
    } catch (error) {
      toast.error('Failed to load projects');
      throw error;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      return await db.getProjectById(id);
    } catch (error) {
      toast.error('Failed to load project');
      throw error;
    }
  }

  async addMilestone(projectId: string, milestone: Omit<ProjectMilestone, 'id'>): Promise<void> {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) throw new Error('Project not found');

      const newMilestone: ProjectMilestone = {
        ...milestone,
        id: `milestone_${Date.now()}`
      };

      const updatedTimeline = {
        ...project.timeline,
        milestones: [...project.timeline.milestones, newMilestone]
      };

      await this.updateProject(projectId, { timeline: updatedTimeline });
      toast.success('Milestone added successfully');
    } catch (error) {
      toast.error('Failed to add milestone');
      throw error;
    }
  }

  async updateMilestone(projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>): Promise<void> {
    try {
      const project = await this.getProjectById(projectId);
      if (!project) throw new Error('Project not found');

      const updatedMilestones = project.timeline.milestones.map(m => 
        m.id === milestoneId ? { ...m, ...updates } : m
      );

      const updatedTimeline = {
        ...project.timeline,
        milestones: updatedMilestones
      };

      await this.updateProject(projectId, { timeline: updatedTimeline });
      toast.success('Milestone updated successfully');
    } catch (error) {
      toast.error('Failed to update milestone');
      throw error;
    }
  }

  async getProjectCalendar(startDate: Date, endDate: Date): Promise<{ date: Date; projects: Project[]; milestones: ProjectMilestone[] }[]> {
    const projects = await this.getProjects();
    const calendar: { date: Date; projects: Project[]; milestones: ProjectMilestone[] }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayProjects = projects.filter(p => {
        const start = new Date(p.timeline.estimatedStart);
        const end = new Date(p.timeline.estimatedCompletion);
        return currentDate >= start && currentDate <= end;
      });

      const dayMilestones = projects.flatMap(p => 
        p.timeline.milestones.filter(m => {
          const milestoneDate = new Date(m.targetDate);
          return milestoneDate.toDateString() === currentDate.toDateString();
        })
      );

      calendar.push({
        date: new Date(currentDate),
        projects: dayProjects,
        milestones: dayMilestones
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendar;
  }

  async generateProjectTimeline(projectId: string): Promise<{ task: string; start: Date; end: Date; dependencies: string[] }[]> {
    const project = await this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    // Generate standard timeline based on project type and area
    const baseTasks = [
      { task: 'Site preparation', duration: 1 },
      { task: 'Crack filling', duration: 1 },
      { task: 'Primer application', duration: 1 },
      { task: 'Sealcoat application', duration: 2 },
      { task: 'Curing time', duration: 2 },
      { task: 'Final inspection', duration: 1 }
    ];

    const timeline = [];
    let currentDate = new Date(project.timeline.estimatedStart);

    for (let i = 0; i < baseTasks.length; i++) {
      const task = baseTasks[i];
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + task.duration);

      timeline.push({
        task: task.task,
        start: startDate,
        end: endDate,
        dependencies: i > 0 ? [baseTasks[i - 1].task] : []
      });

      currentDate = new Date(endDate);
    }

    return timeline;
  }
}

// Proposal Generation Service
export class ProposalService {
  private static instance: ProposalService;

  static getInstance(): ProposalService {
    if (!this.instance) {
      this.instance = new ProposalService();
    }
    return this.instance;
  }

  async createProposal(proposalData: Omit<Proposal, 'id' | 'created_at' | 'updated_at' | 'version'>): Promise<Proposal> {
    try {
      // Auto-generate proposal sections based on project data
      const project = await db.getProjectById(proposalData.project_id);
      const customer = await db.getCustomers().then(customers => 
        customers.find(c => c.id === proposalData.customer_id)
      );

      if (!project || !customer) {
        throw new Error('Project or customer not found');
      }

      const sections = await this.generateProposalSections(project, customer);
      
      const proposal: Omit<Proposal, 'id' | 'created_at' | 'updated_at'> = {
        ...proposalData,
        version: 1,
        sections,
        totalAmount: sections.reduce((total, section) => total + section.subtotal, 0),
        taxAmount: 0, // Will be calculated
        finalAmount: 0 // Will be calculated
      };

      // Calculate taxes and final amount
      proposal.taxAmount = proposal.totalAmount * 0.08; // 8% tax
      proposal.finalAmount = proposal.totalAmount + proposal.taxAmount - proposal.discountAmount;

      // Save to database (mock implementation)
      const savedProposal = {
        ...proposal,
        id: `proposal_${Date.now()}`,
        created_at: new Date(),
        updated_at: new Date()
      } as Proposal;

      toast.success('Proposal created successfully');
      return savedProposal;
    } catch (error) {
      toast.error('Failed to create proposal');
      throw error;
    }
  }

  private async generateProposalSections(project: Project, customer: Customer): Promise<ProposalSection[]> {
    const sections: ProposalSection[] = [];

    // Site preparation section
    const sitePrep: ProposalSection = {
      id: 'site_prep',
      title: 'Site Preparation',
      description: 'Cleaning and preparation of the work area',
      items: [
        {
          id: 'cleaning',
          description: 'Surface cleaning and debris removal',
          quantity: 1,
          unit: 'lot',
          unitPrice: 150,
          totalPrice: 150
        },
        {
          id: 'crack_repair',
          description: 'Crack filling and repair',
          quantity: 1,
          unit: 'lot',
          unitPrice: 200,
          totalPrice: 200
        }
      ],
      subtotal: 350
    };

    // Materials section
    const materials: ProposalSection = {
      id: 'materials',
      title: 'Materials',
      description: 'High-quality sealcoating materials',
      items: [
        {
          id: 'sealcoat',
          description: 'Premium asphalt sealer',
          quantity: Math.ceil((project.budget.estimated || 1000) / 500), // Estimate gallons
          unit: 'gallon',
          unitPrice: 25,
          totalPrice: Math.ceil((project.budget.estimated || 1000) / 500) * 25
        },
        {
          id: 'sand',
          description: 'Silica sand additive',
          quantity: 10,
          unit: 'pounds',
          unitPrice: 2,
          totalPrice: 20
        }
      ],
      subtotal: Math.ceil((project.budget.estimated || 1000) / 500) * 25 + 20
    };

    // Labor section
    const labor: ProposalSection = {
      id: 'labor',
      title: 'Labor',
      description: 'Professional application and finishing',
      items: [
        {
          id: 'application',
          description: 'Sealcoat application (2 coats)',
          quantity: 1,
          unit: 'lot',
          unitPrice: project.budget.estimated * 0.4 || 400,
          totalPrice: project.budget.estimated * 0.4 || 400
        }
      ],
      subtotal: project.budget.estimated * 0.4 || 400
    };

    sections.push(sitePrep, materials, labor);
    return sections;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    try {
      // Mock implementation - would update in database
      const proposal = { ...updates, id, updated_at: new Date() } as Proposal;
      toast.success('Proposal updated successfully');
      return proposal;
    } catch (error) {
      toast.error('Failed to update proposal');
      throw error;
    }
  }

  async sendProposal(proposalId: string, recipientEmail: string): Promise<void> {
    try {
      // Mock email sending - would integrate with email service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update proposal status
      await this.updateProposal(proposalId, { status: 'sent' });
      
      toast.success(`Proposal sent to ${recipientEmail}`);
    } catch (error) {
      toast.error('Failed to send proposal');
      throw error;
    }
  }

  async generateProposalPDF(proposalId: string): Promise<Blob> {
    try {
      // Mock PDF generation - would use jsPDF or similar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPdfContent = `Proposal ${proposalId} PDF content would be generated here`;
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      
      toast.success('Proposal PDF generated');
      return blob;
    } catch (error) {
      toast.error('Failed to generate proposal PDF');
      throw error;
    }
  }
}

// Billing and Invoice Service
export class BillingService {
  private static instance: BillingService;

  static getInstance(): BillingService {
    if (!this.instance) {
      this.instance = new BillingService();
    }
    return this.instance;
  }

  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'created_at' | 'updated_at' | 'balanceAmount' | 'paymentHistory'>): Promise<Invoice> {
    try {
      const invoiceNumber = this.generateInvoiceNumber();
      const balanceAmount = invoiceData.totalAmount - invoiceData.paidAmount;

      const invoice: Invoice = {
        ...invoiceData,
        id: `invoice_${Date.now()}`,
        invoiceNumber,
        balanceAmount,
        paymentHistory: [],
        created_at: new Date(),
        updated_at: new Date()
      };

      toast.success(`Invoice ${invoiceNumber} created successfully`);
      return invoice;
    } catch (error) {
      toast.error('Failed to create invoice');
      throw error;
    }
  }

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}-${random}`;
  }

  async addPayment(invoiceId: string, payment: Omit<PaymentRecord, 'id'>): Promise<void> {
    try {
      // Mock implementation - would update invoice in database
      const paymentRecord: PaymentRecord = {
        ...payment,
        id: `payment_${Date.now()}`
      };

      // Update invoice paid amount and status
      toast.success(`Payment of $${payment.amount} recorded successfully`);
    } catch (error) {
      toast.error('Failed to record payment');
      throw error;
    }
  }

  async generateInvoicePDF(invoiceId: string): Promise<Blob> {
    try {
      // Mock PDF generation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPdfContent = `Invoice ${invoiceId} PDF content would be generated here`;
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      
      toast.success('Invoice PDF generated');
      return blob;
    } catch (error) {
      toast.error('Failed to generate invoice PDF');
      throw error;
    }
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    try {
      // Mock implementation - would query database for overdue invoices
      const mockOverdueInvoices: Invoice[] = [];
      return mockOverdueInvoices;
    } catch (error) {
      toast.error('Failed to load overdue invoices');
      throw error;
    }
  }

  async generatePaymentReminder(invoiceId: string): Promise<void> {
    try {
      // Mock payment reminder - would send email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Payment reminder sent');
    } catch (error) {
      toast.error('Failed to send payment reminder');
      throw error;
    }
  }
}

// Business Analytics Service
export class BusinessAnalyticsService {
  private static instance: BusinessAnalyticsService;

  static getInstance(): BusinessAnalyticsService {
    if (!this.instance) {
      this.instance = new BusinessAnalyticsService();
    }
    return this.instance;
  }

  async generateBusinessAnalytics(dateRange?: { start: Date; end: Date }): Promise<BusinessAnalytics> {
    try {
      toast.info('Generating business analytics...');
      
      // Mock analytics data - would calculate from real data
      const analytics: BusinessAnalytics = {
        revenue: {
          total: 125000,
          monthly: [
            { month: 'Jan', revenue: 15000, projects: 8 },
            { month: 'Feb', revenue: 18000, projects: 10 },
            { month: 'Mar', revenue: 22000, projects: 12 },
            { month: 'Apr', revenue: 28000, projects: 15 },
            { month: 'May', revenue: 32000, projects: 18 },
            { month: 'Jun', revenue: 10000, projects: 6 }
          ],
          byJobType: [
            { category: 'Driveways', revenue: 75000, percentage: 60 },
            { category: 'Parking Lots', revenue: 40000, percentage: 32 },
            { category: 'Other', revenue: 10000, percentage: 8 }
          ],
          growth: 15.2
        },
        projects: {
          total: 69,
          active: 12,
          completed: 52,
          completionRate: 85.2,
          averageDuration: 3.5
        },
        customers: {
          total: 58,
          active: 42,
          acquisitionRate: 12.5,
          retentionRate: 78.3,
          averageLifetimeValue: 2155
        },
        profitability: {
          grossMargin: 65.5,
          netMargin: 22.8,
          costBreakdown: [
            { category: 'Materials', amount: 35000, percentage: 28 },
            { category: 'Labor', amount: 45000, percentage: 36 },
            { category: 'Equipment', amount: 15000, percentage: 12 },
            { category: 'Overhead', amount: 30000, percentage: 24 }
          ]
        }
      };

      toast.success('Business analytics generated');
      return analytics;
    } catch (error) {
      toast.error('Failed to generate analytics');
      throw error;
    }
  }

  async generateForecast(months: number): Promise<{ month: string; predictedRevenue: number; confidence: number }[]> {
    try {
      const forecast = [];
      const baseRevenue = 25000;
      
      for (let i = 1; i <= months; i++) {
        const seasonalFactor = Math.sin((new Date().getMonth() + i) * Math.PI / 6) * 0.3 + 1;
        const growthFactor = 1 + (0.05 * i / 12); // 5% annual growth
        const predictedRevenue = baseRevenue * seasonalFactor * growthFactor;
        
        forecast.push({
          month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
          predictedRevenue: Math.round(predictedRevenue),
          confidence: Math.max(0.6, 0.9 - (i * 0.05)) // Confidence decreases over time
        });
      }

      return forecast;
    } catch (error) {
      toast.error('Failed to generate forecast');
      throw error;
    }
  }
}

// Main Business Service Manager
export class BusinessServiceManager {
  private crm: CRMService;
  private projectManagement: ProjectManagementService;
  private proposals: ProposalService;
  private billing: BillingService;
  private analytics: BusinessAnalyticsService;

  constructor() {
    this.crm = CRMService.getInstance();
    this.projectManagement = ProjectManagementService.getInstance();
    this.proposals = ProposalService.getInstance();
    this.billing = BillingService.getInstance();
    this.analytics = BusinessAnalyticsService.getInstance();
  }

  getCRMService(): CRMService {
    return this.crm;
  }

  getProjectManagementService(): ProjectManagementService {
    return this.projectManagement;
  }

  getProposalService(): ProposalService {
    return this.proposals;
  }

  getBillingService(): BillingService {
    return this.billing;
  }

  getAnalyticsService(): BusinessAnalyticsService {
    return this.analytics;
  }

  // Integrated workflow for complete customer lifecycle
  async processNewLead(leadData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    projectDescription: string;
    estimatedArea: number;
    jobType: 'driveway' | 'parking-lot';
  }): Promise<{ customer: Customer; project: Project; proposal: Proposal }> {
    try {
      toast.info('Processing new lead...');

      // Create customer
      const customer = await this.crm.createCustomer({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        address: {
          street: leadData.address,
          city: '',
          state: '',
          zipCode: ''
        },
        customerType: 'residential',
        status: 'lead',
        notes: `Lead generated from estimate request`,
        tags: ['new_lead'],
        lastContact: new Date(),
        leadSource: 'website',
        paymentTerms: 30,
        discountRate: 0
      });

      // Create project
      const project = await this.projectManagement.createProject({
        customer_id: customer.id,
        name: `${leadData.jobType} project`,
        description: leadData.projectDescription,
        status: 'draft',
        priority: 'medium',
        job_type: leadData.jobType,
        location: {
          address: leadData.address,
          coordinates: [0, 0], // Would geocode this
          siteConditions: '',
          accessNotes: ''
        },
        timeline: {
          estimatedStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          estimatedCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
          milestones: []
        },
        budget: {
          estimated: leadData.estimatedArea * (leadData.jobType === 'driveway' ? 0.25 : 0.22),
          changeOrders: []
        },
        team: {
          projectManager: 'system',
          crew: [],
          supervisor: ''
        },
        materials: [],
        weather_dependency: true,
        permit_required: false
      });

      // Create proposal
      const proposal = await this.proposals.createProposal({
        project_id: project.id,
        customer_id: customer.id,
        status: 'draft',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sections: [],
        terms: 'Standard terms and conditions apply',
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        finalAmount: 0,
        paymentSchedule: []
      });

      toast.success('Lead processed successfully');
      return { customer, project, proposal };
    } catch (error) {
      toast.error('Failed to process lead');
      throw error;
    }
  }
}

// Global business service instance
export const businessService = new BusinessServiceManager();