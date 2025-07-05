import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Building } from 'lucide-react';

interface JobTypeSelectorProps {
  selectedType: 'driveway' | 'parking-lot';
  onTypeChange: (type: 'driveway' | 'parking-lot') => void;
}

const JobTypeSelector: React.FC<JobTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="flex gap-4">
      <Card 
        className={`cursor-pointer transition-all hover:scale-105 ${
          selectedType === 'driveway' ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onTypeChange('driveway')}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <Car className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">Driveway</h3>
            <p className="text-sm text-muted-foreground">Residential sealcoating</p>
          </div>
          {selectedType === 'driveway' && (
            <Badge variant="default" className="ml-auto">Selected</Badge>
          )}
        </CardContent>
      </Card>

      <Card 
        className={`cursor-pointer transition-all hover:scale-105 ${
          selectedType === 'parking-lot' ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onTypeChange('parking-lot')}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <Building className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">Parking Lot</h3>
            <p className="text-sm text-muted-foreground">Commercial sealcoating</p>
          </div>
          {selectedType === 'parking-lot' && (
            <Badge variant="default" className="ml-auto">Selected</Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobTypeSelector;