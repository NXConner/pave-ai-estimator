import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataStream {
  id: string;
  protocol: string;
  data: string;
  timestamp: number;
  type: 'input' | 'output' | 'system' | 'error';
}

export const MatrixProtocolDashboard = () => {
  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [activeConnections, setActiveConnections] = useState(42);

  useEffect(() => {
    const generateDataStream = () => {
      const protocols = ['PAVE_CALC', 'MAP_API', 'COST_EST', 'MATERIAL_DB', 'WEATHER_SVC'];
      const dataTypes = ['input', 'output', 'system', 'error'] as const;
      const messages = [
        'Calculating polygon area: 2,450 sq ft',
        'Fetching material prices from database',
        'GPS coordinates locked: 36.7058, -80.2723',
        'Sealer calculation: 318.5 gallons required',
        'Weather data updated: Clear, 72°F',
        'Fleet vehicle status: All units operational',
        'Cost estimation completed: $8,450',
        'Export PDF generation initiated'
      ];

      const newStream: DataStream = {
        id: Date.now().toString(),
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        data: messages[Math.floor(Math.random() * messages.length)],
        timestamp: Date.now(),
        type: dataTypes[Math.floor(Math.random() * dataTypes.length)]
      };

      setDataStreams(prev => [newStream, ...prev.slice(0, 19)]);
      setActiveConnections(prev => Math.max(30, prev + Math.floor(Math.random() * 5) - 2));
    };

    const interval = setInterval(generateDataStream, 1500);
    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'input': return 'text-green-400';
      case 'output': return 'text-cyan-400';
      case 'system': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-green-400';
    }
  };

  const getTypeSymbol = (type: string) => {
    switch (type) {
      case 'input': return '←';
      case 'output': return '→';
      case 'system': return '⚡';
      case 'error': return '⚠';
      default: return '•';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-black border-green-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 font-mono flex items-center gap-2">
            <span className="animate-pulse">●</span>
            MATRIX PROTOCOL INTERFACE
            <Badge variant="secondary" className="bg-green-600/20 text-green-300 font-mono">
              v2.1.9
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-mono text-green-400">{activeConnections}</div>
              <div className="text-xs text-green-300">ACTIVE NODES</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-mono text-cyan-400">{dataStreams.length}</div>
              <div className="text-xs text-cyan-300">DATA STREAMS</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-mono text-blue-400">99.7%</div>
              <div className="text-xs text-blue-300">UPTIME</div>
            </div>
          </div>

          <div className="border-t border-green-500/30 pt-4">
            <div className="text-xs text-green-300 mb-2 font-mono">DATA STREAM LOG:</div>
            <div className="bg-black/50 p-2 rounded border border-green-500/20 h-64 overflow-y-auto font-mono text-xs">
              {dataStreams.map((stream) => (
                <div 
                  key={stream.id} 
                  className={`mb-1 ${getTypeColor(stream.type)} flex items-start gap-2`}
                >
                  <span className="text-green-500 w-4">
                    {getTypeSymbol(stream.type)}
                  </span>
                  <span className="text-green-600 w-20 shrink-0">
                    {new Date(stream.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-cyan-500 w-16 shrink-0">
                    [{stream.protocol}]
                  </span>
                  <span className="flex-1">
                    {stream.data}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-green-900/20 p-2 rounded border border-green-500/20">
              <div className="text-green-300">ENCRYPTION: AES-256</div>
              <div className="text-green-400">STATUS: ACTIVE</div>
            </div>
            <div className="bg-cyan-900/20 p-2 rounded border border-cyan-500/20">
              <div className="text-cyan-300">BANDWIDTH: 1.2GB/s</div>
              <div className="text-cyan-400">LATENCY: 0.23ms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};