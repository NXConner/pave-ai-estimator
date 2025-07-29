import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Map, 
  Globe, 
  Satellite, 
  Navigation, 
  Zap, 
  Shield, 
  Key, 
  Check, 
  X, 
  Info,
  Star,
  TrendingUp,
  Settings
} from 'lucide-react';
import { mappingService, type MapProvider } from '@/lib/mappingServices';
import { toast } from 'sonner';

interface MappingServiceSelectorProps {
  onProviderChange?: (providerId: string) => void;
  showQuickSelector?: boolean;
  showFullDetails?: boolean;
}

export const MappingServiceSelector: React.FC<MappingServiceSelectorProps> = ({
  onProviderChange,
  showQuickSelector = true,
  showFullDetails = false
}) => {
  const [providers, setProviders] = useState<MapProvider[]>([]);
  const [activeProvider, setActiveProvider] = useState<string>('osm');
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const loadProviders = () => {
      const allProviders = mappingService.getProviders();
      setProviders(allProviders);
      setActiveProvider(mappingService.getActiveProvider().id);
    };

    loadProviders();
  }, []);

  const handleProviderChange = async (providerId: string) => {
    if (providerId === activeProvider) return;

    setIsLoading(true);
    try {
      await mappingService.setActiveProvider(providerId);
      setActiveProvider(providerId);
      onProviderChange?.(providerId);
      setShowDialog(false);
      toast.success(`Switched to ${providers.find(p => p.id === providerId)?.name}`);
    } catch (error) {
      toast.error(`Failed to switch provider: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderIcon = (providerId: string) => {
    const iconMap = {
      osm: <Map className="h-4 w-4" />,
      mapbox: <Satellite className="h-4 w-4" />,
      leaflet: <Globe className="h-4 w-4" />,
      here: <Navigation className="h-4 w-4" />,
      maptiler: <Map className="h-4 w-4" />,
      arcgis: <Globe className="h-4 w-4" />,
      bing: <Satellite className="h-4 w-4" />,
      tomtom: <Navigation className="h-4 w-4" />,
      esri: <Satellite className="h-4 w-4" />,
      cartodb: <Map className="h-4 w-4" />
    };
    return iconMap[providerId as keyof typeof iconMap] || <Map className="h-4 w-4" />;
  };

  const getProviderColor = (providerId: string) => {
    const colorMap = {
      osm: 'bg-green-500',
      mapbox: 'bg-blue-500',
      leaflet: 'bg-emerald-500',
      here: 'bg-purple-500',
      maptiler: 'bg-orange-500',
      arcgis: 'bg-indigo-500',
      bing: 'bg-cyan-500',
      tomtom: 'bg-red-500',
      esri: 'bg-teal-500',
      cartodb: 'bg-pink-500'
    };
    return colorMap[providerId as keyof typeof colorMap] || 'bg-gray-500';
  };

  const formatNumber = (num: number) => {
    if (num === Infinity) return '∞';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const QuickSelector = () => (
    <Select value={activeProvider} onValueChange={handleProviderChange} disabled={isLoading}>
      <SelectTrigger className="w-64">
        <SelectValue>
          <div className="flex items-center gap-2">
            {getProviderIcon(activeProvider)}
            <span>{providers.find(p => p.id === activeProvider)?.name || 'Select Provider'}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {providers.filter(p => p.isActive).map((provider) => (
          <SelectItem key={provider.id} value={provider.id}>
            <div className="flex items-center gap-2">
              {getProviderIcon(provider.id)}
              <span>{provider.name}</span>
              {!provider.apiKeyRequired && (
                <Badge variant="secondary" className="ml-auto">
                  <Zap className="h-3 w-3 mr-1" />
                  Free
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const ProviderCard = ({ provider }: { provider: MapProvider }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      provider.id === activeProvider ? 'ring-2 ring-blue-500' : ''
    }`} onClick={() => handleProviderChange(provider.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getProviderColor(provider.id)} text-white`}>
              {getProviderIcon(provider.id)}
            </div>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <CardDescription className="text-sm">{provider.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {provider.id === activeProvider && <Check className="h-5 w-5 text-green-500" />}
            {!provider.apiKeyRequired && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Zap className="h-3 w-3 mr-1" />
                Free
              </Badge>
            )}
            {provider.apiKeyRequired && (
              <Badge variant="outline" className="text-amber-600 border-amber-600">
                <Key className="h-3 w-3 mr-1" />
                API Key
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(provider.freeTier.requestsPerMonth)}
            </div>
            <div className="text-sm text-gray-500">Requests/Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {formatNumber(provider.freeTier.requestsPerDay)}
            </div>
            <div className="text-sm text-gray-500">Requests/Day</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Features:</div>
          <div className="flex flex-wrap gap-1">
            {provider.freeTier.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 p-3 text-left">Provider</th>
            <th className="border border-gray-200 p-3 text-center">API Key</th>
            <th className="border border-gray-200 p-3 text-center">Monthly Limit</th>
            <th className="border border-gray-200 p-3 text-center">Daily Limit</th>
            <th className="border border-gray-200 p-3 text-center">Features</th>
            <th className="border border-gray-200 p-3 text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          {providers.filter(p => p.isActive).map((provider) => (
            <tr key={provider.id} className={`hover:bg-gray-50 ${
              provider.id === activeProvider ? 'bg-blue-50' : ''
            }`}>
              <td className="border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  {getProviderIcon(provider.id)}
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-gray-500">{provider.description}</div>
                  </div>
                </div>
              </td>
              <td className="border border-gray-200 p-3 text-center">
                {provider.apiKeyRequired ? (
                  <X className="h-4 w-4 text-red-500 mx-auto" />
                ) : (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                )}
              </td>
              <td className="border border-gray-200 p-3 text-center font-medium">
                {formatNumber(provider.freeTier.requestsPerMonth)}
              </td>
              <td className="border border-gray-200 p-3 text-center font-medium">
                {formatNumber(provider.freeTier.requestsPerDay)}
              </td>
              <td className="border border-gray-200 p-3">
                <div className="flex flex-wrap gap-1">
                  {provider.freeTier.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {provider.freeTier.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.freeTier.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </td>
              <td className="border border-gray-200 p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${
                        i < (provider.apiKeyRequired ? 4 : 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (showQuickSelector && !showFullDetails) {
    return (
      <div className="flex items-center gap-2">
        <QuickSelector />
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose Mapping Service</DialogTitle>
              <DialogDescription>
                Select from 10 free mapping services. Each has different features and usage limits.
              </DialogDescription>
            </DialogHeader>
            <MappingServiceSelector showQuickSelector={false} showFullDetails={true} onProviderChange={onProviderChange} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Free Mapping Services</h2>
        <p className="text-gray-600">
          Choose from 10 different free mapping providers. No vendor lock-in, switch anytime.
        </p>
      </div>

      {/* Current Selection */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${getProviderColor(activeProvider)} text-white`}>
                {getProviderIcon(activeProvider)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Currently using: {providers.find(p => p.id === activeProvider)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {providers.find(p => p.id === activeProvider)?.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Monthly Limit</div>
              <div className="text-xl font-bold text-blue-600">
                {formatNumber(providers.find(p => p.id === activeProvider)?.freeTier.requestsPerMonth || 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Compare</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No API Key</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>API Key Required</span>
            </div>
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.filter(p => p.isActive).map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <ComparisonTable />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-6">
            {/* Best for Beginners */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Zap className="h-5 w-5" />
                  Best for Beginners
                </CardTitle>
                <CardDescription>
                  No setup required, unlimited usage, instant start
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getProviderIcon('osm')}
                    <span className="font-medium">OpenStreetMap</span>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                  <Button 
                    size="sm" 
                    onClick={() => handleProviderChange('osm')}
                    disabled={activeProvider === 'osm'}
                  >
                    {activeProvider === 'osm' ? 'Active' : 'Switch'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Best for High Volume */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="h-5 w-5" />
                  Best for High Volume
                </CardTitle>
                <CardDescription>
                  Highest free tier limits for professional use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getProviderIcon('arcgis')}
                      <span className="font-medium">ArcGIS Online</span>
                    </div>
                    <Badge variant="secondary">2M requests/month</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleProviderChange('arcgis')}
                      disabled={activeProvider === 'arcgis'}
                    >
                      {activeProvider === 'arcgis' ? 'Active' : 'Switch'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getProviderIcon('maptiler')}
                      <span className="font-medium">MapTiler</span>
                    </div>
                    <Badge variant="secondary">100K requests/month</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleProviderChange('maptiler')}
                      disabled={activeProvider === 'maptiler'}
                    >
                      {activeProvider === 'maptiler' ? 'Active' : 'Switch'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best for Satellite Imagery */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Satellite className="h-5 w-5" />
                  Best for Satellite Imagery
                </CardTitle>
                <CardDescription>
                  High-quality satellite and aerial imagery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getProviderIcon('esri')}
                      <span className="font-medium">Esri World Imagery</span>
                    </div>
                    <Badge variant="secondary">Unlimited</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleProviderChange('esri')}
                      disabled={activeProvider === 'esri'}
                    >
                      {activeProvider === 'esri' ? 'Active' : 'Switch'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getProviderIcon('mapbox')}
                      <span className="font-medium">Mapbox</span>
                    </div>
                    <Badge variant="secondary">50K requests/month</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => handleProviderChange('mapbox')}
                      disabled={activeProvider === 'mapbox'}
                    >
                      {activeProvider === 'mapbox' ? 'Active' : 'Switch'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900">Why Multiple Mapping Services?</h4>
              <p className="text-sm text-blue-700">
                Different mapping services have different strengths, usage limits, and coverage areas. 
                By supporting multiple providers, you can switch if one service is down, 
                exceeds limits, or doesn't meet your specific needs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MappingServiceSelector;