import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface EstimateData {
  area: number;
  materials: {
    sealer: { gallons: number; cost: number };
    sand: { bags: number; cost: number };
    fastDry: { buckets: number; cost: number };
    prepSeal: { buckets: number; cost: number };
    crackFiller: { boxes: number; cost: number };
    propane: { tanks: number; cost: number };
  };
  labor: {
    hours: number;
    cost: number;
  };
  fuel: {
    distance: number;
    cost: number;
  };
  subtotal: number;
  markup25: number;
  roundedUp: number;
  finalTotal: number;
}

interface ProjectInfo {
  address: string;
  jobType: 'driveway' | 'parking-lot';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  projectDate: string;
  estimateNumber: string;
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
}

const defaultCompanyInfo: CompanyInfo = {
  name: import.meta.env.VITE_COMPANY_NAME || 'PaveEstimator Pro',
  address: import.meta.env.VITE_COMPANY_ADDRESS || '123 Business Street, City, State 12345',
  phone: import.meta.env.VITE_COMPANY_PHONE || '(555) 123-4567',
  email: import.meta.env.VITE_COMPANY_EMAIL || 'info@paveestimator.com',
  website: 'www.paveestimator.com',
  logoUrl: import.meta.env.VITE_COMPANY_LOGO_URL
};

export class ExportService {
  private static generateEstimateNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EST${year}${month}${day}-${random}`;
  }

  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  private static formatNumber(num: number, decimals: number = 2): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  }

  static async exportToPDF(
    estimateData: EstimateData,
    projectInfo: Partial<ProjectInfo> = {},
    companyInfo: Partial<CompanyInfo> = {}
  ): Promise<void> {
    try {
      const company = { ...defaultCompanyInfo, ...companyInfo };
      const project: ProjectInfo = {
        address: projectInfo.address || 'Address not specified',
        jobType: projectInfo.jobType || 'driveway',
        customerName: projectInfo.customerName || 'Customer Name',
        customerEmail: projectInfo.customerEmail || '',
        customerPhone: projectInfo.customerPhone || '',
        projectDate: projectInfo.projectDate || new Date().toLocaleDateString(),
        estimateNumber: projectInfo.estimateNumber || this.generateEstimateNumber(),
      };

      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Set fonts
      pdf.setFont('helvetica');

      // Header Section
      let yPosition = 20;
      
      // Company Logo (if available)
      if (company.logoUrl) {
        try {
          // Note: In a real implementation, you'd load the logo image
          // pdf.addImage(logoData, 'PNG', 20, yPosition, 30, 20);
        } catch (error) {
          console.log('Logo loading failed, continuing without logo');
        }
      }

      // Company Information
      pdf.setFontSize(20);
      pdf.setTextColor(0, 51, 102); // Dark blue
      pdf.text(company.name, 20, yPosition + 10);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(company.address, 20, yPosition + 20);
      pdf.text(`Phone: ${company.phone} | Email: ${company.email}`, 20, yPosition + 27);
      if (company.website) {
        pdf.text(`Website: ${company.website}`, 20, yPosition + 34);
      }

      // Title
      yPosition += 50;
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text('SEALCOATING ESTIMATE', 20, yPosition);
      
      // Estimate Info Box
      yPosition += 15;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition, 170, 30, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Estimate #: ${project.estimateNumber}`, 25, yPosition + 8);
      pdf.text(`Date: ${project.projectDate}`, 25, yPosition + 16);
      pdf.text(`Job Type: ${project.jobType.charAt(0).toUpperCase() + project.jobType.slice(1)}`, 25, yPosition + 24);

      // Customer Information
      yPosition += 40;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 102);
      pdf.text('CUSTOMER INFORMATION', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Name: ${project.customerName}`, 20, yPosition);
      if (project.customerEmail) {
        pdf.text(`Email: ${project.customerEmail}`, 20, yPosition + 8);
      }
      if (project.customerPhone) {
        pdf.text(`Phone: ${project.customerPhone}`, 20, yPosition + 16);
      }
      pdf.text(`Address: ${project.address}`, 20, yPosition + 24);
      pdf.text(`Area: ${this.formatNumber(estimateData.area, 0)} sq ft`, 20, yPosition + 32);

      // Materials and Labor Table
      yPosition += 50;
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 102);
      pdf.text('ESTIMATE BREAKDOWN', 20, yPosition);

      const tableData = [
        // Materials
        ['Sealer', `${this.formatNumber(estimateData.materials.sealer.gallons, 1)} gallons`, this.formatCurrency(estimateData.materials.sealer.cost)],
        ['Sand', `${estimateData.materials.sand.bags} bags`, this.formatCurrency(estimateData.materials.sand.cost)],
        ['Fast Dry Additive', `${estimateData.materials.fastDry.buckets} buckets`, this.formatCurrency(estimateData.materials.fastDry.cost)],
        ['Prep Seal', `${estimateData.materials.prepSeal.buckets} buckets`, this.formatCurrency(estimateData.materials.prepSeal.cost)],
        ['Crack Filler', `${estimateData.materials.crackFiller.boxes} boxes`, this.formatCurrency(estimateData.materials.crackFiller.cost)],
        ['Propane', `${estimateData.materials.propane.tanks} tanks`, this.formatCurrency(estimateData.materials.propane.cost)],
        
        // Labor and Fuel
        ['Labor', `${estimateData.labor.hours} hours`, this.formatCurrency(estimateData.labor.cost)],
        ['Fuel & Transportation', `${estimateData.fuel.distance} miles`, this.formatCurrency(estimateData.fuel.cost)],
      ];

      autoTable(pdf, {
        startY: yPosition + 10,
        head: [['Description', 'Quantity', 'Cost']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 50, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
        },
        margin: { left: 20, right: 20 },
      });

      // Cost Summary
      const finalY = (pdf as any).lastAutoTable.finalY + 20;
      
      // Summary box
      pdf.setFillColor(250, 250, 250);
      pdf.rect(120, finalY, 70, 40, 'F');
      pdf.setLineWidth(0.5);
      pdf.rect(120, finalY, 70, 40);

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Subtotal:', 125, finalY + 8);
      pdf.text(this.formatCurrency(estimateData.subtotal), 185, finalY + 8, { align: 'right' });
      
      pdf.text('25% Markup:', 125, finalY + 16);
      pdf.text(this.formatCurrency(estimateData.markup25 - estimateData.subtotal), 185, finalY + 16, { align: 'right' });
      
      pdf.setLineWidth(1);
      pdf.line(125, finalY + 22, 185, finalY + 22);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL:', 125, finalY + 32);
      pdf.text(this.formatCurrency(estimateData.finalTotal), 185, finalY + 32, { align: 'right' });

      // Terms and Conditions
      const termsY = finalY + 55;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 51, 102);
      pdf.text('TERMS & CONDITIONS', 20, termsY);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const terms = [
        '• This estimate is valid for 30 days from the date above.',
        '• 50% deposit required before work begins.',
        '• Weather conditions may affect scheduling.',
        '• Final cost may vary based on actual site conditions.',
        '• All work performed in accordance with industry standards.',
        '• Customer responsible for marking underground utilities.'
      ];
      
      terms.forEach((term, index) => {
        pdf.text(term, 20, termsY + 10 + (index * 6));
      });

      // Footer
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Generated by PaveEstimator Pro', 20, pageHeight - 10);
      pdf.text(new Date().toLocaleString(), 190, pageHeight - 10, { align: 'right' });

      // Save the PDF
      const fileName = `sealcoating-estimate-${project.estimateNumber}.pdf`;
      pdf.save(fileName);
      
      toast.success(`PDF exported successfully: ${fileName}`);
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    }
  }

  static async exportToExcel(
    estimateData: EstimateData,
    projectInfo: Partial<ProjectInfo> = {},
    companyInfo: Partial<CompanyInfo> = {}
  ): Promise<void> {
    try {
      const company = { ...defaultCompanyInfo, ...companyInfo };
      const project: ProjectInfo = {
        address: projectInfo.address || 'Address not specified',
        jobType: projectInfo.jobType || 'driveway',
        customerName: projectInfo.customerName || 'Customer Name',
        customerEmail: projectInfo.customerEmail || '',
        customerPhone: projectInfo.customerPhone || '',
        projectDate: projectInfo.projectDate || new Date().toLocaleDateString(),
        estimateNumber: projectInfo.estimateNumber || this.generateEstimateNumber(),
      };

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Estimate Summary Sheet
      const summaryData = [
        ['SEALCOATING ESTIMATE'],
        [],
        ['Company Information'],
        ['Company Name', company.name],
        ['Address', company.address],
        ['Phone', company.phone],
        ['Email', company.email],
        [],
        ['Project Information'],
        ['Estimate Number', project.estimateNumber],
        ['Date', project.projectDate],
        ['Customer Name', project.customerName],
        ['Customer Email', project.customerEmail],
        ['Customer Phone', project.customerPhone],
        ['Job Address', project.address],
        ['Job Type', project.jobType],
        ['Area (sq ft)', estimateData.area],
        [],
        ['Materials & Labor'],
        ['Description', 'Quantity', 'Unit Cost', 'Total Cost'],
        ['Sealer', `${this.formatNumber(estimateData.materials.sealer.gallons, 1)} gallons`, '$3.65', this.formatCurrency(estimateData.materials.sealer.cost)],
        ['Sand', `${estimateData.materials.sand.bags} bags`, '$10.00', this.formatCurrency(estimateData.materials.sand.cost)],
        ['Fast Dry Additive', `${estimateData.materials.fastDry.buckets} buckets`, '$50.00', this.formatCurrency(estimateData.materials.fastDry.cost)],
        ['Prep Seal', `${estimateData.materials.prepSeal.buckets} buckets`, '$50.00', this.formatCurrency(estimateData.materials.prepSeal.cost)],
        ['Crack Filler', `${estimateData.materials.crackFiller.boxes} boxes`, '$44.99', this.formatCurrency(estimateData.materials.crackFiller.cost)],
        ['Propane', `${estimateData.materials.propane.tanks} tanks`, '$10.00', this.formatCurrency(estimateData.materials.propane.cost)],
        ['Labor', `${estimateData.labor.hours} hours`, '$12.00', this.formatCurrency(estimateData.labor.cost)],
        ['Fuel & Transportation', `${estimateData.fuel.distance} miles`, 'Variable', this.formatCurrency(estimateData.fuel.cost)],
        [],
        ['Cost Summary'],
        ['Subtotal', this.formatCurrency(estimateData.subtotal)],
        ['25% Markup', this.formatCurrency(estimateData.markup25 - estimateData.subtotal)],
        ['After Markup', this.formatCurrency(estimateData.markup25)],
        ['Rounded Up', this.formatCurrency(estimateData.roundedUp)],
        ['Final Total', this.formatCurrency(estimateData.finalTotal)],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

      // Set column widths
      summarySheet['!cols'] = [
        { width: 25 },
        { width: 20 },
        { width: 15 },
        { width: 15 }
      ];

      // Add the sheet to workbook
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Estimate Summary');

      // Material Calculations Sheet (for advanced users)
      const calculationsData = [
        ['MATERIAL CALCULATIONS'],
        [],
        ['Area (sq ft)', estimateData.area],
        ['Sealer Coverage Rate (sq ft per gallon)', '1/0.13 = 7.69'],
        ['Sand Ratio (bags per 50 gallons sealer)', '1 bag per 50 gallons'],
        ['Fast Dry Ratio (buckets per 150 gallons sealer)', '1 bucket per 150 gallons'],
        ['Crack Filler Coverage (linear feet per box)', '100 ft per box'],
        ['Propane Usage (tanks per 200 ft perimeter)', '1 tank per 200 ft'],
        ['Labor Rate (hours per 1000 sq ft)', '1 hour per 1000 sq ft'],
        ['Labor Cost per Hour', '$12.00'],
        ['Fuel Distance to SealMaster', '45 miles'],
        ['Fuel Efficiency (mpg)', '8 mpg'],
        ['Fuel Price per Gallon', '$3.50'],
        [],
        ['Detailed Calculations'],
        ['Sealer Gallons', `${estimateData.area} × 0.13 = ${this.formatNumber(estimateData.materials.sealer.gallons, 2)}`],
        ['Sand Bags', `CEIL(${this.formatNumber(estimateData.materials.sealer.gallons, 2)} ÷ 50) = ${estimateData.materials.sand.bags}`],
        ['Fast Dry Buckets', `CEIL(${this.formatNumber(estimateData.materials.sealer.gallons, 2)} ÷ 150) = ${estimateData.materials.fastDry.buckets}`],
        ['Estimated Perimeter', `SQRT(${estimateData.area}) × 4 = ${this.formatNumber(Math.sqrt(estimateData.area) * 4, 0)} ft`],
        ['Crack Filler Boxes', `CEIL(${this.formatNumber(Math.sqrt(estimateData.area) * 4, 0)} ÷ 100) = ${estimateData.materials.crackFiller.boxes}`],
        ['Propane Tanks', `CEIL(${this.formatNumber(Math.sqrt(estimateData.area) * 4, 0)} ÷ 200) = ${estimateData.materials.propane.tanks}`],
        ['Labor Hours', `CEIL(${estimateData.area} ÷ 1000) = ${estimateData.labor.hours}`],
        ['Round Trip Distance', `${estimateData.fuel.distance / 2} × 2 = ${estimateData.fuel.distance} miles`],
        ['Fuel Gallons', `${estimateData.fuel.distance} ÷ 8 = ${this.formatNumber(estimateData.fuel.distance / 8, 2)}`],
      ];

      const calculationsSheet = XLSX.utils.aoa_to_sheet(calculationsData);
      calculationsSheet['!cols'] = [
        { width: 30 },
        { width: 40 }
      ];

      XLSX.utils.book_append_sheet(workbook, calculationsSheet, 'Calculations');

      // Export the file
      const fileName = `sealcoating-estimate-${project.estimateNumber}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success(`Excel file exported successfully: ${fileName}`);
    } catch (error) {
      console.error('Excel export error:', error);
      toast.error('Failed to export Excel file. Please try again.');
    }
  }

  // Quick export methods
  static exportEstimatePDF(estimateData: EstimateData, address: string, jobType: 'driveway' | 'parking-lot') {
    return this.exportToPDF(estimateData, { address, jobType });
  }

  static exportEstimateExcel(estimateData: EstimateData, address: string, jobType: 'driveway' | 'parking-lot') {
    return this.exportToExcel(estimateData, { address, jobType });
  }
}