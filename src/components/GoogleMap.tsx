/// <reference types="google.maps" />
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Satellite, Map, Layers } from 'lucide-react';
import { mappingService, type MapInstance } from '@/lib/mappingServices';
import { MappingServiceSelector } from '@/components/ui/mapping-service-selector';
import 'leaflet/dist/leaflet.css';

interface FallbackMapProps {
  onPolygonComplete?: (area: number) => void;
  onAddressSelect?: (address: string, coordinates: [number, number]) => void;
  clearTrigger?: number;
}

const FallbackMap: React.FC<FallbackMapProps> = ({
  onPolygonComplete,
  onAddressSelect,
  clearTrigger = 0
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null);
  const [currentProvider, setCurrentProvider] = useState(mappingService.getActiveProvider().name);

  // Clear shapes when clearTrigger changes
  useEffect(() => {
    if (clearTrigger > 0 && mapInstance) {
      mapInstance.clearShapes();
      toast.success('Map cleared');
    }
  }, [clearTrigger, mapInstance]);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const defaultCenter: [number, number] = [
          parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || 37.7749,
          parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LNG) || -122.4194
        ];
        const defaultZoom = parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 10;

        const map = await mappingService.createMap('map-container', {
          center: defaultCenter,
          zoom: defaultZoom
        });

        // Set up shape completion handler
        map.onShapeComplete((area, type, coordinates) => {
          const areaInSqFt = area * 10.764; // Convert m² to sq ft
          onPolygonComplete?.(areaInSqFt);
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} drawn: ${areaInSqFt.toLocaleString()} sq ft`);
        });

        setMapInstance(map);
        setIsLoading(false);
        
        toast.success(`Map loaded with ${mappingService.getActiveProvider().name}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        setIsLoading(false);
        toast.error('Failed to load map');
      }
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, []);

  const handleProviderChange = async (providerId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Destroy current map
      if (mapInstance) {
        mapInstance.destroy();
        setMapInstance(null);
      }

      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create new map with new provider
      const defaultCenter: [number, number] = [
        parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || 37.7749,
        parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LNG) || -122.4194
      ];
      const defaultZoom = parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 10;

      const map = await mappingService.createMap('map-container', {
        center: defaultCenter,
        zoom: defaultZoom
      });

      // Set up shape completion handler
      map.onShapeComplete((area, type, coordinates) => {
        const areaInSqFt = area * 10.764; // Convert m² to sq ft
        onPolygonComplete?.(areaInSqFt);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} drawn: ${areaInSqFt.toLocaleString()} sq ft`);
      });

      setMapInstance(map);
      setCurrentProvider(mappingService.getActiveProvider().name);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch map provider');
      setIsLoading(false);
    }
  };

  const handleAddressSearch = async (address: string) => {
    if (!address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    try {
      const result = await mappingService.geocode(address);
      
      if (mapInstance) {
        mapInstance.setView(result.coordinates, 18);
      }
      
      onAddressSelect?.(result.address, result.coordinates);
      toast.success(`Found: ${result.address}`);
    } catch (error) {
      toast.error('Address not found. Please try a different search term.');
    }
  };

  const handleDrawingToggle = () => {
    if (mapInstance) {
      mapInstance.enableDrawing();
    }
  };

  const handleClearShapes = () => {
    if (mapInstance) {
      mapInstance.clearShapes();
      toast.success('All shapes cleared');
    }
  };

  const getMapControls = () => (
    <div className="absolute top-4 left-4 z-10 space-y-2">
      <Card className="p-2">
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDrawingToggle}
            className="flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            Draw Area
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearShapes}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex flex-col">
        {/* Provider Selector */}
        <div className="mb-4">
          <MappingServiceSelector 
            onProviderChange={handleProviderChange}
            showQuickSelector={true}
            showFullDetails={false}
          />
        </div>
        
        {/* Loading State */}
        <div className="flex-1 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {currentProvider} map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] flex flex-col">
        {/* Provider Selector */}
        <div className="mb-4">
          <MappingServiceSelector 
            onProviderChange={handleProviderChange}
            showQuickSelector={true}
            showFullDetails={false}
          />
        </div>
        
        {/* Error State */}
        <div className="flex-1 border-2 border-red-200 rounded-lg bg-red-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-600 mb-4">
              <Map className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-red-500">Try switching to a different mapping service:</p>
              <div className="flex justify-center">
                <Button 
                  onClick={() => handleProviderChange('osm')}
                  variant="outline"
                  size="sm"
                >
                  Try OpenStreetMap (Free)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] flex flex-col">
      {/* Provider Selector and Address Search */}
      <div className="mb-4 space-y-4">
        <MappingServiceSelector 
          onProviderChange={handleProviderChange}
          showQuickSelector={true}
          showFullDetails={false}
        />
        
        {/* Address Search */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for an address..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddressSearch(e.currentTarget.value);
              }
            }}
          />
          <Button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              handleAddressSearch(input.value);
            }}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative border-2 border-gray-200 rounded-lg overflow-hidden">
        <div id="map-container" className="w-full h-full"></div>
        {getMapControls()}
        
        {/* Provider Info */}
        <div className="absolute bottom-4 right-4 z-10">
          <Card className="p-2 bg-white/90 backdrop-blur-sm">
            <div className="text-xs text-gray-600">
              Powered by <span className="font-medium">{currentProvider}</span>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-2 text-sm text-gray-600 text-center">
        Click the "Draw Area" button and then click on the map to draw shapes. Use the search bar to find specific locations.
      </div>
    </div>
  );
};

export default FallbackMap;