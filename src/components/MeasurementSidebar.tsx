import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
    
    // Labor calculation (estimate 1 hour per 1000 sq ft)
    const laborHours = Math.ceil(area / 1000);
    const laborCost = laborHours * 12;
    
    // Fuel calculation (round trip to SealMaster)
    const distanceToSealMaster = 45; // miles (estimate)
    const roundTripDistance = distanceToSealMaster * 2;
    const fuelCost = (roundTripDistance / 8) * 3.50; // Using C30 truck, $3.50/gal estimate
    
    const subtotal = sealerCost + sandCost + fastDryCost + prepSealCost + 
                    crackFillerCost + propaneCost + laborCost + fuelCost;
    
    const markup25 = subtotal * 1.25;
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

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Job Type</p>
              <Badge variant="secondary">{jobType.replace('-', ' ').toUpperCase()}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="text-sm">{address || 'No address selected'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Area</p>
              <p className="text-lg font-semibold text-primary">
                {area.toLocaleString()} sq ft
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Sealer ({estimate.materials.sealer.gallons.toFixed(1)} gal)</span>
              <span className="text-sm font-medium">${estimate.materials.sealer.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sand ({estimate.materials.sand.bags} bags)</span>
              <span className="text-sm font-medium">${estimate.materials.sand.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Fast Dry ({estimate.materials.fastDry.buckets} buckets)</span>
              <span className="text-sm font-medium">${estimate.materials.fastDry.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Prep Seal ({estimate.materials.prepSeal.buckets} bucket)</span>
              <span className="text-sm font-medium">${estimate.materials.prepSeal.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Crack Filler ({estimate.materials.crackFiller.boxes} boxes)</span>
              <span className="text-sm font-medium">${estimate.materials.crackFiller.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Propane ({estimate.materials.propane.tanks} tanks)</span>
              <span className="text-sm font-medium">${estimate.materials.propane.cost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Labor & Fuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Labor ({estimate.labor.hours} hrs @ $12/hr)</span>
              <span className="text-sm font-medium">${estimate.labor.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Fuel ({estimate.fuel.distance} mi round trip)</span>
              <span className="text-sm font-medium">${estimate.fuel.cost.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm font-medium">${estimate.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">With 25% Markup</span>
              <span className="text-sm font-medium">${estimate.markup25.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Rounded Up</span>
              <span className="text-sm font-medium">${estimate.roundedUp.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-base font-semibold">Final Total (25% markup)</span>
              <span className="text-lg font-bold text-primary">${estimate.finalTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button 
            onClick={() => onExport('pdf')} 
            className="w-full"
            variant="default"
          >
            Export to PDF
          </Button>
          <Button 
            onClick={() => onExport('excel')} 
            className="w-full"
            variant="secondary"
          >
            Export to Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementSidebar;