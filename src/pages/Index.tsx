import React, { useState } from 'react';
import FallbackMap from '@/components/FallbackMap';
import MeasurementSidebar from '@/components/MeasurementSidebar';
import AddressSearch from '@/components/AddressSearch';
import JobTypeSelector from '@/components/JobTypeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ruler, Upload, Zap } from 'lucide-react';

const Index = () => {
  const [area, setArea] = useState(0);
  const [jobType, setJobType] = useState<'driveway' | 'parking-lot'>('driveway');
  const [address, setAddress] = useState('');
  const [polygonCount, setPolygonCount] = useState(0);

  const handlePolygonComplete = (newArea: number) => {
    setArea(newArea);
    setPolygonCount(prev => prev + 1);
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    // Export functionality would be implemented here
    console.log(`Exporting to ${format}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">PaveEstimator Pro</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Sealcoating Estimation Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {polygonCount} Areas Measured
              </Badge>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <Button className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Takeoff
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Panel */}
        <div className="w-80 border-r border-border bg-card p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Project Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Job Site Address
                </label>
                <AddressSearch onAddressSelect={handleAddressSelect} />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Job Type
                </label>
                <JobTypeSelector 
                  selectedType={jobType}
                  onTypeChange={setJobType}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Enter the job site address above</p>
                <p>2. Select job type (driveway or parking lot)</p>
                <p>3. Use the polygon tool to draw measurement areas</p>
                <p>4. View automatic cost calculations in the sidebar</p>
                <p>5. Export estimates as PDF or Excel</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">API Setup Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>To enable full functionality, add your Google Maps API key to the GoogleMap component.</p>
                <p>Enable the following APIs:</p>
                <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                  <li>Maps JavaScript API</li>
                  <li>Places API</li>
                  <li>Geometry API</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <FallbackMap 
            onPolygonComplete={handlePolygonComplete}
            onAddressSelect={handleAddressSelect}
          />
        </div>

        {/* Right Sidebar */}
        <MeasurementSidebar
          area={area}
          jobType={jobType}
          address={address}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default Index;
