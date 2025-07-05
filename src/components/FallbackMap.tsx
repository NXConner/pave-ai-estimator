import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Square, Trash2 } from 'lucide-react';

interface Polygon {
  id: string;
  area: number;
  points: Array<{ x: number; y: number }>;
}

interface FallbackMapProps {
  onPolygonComplete?: (area: number) => void;
  onAddressSelect?: (address: string) => void;
}

const FallbackMap: React.FC<FallbackMapProps> = ({ onPolygonComplete, onAddressSelect }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [manualArea, setManualArea] = useState('');
  const [address, setAddress] = useState('');

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPoint = { x, y };
    setCurrentPoints(prev => [...prev, newPoint]);
  };

  const completePolygon = () => {
    if (currentPoints.length < 3) return;

    // Simple area calculation using shoelace formula (approximate)
    let area = 0;
    for (let i = 0; i < currentPoints.length; i++) {
      const j = (i + 1) % currentPoints.length;
      area += currentPoints[i].x * currentPoints[j].y;
      area -= currentPoints[j].x * currentPoints[i].y;
    }
    area = Math.abs(area) / 2;
    
    // Convert pixels to approximate square feet (rough estimation)
    const sqFt = area * 2; // 2 sq ft per pixel approximation
    
    const newPolygon: Polygon = {
      id: Date.now().toString(),
      area: sqFt,
      points: currentPoints
    };

    setPolygons(prev => [...prev, newPolygon]);
    setCurrentPoints([]);
    setIsDrawing(false);
    onPolygonComplete?.(sqFt);
  };

  const clearPolygons = () => {
    setPolygons([]);
    setCurrentPoints([]);
    setIsDrawing(false);
  };

  const addManualArea = () => {
    if (!manualArea || isNaN(Number(manualArea))) return;
    
    const area = Number(manualArea);
    const newPolygon: Polygon = {
      id: Date.now().toString(),
      area,
      points: []
    };

    setPolygons(prev => [...prev, newPolygon]);
    setManualArea('');
    onPolygonComplete?.(area);
  };

  const handleAddressSubmit = () => {
    if (address.trim()) {
      onAddressSelect?.(address);
    }
  };

  const totalArea = polygons.reduce((sum, polygon) => sum + polygon.area, 0);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-primary">Map Controls (Demo Mode)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter address for demo..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
            />
            <Button onClick={handleAddressSubmit} size="sm">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setIsDrawing(!isDrawing)}
              variant={isDrawing ? 'destructive' : 'default'}
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              {isDrawing ? 'Cancel Drawing' : 'Start Drawing'}
            </Button>
            
            {isDrawing && currentPoints.length >= 3 && (
              <Button onClick={completePolygon} variant="secondary" size="sm">
                Complete Polygon
              </Button>
            )}
            
            <Button onClick={clearPolygons} variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter area manually (sq ft)"
              value={manualArea}
              onChange={(e) => setManualArea(e.target.value)}
              type="number"
            />
            <Button onClick={addManualArea} size="sm">
              Add Area
            </Button>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">
              Total Area: {totalArea.toLocaleString()} sq ft
            </Badge>
            <Badge variant="outline">
              Polygons: {polygons.length}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Map Area */}
      <div 
        className="flex-1 bg-muted border-2 border-dashed border-border rounded-lg relative overflow-hidden cursor-crosshair"
        onClick={handleMapClick}
        style={{ minHeight: '400px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Demo Map Area
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isDrawing 
                ? `Click to add points to your polygon (${currentPoints.length} points)`
                : 'Click "Start Drawing" to begin measuring areas'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              For full functionality, add your Google Maps API key
            </p>
          </div>
        </div>

        {/* Draw current polygon points */}
        {currentPoints.map((point, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: point.x - 4,
              top: point.y - 4,
            }}
          />
        ))}

        {/* Draw polygon lines */}
        {currentPoints.length > 1 && (
          <svg className="absolute inset-0 pointer-events-none">
            <polyline
              points={currentPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </svg>
        )}

        {/* Draw completed polygons */}
        {polygons.map((polygon) => (
          <svg key={polygon.id} className="absolute inset-0 pointer-events-none">
            {polygon.points.length > 0 && (
              <polygon
                points={polygon.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="hsl(var(--primary) / 0.3)"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            )}
          </svg>
        ))}
      </div>
    </div>
  );
};

export default FallbackMap;