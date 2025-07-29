import { toast } from 'sonner';
import L from 'leaflet';
import * as turf from '@turf/area';

// Mapping service provider interfaces
export interface MapProvider {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  apiKeyRequired: boolean;
  freeTier: {
    requestsPerMonth: number;
    requestsPerDay: number;
    features: string[];
  };
  initialize(): Promise<void>;
  createMap(containerId: string, options: MapOptions): Promise<MapInstance>;
  calculateArea(coordinates: number[][]): number;
  geocode(address: string): Promise<GeocodeResult>;
}

export interface MapOptions {
  center: [number, number];
  zoom: number;
  style?: string;
  interactive?: boolean;
}

export interface MapInstance {
  id: string;
  provider: string;
  addPolygon(coordinates: number[][]): void;
  addRectangle(bounds: [[number, number], [number, number]]): void;
  addCircle(center: [number, number], radius: number): void;
  clearShapes(): void;
  setView(center: [number, number], zoom: number): void;
  enableDrawing(): void;
  disableDrawing(): void;
  onShapeComplete(callback: (area: number, type: 'polygon' | 'rectangle' | 'circle', coordinates: any) => void): void;
  destroy(): void;
}

export interface GeocodeResult {
  coordinates: [number, number];
  address: string;
  confidence: number;
}

// Free mapping service providers
export class OpenStreetMapProvider implements MapProvider {
  id = 'osm';
  name = 'OpenStreetMap';
  description = 'Free and open-source map data with no API key required';
  isActive = true;
  apiKeyRequired = false;
  freeTier = {
    requestsPerMonth: Infinity,
    requestsPerDay: Infinity,
    features: ['Maps', 'Geocoding', 'Drawing Tools', 'Area Calculation']
  };

  async initialize(): Promise<void> {
    // OpenStreetMap doesn't require initialization
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        coordinates: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
        address: data[0].display_name,
        confidence: parseFloat(data[0].importance) || 0.5
      };
    }
    throw new Error('Address not found');
  }
}

export class MapboxProvider implements MapProvider {
  id = 'mapbox';
  name = 'Mapbox';
  description = 'Free tier with 50,000 map loads per month';
  isActive = true;
  apiKeyRequired = true;
  freeTier = {
    requestsPerMonth: 50000,
    requestsPerDay: 1667,
    features: ['Maps', 'Geocoding', 'Drawing Tools', 'Satellite Imagery']
  };

  async initialize(): Promise<void> {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Mapbox access token required');
    }
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
      attribution: '© Mapbox © OpenStreetMap',
      maxZoom: 20
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}&limit=1`);
    const data = await response.json();
    
    if (data.features.length > 0) {
      const feature = data.features[0];
      return {
        coordinates: [feature.center[1], feature.center[0]], // Mapbox returns [lng, lat]
        address: feature.place_name,
        confidence: feature.relevance || 0.5
      };
    }
    throw new Error('Address not found');
  }
}

export class LeafletProvider implements MapProvider {
  id = 'leaflet';
  name = 'Leaflet';
  description = 'Open-source JavaScript library for interactive maps';
  isActive = true;
  apiKeyRequired = false;
  freeTier = {
    requestsPerMonth: Infinity,
    requestsPerDay: Infinity,
    features: ['Maps', 'Drawing Tools', 'Plugins', 'Customizable']
  };

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    // Use CartoDB tile layer for Leaflet
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CartoDB',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    // Use OpenStreetMap Nominatim for geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        coordinates: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
        address: data[0].display_name,
        confidence: parseFloat(data[0].importance) || 0.5
      };
    }
    throw new Error('Address not found');
  }
}

export class HereProvider implements MapProvider {
  id = 'here';
  name = 'HERE Maps';
  description = 'Free tier with 1,000 transactions per month';
  isActive = true;
  apiKeyRequired = true;
  freeTier = {
    requestsPerMonth: 1000,
    requestsPerDay: 33,
    features: ['Maps', 'Geocoding', 'Routing', 'Places']
  };

  async initialize(): Promise<void> {
    const apiKey = import.meta.env.VITE_HERE_API_KEY;
    if (!apiKey) {
      throw new Error('HERE API key required');
    }
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    const apiKey = import.meta.env.VITE_HERE_API_KEY;
    L.tileLayer(`https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?apikey=${apiKey}`, {
      attribution: '© HERE',
      maxZoom: 20
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const apiKey = import.meta.env.VITE_HERE_API_KEY;
    const response = await fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apikey=${apiKey}&limit=1`);
    const data = await response.json();
    
    if (data.items.length > 0) {
      const item = data.items[0];
      return {
        coordinates: [item.position.lat, item.position.lng],
        address: item.title,
        confidence: item.scoring?.queryScore || 0.5
      };
    }
    throw new Error('Address not found');
  }
}

export class MapTilerProvider implements MapProvider {
  id = 'maptiler';
  name = 'MapTiler';
  description = 'Free tier with 100,000 map loads per month';
  isActive = true;
  apiKeyRequired = true;
  freeTier = {
    requestsPerMonth: 100000,
    requestsPerDay: 3333,
    features: ['Maps', 'Geocoding', 'Vector Tiles', 'Satellite']
  };

  async initialize(): Promise<void> {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    if (!apiKey) {
      throw new Error('MapTiler API key required');
    }
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${apiKey}`, {
      attribution: '© MapTiler © OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${apiKey}&limit=1`);
    const data = await response.json();
    
    if (data.features.length > 0) {
      const feature = data.features[0];
      return {
        coordinates: [feature.center[1], feature.center[0]], // MapTiler returns [lng, lat]
        address: feature.place_name,
        confidence: feature.relevance || 0.5
      };
    }
    throw new Error('Address not found');
  }
}

// Additional free mapping providers
export class ArcGISProvider implements MapProvider {
  id = 'arcgis';
  name = 'ArcGIS Online';
  description = 'Free public account with 2 million basemap tiles per month';
  isActive = true;
  apiKeyRequired = false;
  freeTier = {
    requestsPerMonth: 2000000,
    requestsPerDay: 66667,
    features: ['Maps', 'Geocoding', 'World Imagery', 'Topographic']
  };

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=${encodeURIComponent(address)}&f=json&outFields=*&maxLocations=1`);
    const data = await response.json();
    
    if (data.candidates.length > 0) {
      const candidate = data.candidates[0];
      return {
        coordinates: [candidate.location.y, candidate.location.x],
        address: candidate.address,
        confidence: candidate.score / 100
      };
    }
    throw new Error('Address not found');
  }
}

export class BingMapsProvider implements MapProvider {
  id = 'bing';
  name = 'Bing Maps';
  description = 'Free tier with 125,000 transactions per year';
  isActive = true;
  apiKeyRequired = true;
  freeTier = {
    requestsPerMonth: 10417,
    requestsPerDay: 347,
    features: ['Maps', 'Geocoding', 'Satellite', 'Traffic']
  };

  async initialize(): Promise<void> {
    const apiKey = import.meta.env.VITE_BING_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Bing Maps API key required');
    }
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    const apiKey = import.meta.env.VITE_BING_MAPS_API_KEY;
    L.tileLayer(`https://ecn.t3.tiles.virtualearth.net/tiles/r{quad}?g=1&mkt=en-US&key=${apiKey}`, {
      attribution: '© Microsoft',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const apiKey = import.meta.env.VITE_BING_MAPS_API_KEY;
    const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations?query=${encodeURIComponent(address)}&key=${apiKey}&maxResults=1`);
    const data = await response.json();
    
    if (data.resourceSets[0].resources.length > 0) {
      const resource = data.resourceSets[0].resources[0];
      return {
        coordinates: [resource.point.coordinates[0], resource.point.coordinates[1]],
        address: resource.address.formattedAddress,
        confidence: resource.confidence === 'High' ? 0.9 : resource.confidence === 'Medium' ? 0.6 : 0.3
      };
    }
    throw new Error('Address not found');
  }
}

export class TomTomProvider implements MapProvider {
  id = 'tomtom';
  name = 'TomTom Maps';
  description = 'Free tier with 2,500 API calls per day';
  isActive = true;
  apiKeyRequired = true;
  freeTier = {
    requestsPerMonth: 75000,
    requestsPerDay: 2500,
    features: ['Maps', 'Geocoding', 'Routing', 'Traffic']
  };

  async initialize(): Promise<void> {
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    if (!apiKey) {
      throw new Error('TomTom API key required');
    }
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    L.tileLayer(`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${apiKey}`, {
      attribution: '© TomTom',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const apiKey = import.meta.env.VITE_TOMTOM_API_KEY;
    const response = await fetch(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}&limit=1`);
    const data = await response.json();
    
    if (data.results.length > 0) {
      const result = data.results[0];
      return {
        coordinates: [result.position.lat, result.position.lon],
        address: result.address.freeformAddress,
        confidence: result.score
      };
    }
    throw new Error('Address not found');
  }
}

export class EsriProvider implements MapProvider {
  id = 'esri';
  name = 'Esri World Imagery';
  description = 'Free access to Esri World Imagery basemap';
  isActive = true;
  apiKeyRequired = false;
  freeTier = {
    requestsPerMonth: Infinity,
    requestsPerDay: Infinity,
    features: ['Satellite Imagery', 'World Topographic', 'Street Maps']
  };

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=${encodeURIComponent(address)}&f=json&outFields=*&maxLocations=1`);
    const data = await response.json();
    
    if (data.candidates.length > 0) {
      const candidate = data.candidates[0];
      return {
        coordinates: [candidate.location.y, candidate.location.x],
        address: candidate.address,
        confidence: candidate.score / 100
      };
    }
    throw new Error('Address not found');
  }
}

export class CartoDBProvider implements MapProvider {
  id = 'cartodb';
  name = 'CartoDB';
  description = 'Free and open-source cartography platform';
  isActive = true;
  apiKeyRequired = false;
  freeTier = {
    requestsPerMonth: Infinity,
    requestsPerDay: Infinity,
    features: ['Light/Dark themes', 'Positron', 'Voyager', 'No labels']
  };

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const map = L.map(containerId).setView(options.center, options.zoom);
    
    const style = options.style || 'light_all';
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`, {
      attribution: '© OpenStreetMap © CartoDB',
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    return new LeafletMapInstance(map, this.id);
  }

  calculateArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  async geocode(address: string): Promise<GeocodeResult> {
    // Use OpenStreetMap Nominatim for geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        coordinates: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
        address: data[0].display_name,
        confidence: parseFloat(data[0].importance) || 0.5
      };
    }
    throw new Error('Address not found');
  }
}

// Leaflet Map Instance Implementation
class LeafletMapInstance implements MapInstance {
  private shapes: L.Layer[] = [];
  private drawingEnabled = false;
  private onShapeCompleteCallback?: (area: number, type: 'polygon' | 'rectangle' | 'circle', coordinates: any) => void;

  constructor(
    private map: L.Map,
    public provider: string
  ) {
    this.setupEventHandlers();
  }

  get id(): string {
    return `map-${this.provider}-${Date.now()}`;
  }

  private setupEventHandlers(): void {
    this.map.on('click', (e) => {
      if (this.drawingEnabled && this.onShapeCompleteCallback) {
        // Simple click-to-add-point functionality
        toast.info('Click multiple points to create a polygon, or use drawing tools');
      }
    });
  }

  addPolygon(coordinates: number[][]): void {
    const latLngs = coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
    const polygon = L.polygon(latLngs, { color: 'blue', fillOpacity: 0.3 }).addTo(this.map);
    this.shapes.push(polygon);
    
    const area = this.calculatePolygonArea(coordinates);
    if (this.onShapeCompleteCallback) {
      this.onShapeCompleteCallback(area, 'polygon', coordinates);
    }
  }

  addRectangle(bounds: [[number, number], [number, number]]): void {
    const rectangle = L.rectangle(bounds, { color: 'red', fillOpacity: 0.3 }).addTo(this.map);
    this.shapes.push(rectangle);
    
    // Calculate coordinates for area calculation
    const coordinates = [
      [bounds[0][1], bounds[0][0]], // SW
      [bounds[1][1], bounds[0][0]], // NW
      [bounds[1][1], bounds[1][0]], // NE
      [bounds[0][1], bounds[1][0]], // SE
      [bounds[0][1], bounds[0][0]]  // Close polygon
    ];
    
    const area = this.calculatePolygonArea(coordinates);
    if (this.onShapeCompleteCallback) {
      this.onShapeCompleteCallback(area, 'rectangle', bounds);
    }
  }

  addCircle(center: [number, number], radius: number): void {
    const circle = L.circle(center, { radius, color: 'green', fillOpacity: 0.3 }).addTo(this.map);
    this.shapes.push(circle);
    
    // Calculate area for circle
    const area = Math.PI * radius * radius;
    if (this.onShapeCompleteCallback) {
      this.onShapeCompleteCallback(area, 'circle', { center, radius });
    }
  }

  clearShapes(): void {
    this.shapes.forEach(shape => this.map.removeLayer(shape));
    this.shapes = [];
  }

  setView(center: [number, number], zoom: number): void {
    this.map.setView(center, zoom);
  }

  enableDrawing(): void {
    this.drawingEnabled = true;
    toast.info('Drawing mode enabled - click on map to start drawing');
  }

  disableDrawing(): void {
    this.drawingEnabled = false;
    toast.info('Drawing mode disabled');
  }

  onShapeComplete(callback: (area: number, type: 'polygon' | 'rectangle' | 'circle', coordinates: any) => void): void {
    this.onShapeCompleteCallback = callback;
  }

  private calculatePolygonArea(coordinates: number[][]): number {
    const polygon = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [coordinates]
      }
    };
    return turf.default(polygon);
  }

  destroy(): void {
    this.clearShapes();
    this.map.remove();
  }
}

// Mapping Service Manager
export class MappingServiceManager {
  private providers: Map<string, MapProvider> = new Map();
  private activeProvider: string = 'osm';
  private currentMap?: MapInstance;

  constructor() {
    this.registerProviders();
  }

  private registerProviders(): void {
    const providers = [
      new OpenStreetMapProvider(),
      new MapboxProvider(),
      new LeafletProvider(),
      new HereProvider(),
      new MapTilerProvider(),
      new ArcGISProvider(),
      new BingMapsProvider(),
      new TomTomProvider(),
      new EsriProvider(),
      new CartoDBProvider()
    ];

    providers.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  getProviders(): MapProvider[] {
    return Array.from(this.providers.values());
  }

  getActiveProviders(): MapProvider[] {
    return this.getProviders().filter(p => p.isActive);
  }

  getProvider(id: string): MapProvider | undefined {
    return this.providers.get(id);
  }

  async setActiveProvider(providerId: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    try {
      await provider.initialize();
      this.activeProvider = providerId;
      toast.success(`Switched to ${provider.name}`);
    } catch (error) {
      toast.error(`Failed to initialize ${provider.name}: ${error.message}`);
      throw error;
    }
  }

  getActiveProvider(): MapProvider {
    return this.providers.get(this.activeProvider)!;
  }

  async createMap(containerId: string, options: MapOptions): Promise<MapInstance> {
    const provider = this.getActiveProvider();
    
    if (this.currentMap) {
      this.currentMap.destroy();
    }

    try {
      this.currentMap = await provider.createMap(containerId, options);
      return this.currentMap;
    } catch (error) {
      toast.error(`Failed to create map with ${provider.name}: ${error.message}`);
      throw error;
    }
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const provider = this.getActiveProvider();
    
    try {
      return await provider.geocode(address);
    } catch (error) {
      // Fallback to OpenStreetMap if current provider fails
      if (provider.id !== 'osm') {
        toast.warning(`${provider.name} geocoding failed, trying OpenStreetMap`);
        const osmProvider = this.providers.get('osm')!;
        return await osmProvider.geocode(address);
      }
      throw error;
    }
  }

  calculateArea(coordinates: number[][]): number {
    const provider = this.getActiveProvider();
    return provider.calculateArea(coordinates);
  }

  getCurrentMap(): MapInstance | undefined {
    return this.currentMap;
  }

  destroy(): void {
    if (this.currentMap) {
      this.currentMap.destroy();
      this.currentMap = undefined;
    }
  }
}

// Global instance
export const mappingService = new MappingServiceManager();