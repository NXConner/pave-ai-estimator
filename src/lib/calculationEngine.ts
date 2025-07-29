import { toast } from 'sonner';

// Types for the enhanced calculation engine
export interface MaterialPricing {
  sealer: {
    pricePerGallon: number;
    coverageRate: number; // sq ft per gallon
    supplier: string;
  };
  sand: {
    pricePerBag: number;
    bagsPerGallon: number; // bags needed per gallon of sealer
    supplier: string;
  };
  fastDry: {
    pricePerBucket: number;
    bucketsPerGallon: number; // buckets needed per gallon of sealer
    supplier: string;
  };
  prepSeal: {
    pricePerBucket: number;
    bucketsPerProject: number; // typically 1 per project
    supplier: string;
  };
  crackFiller: {
    pricePerBox: number;
    coveragePerBox: number; // linear feet per box
    supplier: string;
  };
  propane: {
    pricePerTank: number;
    tanksPerLinearFoot: number; // tanks needed per linear foot
    supplier: string;
  };
}

export interface LaborRates {
  hourlyRate: number;
  hoursPerSqFt: number;
  minimumHours: number;
  overtimeMultiplier: number;
  skillLevel: 'basic' | 'intermediate' | 'expert';
}

export interface RegionalPricing {
  region: string;
  state: string;
  taxRate: number;
  materials: MaterialPricing;
  labor: LaborRates;
  fuel: {
    pricePerGallon: number;
    mpg: number;
    roundTripDistance: number;
  };
  businessCosts: {
    insuranceRate: number; // percentage of project cost
    equipmentDepreciation: number; // flat rate per project
    permitCosts: number; // flat rate per project
  };
}

export interface PricingTiers {
  residential: {
    markup: number;
    minimumCharge: number;
  };
  commercial: {
    markup: number;
    minimumCharge: number;
    volumeDiscounts: {
      threshold: number; // sq ft
      discount: number; // percentage
    }[];
  };
  industrial: {
    markup: number;
    minimumCharge: number;
    volumeDiscounts: {
      threshold: number;
      discount: number;
    }[];
  };
}

export interface DetailedEstimate {
  projectInfo: {
    area: number;
    jobType: 'driveway' | 'parking-lot';
    address: string;
    region: string;
    estimateDate: Date;
    validUntil: Date;
  };
  materials: {
    sealer: { quantity: number; unitCost: number; totalCost: number; supplier: string };
    sand: { quantity: number; unitCost: number; totalCost: number; supplier: string };
    fastDry: { quantity: number; unitCost: number; totalCost: number; supplier: string };
    prepSeal: { quantity: number; unitCost: number; totalCost: number; supplier: string };
    crackFiller: { quantity: number; unitCost: number; totalCost: number; supplier: string };
    propane: { quantity: number; unitCost: number; totalCost: number; supplier: string };
  };
  labor: {
    hours: number;
    rate: number;
    totalCost: number;
    skillLevel: string;
  };
  expenses: {
    fuel: { distance: number; rate: number; totalCost: number };
    insurance: { rate: number; totalCost: number };
    equipment: { totalCost: number };
    permits: { totalCost: number };
  };
  pricing: {
    subtotal: number;
    markup: number;
    markupAmount: number;
    beforeTax: number;
    taxRate: number;
    taxAmount: number;
    finalTotal: number;
    pricePerSqFt: number;
  };
  profitAnalysis: {
    grossProfit: number;
    profitMargin: number;
    breakEvenPoint: number;
  };
}

// Default regional pricing data
const DEFAULT_REGIONAL_PRICING: Record<string, RegionalPricing> = {
  'virginia': {
    region: 'Virginia',
    state: 'VA',
    taxRate: 0.053, // 5.3% state sales tax
    materials: {
      sealer: {
        pricePerGallon: 3.65,
        coverageRate: 7.69, // 1/0.13
        supplier: 'SealMaster'
      },
      sand: {
        pricePerBag: 10.00,
        bagsPerGallon: 0.02, // 1 bag per 50 gallons
        supplier: 'Local Supplier'
      },
      fastDry: {
        pricePerBucket: 50.00,
        bucketsPerGallon: 0.0067, // 1 bucket per 150 gallons
        supplier: 'SealMaster'
      },
      prepSeal: {
        pricePerBucket: 50.00,
        bucketsPerProject: 1,
        supplier: 'SealMaster'
      },
      crackFiller: {
        pricePerBox: 44.99,
        coveragePerBox: 100, // linear feet
        supplier: 'SealMaster'
      },
      propane: {
        pricePerTank: 10.00,
        tanksPerLinearFoot: 0.005, // 1 tank per 200 ft
        supplier: 'Local Gas Station'
      }
    },
    labor: {
      hourlyRate: 12.00,
      hoursPerSqFt: 0.001, // 1 hour per 1000 sq ft
      minimumHours: 2,
      overtimeMultiplier: 1.5,
      skillLevel: 'intermediate'
    },
    fuel: {
      pricePerGallon: 3.50,
      mpg: 8, // C30 truck
      roundTripDistance: 90 // 45 miles each way to SealMaster
    },
    businessCosts: {
      insuranceRate: 0.02, // 2% of project cost
      equipmentDepreciation: 25.00,
      permitCosts: 0.00 // No permits required for most residential
    }
  },
  'north-carolina': {
    region: 'North Carolina',
    state: 'NC',
    taxRate: 0.0475, // 4.75% state sales tax
    materials: {
      sealer: {
        pricePerGallon: 3.85,
        coverageRate: 7.69,
        supplier: 'SealMaster'
      },
      sand: {
        pricePerBag: 12.00,
        bagsPerGallon: 0.02,
        supplier: 'Local Supplier'
      },
      fastDry: {
        pricePerBucket: 55.00,
        bucketsPerGallon: 0.0067,
        supplier: 'SealMaster'
      },
      prepSeal: {
        pricePerBucket: 55.00,
        bucketsPerProject: 1,
        supplier: 'SealMaster'
      },
      crackFiller: {
        pricePerBox: 47.99,
        coveragePerBox: 100,
        supplier: 'SealMaster'
      },
      propane: {
        pricePerTank: 12.00,
        tanksPerLinearFoot: 0.005,
        supplier: 'Local Gas Station'
      }
    },
    labor: {
      hourlyRate: 14.00,
      hoursPerSqFt: 0.001,
      minimumHours: 2,
      overtimeMultiplier: 1.5,
      skillLevel: 'intermediate'
    },
    fuel: {
      pricePerGallon: 3.65,
      mpg: 8,
      roundTripDistance: 80
    },
    businessCosts: {
      insuranceRate: 0.025,
      equipmentDepreciation: 30.00,
      permitCosts: 25.00
    }
  }
};

// Pricing tiers for different customer types
const PRICING_TIERS: PricingTiers = {
  residential: {
    markup: 0.25, // 25%
    minimumCharge: 200.00
  },
  commercial: {
    markup: 0.20, // 20%
    minimumCharge: 500.00,
    volumeDiscounts: [
      { threshold: 5000, discount: 0.05 }, // 5% off for 5000+ sq ft
      { threshold: 10000, discount: 0.10 }, // 10% off for 10000+ sq ft
      { threshold: 25000, discount: 0.15 }  // 15% off for 25000+ sq ft
    ]
  },
  industrial: {
    markup: 0.15, // 15%
    minimumCharge: 1000.00,
    volumeDiscounts: [
      { threshold: 10000, discount: 0.05 },
      { threshold: 25000, discount: 0.10 },
      { threshold: 50000, discount: 0.20 }
    ]
  }
};

export class AdvancedCalculationEngine {
  private regionalPricing: Record<string, RegionalPricing>;
  private pricingTiers: PricingTiers;

  constructor() {
    this.regionalPricing = { ...DEFAULT_REGIONAL_PRICING };
    this.pricingTiers = { ...PRICING_TIERS };
  }

  // Add or update regional pricing
  updateRegionalPricing(region: string, pricing: RegionalPricing): void {
    this.regionalPricing[region.toLowerCase()] = pricing;
    toast.success(`Pricing updated for ${region}`);
  }

  // Get available regions
  getAvailableRegions(): string[] {
    return Object.keys(this.regionalPricing).map(key => 
      this.regionalPricing[key].region
    );
  }

  // Calculate detailed estimate
  calculateDetailedEstimate(
    area: number,
    jobType: 'driveway' | 'parking-lot',
    address: string,
    region: string = 'virginia',
    customerType: 'residential' | 'commercial' | 'industrial' = 'residential'
  ): DetailedEstimate {
    const pricing = this.regionalPricing[region.toLowerCase()];
    if (!pricing) {
      throw new Error(`Pricing data not available for region: ${region}`);
    }

    const tier = this.pricingTiers[customerType];
    
    // Calculate estimated perimeter (square approximation)
    const estimatedPerimeter = Math.sqrt(area) * 4;

    // Material calculations
    const sealerGallons = area / pricing.materials.sealer.coverageRate;
    const materials = {
      sealer: {
        quantity: sealerGallons,
        unitCost: pricing.materials.sealer.pricePerGallon,
        totalCost: sealerGallons * pricing.materials.sealer.pricePerGallon,
        supplier: pricing.materials.sealer.supplier
      },
      sand: {
        quantity: Math.ceil(sealerGallons * pricing.materials.sand.bagsPerGallon),
        unitCost: pricing.materials.sand.pricePerBag,
        totalCost: Math.ceil(sealerGallons * pricing.materials.sand.bagsPerGallon) * pricing.materials.sand.pricePerBag,
        supplier: pricing.materials.sand.supplier
      },
      fastDry: {
        quantity: Math.ceil(sealerGallons * pricing.materials.fastDry.bucketsPerGallon),
        unitCost: pricing.materials.fastDry.pricePerBucket,
        totalCost: Math.ceil(sealerGallons * pricing.materials.fastDry.bucketsPerGallon) * pricing.materials.fastDry.pricePerBucket,
        supplier: pricing.materials.fastDry.supplier
      },
      prepSeal: {
        quantity: pricing.materials.prepSeal.bucketsPerProject,
        unitCost: pricing.materials.prepSeal.pricePerBucket,
        totalCost: pricing.materials.prepSeal.bucketsPerProject * pricing.materials.prepSeal.pricePerBucket,
        supplier: pricing.materials.prepSeal.supplier
      },
      crackFiller: {
        quantity: Math.ceil(estimatedPerimeter / pricing.materials.crackFiller.coveragePerBox),
        unitCost: pricing.materials.crackFiller.pricePerBox,
        totalCost: Math.ceil(estimatedPerimeter / pricing.materials.crackFiller.coveragePerBox) * pricing.materials.crackFiller.pricePerBox,
        supplier: pricing.materials.crackFiller.supplier
      },
      propane: {
        quantity: Math.ceil(estimatedPerimeter * pricing.materials.propane.tanksPerLinearFoot),
        unitCost: pricing.materials.propane.pricePerTank,
        totalCost: Math.ceil(estimatedPerimeter * pricing.materials.propane.tanksPerLinearFoot) * pricing.materials.propane.pricePerTank,
        supplier: pricing.materials.propane.supplier
      }
    };

    // Labor calculations
    const laborHours = Math.max(
      area * pricing.labor.hoursPerSqFt,
      pricing.labor.minimumHours
    );
    const labor = {
      hours: laborHours,
      rate: pricing.labor.hourlyRate,
      totalCost: laborHours * pricing.labor.hourlyRate,
      skillLevel: pricing.labor.skillLevel
    };

    // Expense calculations
    const fuelGallons = pricing.fuel.roundTripDistance / pricing.fuel.mpg;
    const subtotalForExpenses = Object.values(materials).reduce((sum, mat) => sum + mat.totalCost, 0) + labor.totalCost;
    
    const expenses = {
      fuel: {
        distance: pricing.fuel.roundTripDistance,
        rate: pricing.fuel.pricePerGallon,
        totalCost: fuelGallons * pricing.fuel.pricePerGallon
      },
      insurance: {
        rate: pricing.businessCosts.insuranceRate,
        totalCost: subtotalForExpenses * pricing.businessCosts.insuranceRate
      },
      equipment: {
        totalCost: pricing.businessCosts.equipmentDepreciation
      },
      permits: {
        totalCost: pricing.businessCosts.permitCosts
      }
    };

    // Calculate subtotal
    const subtotal = subtotalForExpenses + 
                    expenses.fuel.totalCost + 
                    expenses.insurance.totalCost + 
                    expenses.equipment.totalCost + 
                    expenses.permits.totalCost;

    // Apply volume discounts for commercial/industrial
    let effectiveMarkup = tier.markup;
    if (customerType !== 'residential') {
      const applicableDiscount = tier.volumeDiscounts
        .filter(discount => area >= discount.threshold)
        .sort((a, b) => b.threshold - a.threshold)[0];
      
      if (applicableDiscount) {
        effectiveMarkup = tier.markup * (1 - applicableDiscount.discount);
      }
    }

    // Pricing calculations
    const markupAmount = subtotal * effectiveMarkup;
    const beforeTax = subtotal + markupAmount;
    const taxAmount = beforeTax * pricing.taxRate;
    const finalTotal = Math.max(beforeTax + taxAmount, tier.minimumCharge);

    const pricingDetails = {
      subtotal,
      markup: effectiveMarkup,
      markupAmount,
      beforeTax,
      taxRate: pricing.taxRate,
      taxAmount,
      finalTotal,
      pricePerSqFt: finalTotal / area
    };

    // Profit analysis
    const profitAnalysis = {
      grossProfit: markupAmount,
      profitMargin: (markupAmount / finalTotal) * 100,
      breakEvenPoint: subtotal
    };

    return {
      projectInfo: {
        area,
        jobType,
        address,
        region: pricing.region,
        estimateDate: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      materials,
      labor,
      expenses,
      pricing: pricingDetails,
      profitAnalysis
    };
  }

  // Quick estimate (compatible with existing interface)
  calculateQuickEstimate(area: number, region: string = 'virginia'): any {
    const detailed = this.calculateDetailedEstimate(area, 'driveway', '', region);
    
    return {
      area,
      materials: {
        sealer: { 
          gallons: detailed.materials.sealer.quantity, 
          cost: detailed.materials.sealer.totalCost 
        },
        sand: { 
          bags: detailed.materials.sand.quantity, 
          cost: detailed.materials.sand.totalCost 
        },
        fastDry: { 
          buckets: detailed.materials.fastDry.quantity, 
          cost: detailed.materials.fastDry.totalCost 
        },
        prepSeal: { 
          buckets: detailed.materials.prepSeal.quantity, 
          cost: detailed.materials.prepSeal.totalCost 
        },
        crackFiller: { 
          boxes: detailed.materials.crackFiller.quantity, 
          cost: detailed.materials.crackFiller.totalCost 
        },
        propane: { 
          tanks: detailed.materials.propane.quantity, 
          cost: detailed.materials.propane.totalCost 
        },
      },
      labor: {
        hours: detailed.labor.hours,
        cost: detailed.labor.totalCost
      },
      fuel: {
        distance: detailed.expenses.fuel.distance,
        cost: detailed.expenses.fuel.totalCost
      },
      subtotal: detailed.pricing.subtotal,
      markup25: detailed.pricing.beforeTax,
      roundedUp: Math.ceil(detailed.pricing.beforeTax / 10) * 10,
      finalTotal: detailed.pricing.finalTotal
    };
  }

  // Export regional pricing for admin use
  exportRegionalPricing(): string {
    return JSON.stringify(this.regionalPricing, null, 2);
  }

  // Import regional pricing from JSON
  importRegionalPricing(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData);
      this.regionalPricing = { ...this.regionalPricing, ...imported };
      toast.success('Regional pricing data imported successfully');
    } catch (error) {
      toast.error('Failed to import pricing data: Invalid JSON format');
      throw error;
    }
  }
}

// Create singleton instance
export const calculationEngine = new AdvancedCalculationEngine();

// Export types for use in other modules
export type { RegionalPricing, MaterialPricing, LaborRates, DetailedEstimate };