import React, { useState, useCallback, useMemo } from 'react';
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
import { 
  Ruler, 
  Upload, 
  Zap, 
  LogOut, 
  Keyboard, 
  Settings, 
  Save, 
  History,
  Calculator,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  useKeyboardShortcuts, 
  createPaveEstimatorShortcuts 
} from '@/components/ui/keyboard-shortcuts';
import { 
  ExportLoadingOverlay, 
  PulseIndicator,
  MeasurementSidebarSkeleton
} from '@/components/ui/loading-states';

const Index = () => {
  const [area, setArea] = useState(0);
  const [jobType, setJobType] = useState<'driveway' | 'parking-lot'>('driveway');
  const [address, setAddress] = useState('');
  const [polygonCount, setPolygonCount] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastCalculationTime, setLastCalculationTime] = useState<Date | null>(null);
  
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handlePolygonComplete = useCallback((newArea: number) => {
    setIsCalculating(true);
    // Simulate calculation time for better UX
    setTimeout(() => {
      setArea(newArea);
      setPolygonCount(prev => prev + 1);
      setLastCalculationTime(new Date());
      setIsCalculating(false);
      toast.success(`Area calculated: ${newArea.toFixed(0)} sq ft`);
    }, 500);
  }, []);

  const handleAddressSelect = useCallback((selectedAddress: string) => {
    setAddress(selectedAddress);
    toast.success('Address updated');
  }, []);

  const handleExport = useCallback(async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setExportType(format);
    
    try {
      // Simulate export time
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleClearMeasurements = useCallback(() => {
    setArea(0);
    setPolygonCount(0);
    setLastCalculationTime(null);
    // This would also clear the map polygons in a real implementation
  }, []);

  const handleToggleDrawing = useCallback(() => {
    // This would toggle the drawing mode on the map
    toast.info('Drawing mode toggled');
  }, []);

  const handleZoomIn = useCallback(() => {
    // This would zoom in on the map
    toast.info('Map zoomed in');
  }, []);

  const handleZoomOut = useCallback(() => {
    // This would zoom out on the map
    toast.info('Map zoomed out');
  }, []);

  const handleResetView = useCallback(() => {
    // This would reset the map view
    toast.info('Map view reset');
  }, []);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => createPaveEstimatorShortcuts(
    () => handleExport('pdf'),
    () => handleExport('excel'),
    handleClearMeasurements,
    handleToggleDrawing,
    handleZoomIn,
    handleZoomOut,
    handleResetView
  ), [handleExport, handleClearMeasurements, handleToggleDrawing, handleZoomIn, handleZoomOut, handleResetView]);

  useKeyboardShortcuts(shortcuts);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate quick stats for header display
  const quickStats = useMemo(() => {
    if (area === 0) return null;
    
    const pricePerSqFt = 2.50; // Rough estimate
    const estimatedCost = area * pricePerSqFt;
    
    return {
      area: area.toFixed(0),
      estimatedCost: formatCurrency(estimatedCost),
      lastUpdated: lastCalculationTime?.toLocaleTimeString() || 'Never'
    };
  }, [area, lastCalculationTime]);

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      {/* Export Loading Overlay */}
      <ExportLoadingOverlay 
        isVisible={isExporting} 
        type={exportType}
        onCancel={() => setIsExporting(false)}
      />

      {/* Enhanced Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className={`text-2xl font-bold ${currentTheme === 'tactical-comm' ? 'text-green-400 font-mono' : 'text-primary'}`}>
                  {getHeaderTitle()}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    {currentTheme === 'tactical-comm' ? 'ADVANCED TACTICAL PLATFORM' : 'Advanced Multi-Modal Estimation Platform'}
                  </span>
                  {quickStats && (
                    <>
                      <span>•</span>
                      <PulseIndicator active={isCalculating}>
                        <span className="flex items-center gap-1">
                          <Calculator className="h-3 w-3" />
                          {quickStats.area} sq ft ≈ {quickStats.estimatedCost}
                        </span>
                      </PulseIndicator>
                    </>
                  )}
                </div>
              </div>
              
              {/* Real-time Status Indicators */}
              <div className="hidden lg:flex items-center gap-2">
                {area > 0 && (
                  <Badge variant="default" className="animate-pulse">
                    <MapPin className="h-3 w-3 mr-1" />
                    Active Project
                  </Badge>
                )}
                {lastCalculationTime && (
                  <Badge variant="secondary">
                    Updated {lastCalculationTime.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:block text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </div>
              
              <Badge variant="secondary" className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {polygonCount} Areas Measured
              </Badge>
              
              {/* Enhanced Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload Image</span>
                </Button>
                
                <Button size="sm" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Takeoff</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className="flex items-center gap-2"
                >
                  <Keyboard className="h-4 w-4" />
                  <span className="hidden md:inline">Shortcuts</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Keyboard Shortcuts Help */}
          {showShortcuts && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl+P</kbd> Export PDF</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl+E</kbd> Export Excel</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Delete</kbd> Clear All</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl+D</kbd> Toggle Drawing</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl++</kbd> Zoom In</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl+-</kbd> Zoom Out</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl+0</kbd> Reset View</div>
                <div><kbd className="px-1 py-0.5 bg-background rounded">Ctrl+?</kbd> Help</div>
              </div>
            </div>
          )}
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
            <div className="flex flex-1 gap-4">
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
              {isCalculating ? (
                <MeasurementSidebarSkeleton />
              ) : (
                <MeasurementSidebar
                  area={area}
                  jobType={jobType}
                  address={address}
                  onExport={handleExport}
                />
              )}
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
