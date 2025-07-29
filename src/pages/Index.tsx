import React, { useState } from 'react';
import FallbackMap from '@/components/FallbackMap';
import MeasurementSidebar from '@/components/MeasurementSidebar';
import AddressSearch from '@/components/AddressSearch';
import JobTypeSelector from '@/components/JobTypeSelector';
import { ThemeSelector, type Theme } from '@/components/ThemeSelector';
import { EchoCommHUD } from '@/components/EchoCommHUD';
import { GeminiMagicPanel } from '@/components/GeminiMagicPanel';
import { MatrixProtocolDashboard } from '@/components/MatrixProtocolDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, Upload, Zap, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Index = () => {
  const [area, setArea] = useState(0);
  const [jobType, setJobType] = useState<'driveway' | 'parking-lot'>('driveway');
  const [address, setAddress] = useState('');
  const [polygonCount, setPolygonCount] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

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

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'gemini-magic':
        return 'bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20';
      case 'tactical-comm':
        return 'bg-black text-green-400';
      case 'matrix-protocol':
        return 'bg-black text-green-400';
      case 'nexus-combined':
        return 'bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20';
      default:
        return 'bg-background';
    }
  };

  const getHeaderTitle = () => {
    switch (currentTheme) {
      case 'gemini-magic':
        return '🪄 PaveEstimator Pro - Enhanced with Gemini Magic';
      case 'tactical-comm':
        return '🎯 ECHO COMM - TACTICAL PAVING OPERATIONS';
      case 'matrix-protocol':
        return '⚡ MATRIX PROTOCOL - PAVING DATA NEXUS';
      case 'nexus-combined':
        return '🌐 NEXTECH SYSTEM NEXUS - UNIFIED PLATFORM';
      default:
        return 'PaveEstimator Pro';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {/* Enhanced Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${currentTheme === 'tactical-comm' ? 'text-green-400 font-mono' : 'text-primary'}`}>
                {getHeaderTitle()}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentTheme === 'tactical-comm' ? 'ADVANCED TACTICAL PLATFORM' : 'Advanced Multi-Modal Estimation Platform'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </div>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Theme-Based HUD Overlay */}
      {currentTheme === 'tactical-comm' && (
        <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
          <div className="pointer-events-auto px-4">
            <EchoCommHUD />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="main" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="main">Main Platform</TabsTrigger>
            <TabsTrigger value="themes">Theme Center</TabsTrigger>
            <TabsTrigger value="gemini">Gemini Magic</TabsTrigger>
            <TabsTrigger value="tactical">Tactical Comm</TabsTrigger>
            <TabsTrigger value="matrix">Matrix Protocol</TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-6">
            <div className="flex flex-1">
              {/* Left Panel */}
              <div className={`w-80 border-r border-border p-4 space-y-4 ${
                currentTheme === 'tactical-comm' ? 'bg-black/80 border-green-500/30' : 'bg-card'
              }`}>
                <Card className={currentTheme === 'tactical-comm' ? 'bg-black/80 border-green-500/30' : ''}>
                  <CardHeader>
                    <CardTitle className={currentTheme === 'tactical-comm' ? 'text-green-400 font-mono' : 'text-primary'}>
                      {currentTheme === 'tactical-comm' ? 'MISSION SETUP' : 'Project Setup'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className={`text-sm font-medium mb-2 block ${
                        currentTheme === 'tactical-comm' ? 'text-green-300' : 'text-foreground'
                      }`}>
                        {currentTheme === 'tactical-comm' ? 'TARGET COORDINATES' : 'Job Site Address'}
                      </label>
                      <AddressSearch onAddressSelect={handleAddressSelect} />
                    </div>
                    
                    <div>
                      <label className={`text-sm font-medium mb-2 block ${
                        currentTheme === 'tactical-comm' ? 'text-green-300' : 'text-foreground'
                      }`}>
                        {currentTheme === 'tactical-comm' ? 'OPERATION TYPE' : 'Job Type'}
                      </label>
                      <JobTypeSelector 
                        selectedType={jobType}
                        onTypeChange={setJobType}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className={currentTheme === 'tactical-comm' ? 'bg-black/80 border-green-500/30' : ''}>
                  <CardHeader>
                    <CardTitle className={currentTheme === 'tactical-comm' ? 'text-green-400 font-mono' : 'text-primary'}>
                      {currentTheme === 'tactical-comm' ? 'OPERATION PROTOCOL' : 'Instructions'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`space-y-2 text-sm ${
                      currentTheme === 'tactical-comm' ? 'text-green-200 font-mono' : 'text-muted-foreground'
                    }`}>
                      <p>{currentTheme === 'tactical-comm' ? '1. INPUT TARGET COORDINATES' : '1. Enter the job site address above'}</p>
                      <p>{currentTheme === 'tactical-comm' ? '2. SELECT OPERATION TYPE' : '2. Select job type (driveway or parking lot)'}</p>
                      <p>{currentTheme === 'tactical-comm' ? '3. DEPLOY MEASUREMENT TOOLS' : '3. Use the polygon tool to draw measurement areas'}</p>
                      <p>{currentTheme === 'tactical-comm' ? '4. ANALYZE TACTICAL DATA' : '4. View automatic cost calculations in the sidebar'}</p>
                      <p>{currentTheme === 'tactical-comm' ? '5. GENERATE MISSION REPORT' : '5. Export estimates as PDF or Excel'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map Container */}
              <div className="flex-1 relative">
                <div className={currentTheme === 'tactical-comm' ? 'border border-green-500/30' : ''}>
                  <FallbackMap 
                    onPolygonComplete={handlePolygonComplete}
                    onAddressSelect={handleAddressSelect}
                  />
                </div>
              </div>

              {/* Right Sidebar */}
              <MeasurementSidebar
                area={area}
                jobType={jobType}
                address={address}
                onExport={handleExport}
              />
            </div>
          </TabsContent>

          <TabsContent value="themes">
            <ThemeSelector 
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          </TabsContent>

          <TabsContent value="gemini">
            <GeminiMagicPanel />
          </TabsContent>

          <TabsContent value="tactical">
            <EchoCommHUD />
          </TabsContent>

          <TabsContent value="matrix">
            <MatrixProtocolDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
