/// <reference types="google.maps" />
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Satellite, Map, Layers } from 'lucide-react';

interface GoogleMapProps {
  onPolygonComplete?: (area: number, polygon: google.maps.Polygon) => void;
  onAddressSelect?: (address: string, location: google.maps.LatLng) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ onPolygonComplete, onAddressSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [mapType, setMapType] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.SATELLITE);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'DEMO_MODE') {
        throw new Error('Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
      }

      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['drawing', 'geometry', 'places'],
        region: 'US',
        language: 'en'
      });

      await loader.load();

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 36.5951, lng: -80.0170 }, // Stuart, VA area
        zoom: 18,
        mapTypeId: mapType,
        mapTypeControl: false, // We'll use custom controls
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        scaleControl: true,
        rotateControl: true,
        // Enhanced styling
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
        // Improved user experience settings
        gestureHandling: 'greedy',
        keyboardShortcuts: true,
        disableDoubleClickZoom: false,
      });

      mapInstanceRef.current = map;

      // Initialize Drawing Manager with enhanced options
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.RECTANGLE,
            google.maps.drawing.OverlayType.CIRCLE,
          ],
        },
        polygonOptions: {
          fillColor: '#3b82f6',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#1d4ed8',
          clickable: true,
          editable: true,
          draggable: true,
        },
        rectangleOptions: {
          fillColor: '#10b981',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#047857',
          clickable: true,
          editable: true,
          draggable: true,
        },
        circleOptions: {
          fillColor: '#f59e0b',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#d97706',
          clickable: true,
          editable: true,
          draggable: true,
        },
      });

      drawingManager.setMap(map);
      drawingManagerRef.current = drawingManager;

      // Enhanced polygon completion handling
      google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
        const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
        const areaInSqFt = area * 10.764; // Convert from sq meters to sq feet
        
        setPolygons(prev => [...prev, polygon]);
        
        if (onPolygonComplete) {
          onPolygonComplete(areaInSqFt, polygon);
        }

        // Add edit listeners
        google.maps.event.addListener(polygon.getPath(), 'set_at', () => {
          const newArea = google.maps.geometry.spherical.computeArea(polygon.getPath()) * 10.764;
          if (onPolygonComplete) {
            onPolygonComplete(newArea, polygon);
          }
        });

        google.maps.event.addListener(polygon.getPath(), 'insert_at', () => {
          const newArea = google.maps.geometry.spherical.computeArea(polygon.getPath()) * 10.764;
          if (onPolygonComplete) {
            onPolygonComplete(newArea, polygon);
          }
        });

        toast.success(`Area measured: ${areaInSqFt.toFixed(0)} sq ft`);
      });

      // Rectangle completion handling
      google.maps.event.addListener(drawingManager, 'rectanglecomplete', (rectangle: google.maps.Rectangle) => {
        const bounds = rectangle.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const area = google.maps.geometry.spherical.computeArea([
            new google.maps.LatLng(sw.lat(), sw.lng()),
            new google.maps.LatLng(ne.lat(), sw.lng()),
            new google.maps.LatLng(ne.lat(), ne.lng()),
            new google.maps.LatLng(sw.lat(), ne.lng()),
          ]);
          const areaInSqFt = area * 10.764;
          
          if (onPolygonComplete) {
            onPolygonComplete(areaInSqFt, rectangle as any);
          }
          
          toast.success(`Rectangle measured: ${areaInSqFt.toFixed(0)} sq ft`);
        }
      });

      // Circle completion handling
      google.maps.event.addListener(drawingManager, 'circlecomplete', (circle: google.maps.Circle) => {
        const radius = circle.getRadius();
        const area = Math.PI * radius * radius;
        const areaInSqFt = area * 10.764;
        
        if (onPolygonComplete) {
          onPolygonComplete(areaInSqFt, circle as any);
        }
        
        toast.success(`Circle measured: ${areaInSqFt.toFixed(0)} sq ft`);
      });

      // Enhanced Places Autocomplete
      const input = document.getElementById('address-search') as HTMLInputElement;
      if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'geometry', 'name'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            map.setCenter(place.geometry.location);
            map.setZoom(20);
            
            if (onAddressSelect && place.formatted_address) {
              onAddressSelect(place.formatted_address, place.geometry.location);
            }
          }
        });
      }

      setIsLoaded(true);
      setIsLoading(false);
      toast.success('Map loaded successfully');

    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load Google Maps';
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
    }
  }, [mapType, onPolygonComplete, onAddressSelect]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const clearAllShapes = () => {
    polygons.forEach(polygon => polygon.setMap(null));
    setPolygons([]);
    toast.success('All measurements cleared');
  };

  const changeMapType = (newMapType: google.maps.MapTypeId) => {
    setMapType(newMapType);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(newMapType);
    }
  };

  const toggleDrawingMode = (mode: google.maps.drawing.OverlayType | null) => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(mode);
    }
  };

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <MapPin className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={initializeMap}>Retry</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}
      
      {/* Custom Map Controls */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-40 space-y-2">
          <Card className="p-2">
            <div className="flex flex-col space-y-2">
              <Button
                size="sm"
                variant={mapType === google.maps.MapTypeId.SATELLITE ? "default" : "outline"}
                onClick={() => changeMapType(google.maps.MapTypeId.SATELLITE)}
                className="flex items-center gap-2"
              >
                <Satellite className="h-4 w-4" />
                Satellite
              </Button>
              <Button
                size="sm"
                variant={mapType === google.maps.MapTypeId.ROADMAP ? "default" : "outline"}
                onClick={() => changeMapType(google.maps.MapTypeId.ROADMAP)}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Map
              </Button>
              <Button
                size="sm"
                variant={mapType === google.maps.MapTypeId.HYBRID ? "default" : "outline"}
                onClick={() => changeMapType(google.maps.MapTypeId.HYBRID)}
                className="flex items-center gap-2"
              >
                <Layers className="h-4 w-4" />
                Hybrid
              </Button>
            </div>
          </Card>
          
          {polygons.length > 0 && (
            <Card className="p-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={clearAllShapes}
                className="w-full"
              >
                Clear All ({polygons.length})
              </Button>
            </Card>
          )}
        </div>
      )}

      <div
        ref={mapRef}
        className="h-full w-full rounded-lg"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default GoogleMap;