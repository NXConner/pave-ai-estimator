/// <reference types="google.maps" />
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  onPolygonComplete?: (area: number, polygon: google.maps.Polygon) => void;
  onAddressSelect?: (address: string, location: google.maps.LatLng) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ onPolygonComplete, onAddressSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      const loader = new Loader({
        apiKey: 'GOOGLE_MAPS_API_KEY', // User will need to add this
        version: 'weekly',
        libraries: ['drawing', 'geometry', 'places']
      });

      await loader.load();

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 36.5951, lng: -80.0170 }, // Stuart, VA area
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;

      // Initialize Drawing Manager
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: '#00BFFF',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#00BFFF',
          clickable: true,
          editable: true,
          zIndex: 1,
        },
      });

      drawingManager.setMap(map);
      drawingManagerRef.current = drawingManager;

      // Handle polygon completion
      google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
        const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
        const areaInSqFt = area * 10.764; // Convert from sq meters to sq feet
        
        setPolygons(prev => [...prev, polygon]);
        onPolygonComplete?.(areaInSqFt, polygon);

        // Allow editing of the polygon
        polygon.addListener('click', () => {
          const newArea = google.maps.geometry.spherical.computeArea(polygon.getPath()) * 10.764;
          onPolygonComplete?.(newArea, polygon);
        });
      });

      // Initialize Places Autocomplete for address search
      const searchBox = document.getElementById('address-search') as HTMLInputElement;
      if (searchBox) {
        const autocomplete = new google.maps.places.Autocomplete(searchBox);
        autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            map.setCenter(place.geometry.location);
            map.setZoom(18);
            onAddressSelect?.(place.formatted_address || '', place.geometry.location);
          }
        });
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }, [onPolygonComplete, onAddressSelect]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const clearPolygons = () => {
    polygons.forEach(polygon => polygon.setMap(null));
    setPolygons([]);
  };

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">Loading map... (Google Maps API key required)</p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '500px' }}
      />
      {isLoaded && (
        <button
          onClick={clearPolygons}
          className="absolute bottom-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm hover:bg-destructive/90 transition-colors"
        >
          Clear Polygons
        </button>
      )}
    </div>
  );
};

export default GoogleMap;