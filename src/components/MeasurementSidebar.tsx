import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileSpreadsheet, Calculator, DollarSign } from 'lucide-react';
import { ExportService } from '@/lib/exportUtils';
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

interface MeasurementSidebarProps {
  area: number;
  jobType: 'driveway' | 'parking-lot';
  address: string;
  onExport: (format: 'pdf' | 'excel') => void;
}

const MeasurementSidebar: React.FC<MeasurementSidebarProps> = ({
  area,
  jobType,
  address,
  onExport
}) => {
  const calculateEstimate = (): EstimateData => {
    // Enhanced material calculations based on provided formulas and environment variables
    const laborRate = parseFloat(import.meta.env.VITE_DEFAULT_LABOR_RATE) || 12.00;
    const fuelPrice = parseFloat(import.meta.env.VITE_DEFAULT_FUEL_PRICE) || 3.50;
    const sealMasterDistance = parseFloat(import.meta.env.VITE_SEALMATER_DISTANCE) || 45;
    const markupPercentage = parseFloat(import.meta.env.VITE_DEFAULT_MARKUP_PERCENTAGE) || 25;
    
    // Material calculations based on provided formulas
    const sealerGallons = area * 0.13;
    const sealerCost = sealerGallons * 3.65;
    
    const sandBags = Math.ceil(sealerGallons / 50);
    const sandCost = sandBags * 10;
    
    const fastDryBuckets = Math.ceil(sealerGallons / 150);
    const fastDryCost = fastDryBuckets * 50;
    
    const prepSealBuckets = 1; // Optional, assuming 1 bucket
    const prepSealCost = prepSealBuckets * 50;
    
    // Assume perimeter for crack filler calculation (rough estimate)
    const perimeter = Math.sqrt(area) * 4; // Square approximation
    const crackFillerBoxes = Math.ceil(perimeter / 100);
    const crackFillerCost = crackFillerBoxes * 44.99;
    
    const propaneTanks = Math.ceil(perimeter / 200);
    const propaneCost = propaneTanks * 10;
    
    // Enhanced labor calculation with configurable rate
    const laborHours = Math.ceil(area / 1000);
    const laborCost = laborHours * laborRate;
    
    // Enhanced fuel calculation with configurable parameters
    const roundTripDistance = sealMasterDistance * 2;
    const fuelCost = (roundTripDistance / 8) * fuelPrice; // Using C30 truck
    
    const subtotal = sealerCost + sandCost + fastDryCost + prepSealCost + 
                    crackFillerCost + propaneCost + laborCost + fuelCost;
    
    const markup25 = subtotal * (1 + markupPercentage / 100);
    const roundedUp = Math.ceil(markup25 / 10) * 10;
    const finalTotal = roundedUp * 1.25;
    
    return {
      area,
      materials: {
        sealer: { gallons: sealerGallons, cost: sealerCost },
        sand: { bags: sandBags, cost: sandCost },
        fastDry: { buckets: fastDryBuckets, cost: fastDryCost },
        prepSeal: { buckets: prepSealBuckets, cost: prepSealCost },
        crackFiller: { boxes: crackFillerBoxes, cost: crackFillerCost },
        propane: { tanks: propaneTanks, cost: propaneCost },
      },
      labor: { hours: laborHours, cost: laborCost },
      fuel: { distance: roundTripDistance, cost: fuelCost },
      subtotal,
      markup25,
      roundedUp,
      finalTotal
    };
  };

  const estimate = calculateEstimate();

  const handleExportPDF = async () => {
    try {
      await ExportService.exportEstimatePDF(estimate, address, jobType);
      onExport('pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      await ExportService.exportEstimateExcel(estimate, address, jobType);
      onExport('excel');
    } catch (error) {
      console.error('Excel export failed:', error);
      toast.error('Failed to export Excel');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (area === 0) {
    return (
      <div className="w-80 border-l border-border p-4 bg-card">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Measurement Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Draw a polygon on the map to start calculating your sealcoating estimate.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border p-4 bg-card space-y-4">
      {/* Area Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Area Measurement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {formatNumber(area, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Square Feet</div>
            <Badge variant="secondary" className="mt-2">
              {jobType === 'driveway' ? 'Driveway' : 'Parking Lot'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Materials Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Materials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Sealer ({formatNumber(estimate.materials.sealer.gallons, 1)} gal)</span>
            <span className="font-medium">{formatCurrency(estimate.materials.sealer.cost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Sand ({estimate.materials.sand.bags} bags)</span>
            <span className="font-medium">{formatCurrency(estimate.materials.sand.cost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fast Dry ({estimate.materials.fastDry.buckets} buckets)</span>
            <span className="font-medium">{formatCurrency(estimate.materials.fastDry.cost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Prep Seal ({estimate.materials.prepSeal.buckets} bucket)</span>
            <span className="font-medium">{formatCurrency(estimate.materials.prepSeal.cost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Crack Filler ({estimate.materials.crackFiller.boxes} boxes)</span>
            <span className="font-medium">{formatCurrency(estimate.materials.crackFiller.cost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Propane ({estimate.materials.propane.tanks} tanks)</span>
            <span className="font-medium">{formatCurrency(estimate.materials.propane.cost)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Labor & Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Labor & Expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Labor ({estimate.labor.hours} hrs)</span>
            <span className="font-medium">{formatCurrency(estimate.labor.cost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fuel ({estimate.fuel.distance} miles)</span>
            <span className="font-medium">{formatCurrency(estimate.fuel.cost)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(estimate.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>25% Markup</span>
            <span>{formatCurrency(estimate.markup25 - estimate.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>After Markup</span>
            <span>{formatCurrency(estimate.markup25)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Rounded Up</span>
            <span>{formatCurrency(estimate.roundedUp)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Final Total</span>
            <span className="text-green-600">{formatCurrency(estimate.finalTotal)}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Price per sq ft: {formatCurrency(estimate.finalTotal / area)}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2"
            variant="default"
          >
            <FileText className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button 
            onClick={handleExportExcel}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export as Excel
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            Professional estimates with detailed breakdown
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
      {address && (
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Address:</span>
                <div className="text-muted-foreground">{address}</div>
              </div>
              <div className="mt-2">
                <span className="font-medium">Date:</span>
                <div className="text-muted-foreground">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeasurementSidebar;