import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MissionData {
  id: string;
  status: 'active' | 'standby' | 'completed' | 'critical';
  location: string;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const EchoCommHUD = () => {
  const [missions, setMissions] = useState<MissionData[]>([
    {
      id: 'PAVE-001',
      status: 'active',
      location: 'Stuart, VA - Residential Driveway',
      progress: 65,
      priority: 'high'
    },
    {
      id: 'PAVE-002', 
      status: 'standby',
      location: 'Madison, NC - Parking Lot',
      progress: 0,
      priority: 'medium'
    }
  ]);

  const [systemStatus, setSystemStatus] = useState({
    gps: 'ONLINE',
    comms: 'ONLINE', 
    sensors: 'ONLINE',
    ai: 'PROCESSING'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'critical': return 'bg-red-500 animate-pulse';
      case 'standby': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-black/90 text-green-400 font-mono">
      {/* System Status Panel */}
      <Card className="bg-black/80 border-green-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 text-sm font-bold tracking-wider">
            SYSTEM STATUS
          </CardTitle>
          <div className="text-xs text-green-300">
            {currentTime.toLocaleTimeString()} UTC
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(systemStatus).map(([system, status]) => (
            <div key={system} className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wide">{system}</span>
              <Badge 
                variant={status === 'ONLINE' ? 'default' : 'secondary'}
                className={status === 'ONLINE' ? 'bg-green-600 text-black' : 'bg-yellow-600 text-black'}
              >
                {status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mission Control */}
      <Card className="bg-black/80 border-green-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 text-sm font-bold tracking-wider">
            ACTIVE MISSIONS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {missions.map((mission) => (
            <div key={mission.id} className="space-y-2 p-2 border border-green-500/20 rounded">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-green-300">{mission.id}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(mission.status)}`} />
                  <Badge variant={getPriorityColor(mission.priority)} className="text-xs">
                    {mission.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-xs text-green-200">{mission.location}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{mission.progress}%</span>
                </div>
                <Progress value={mission.progress} className="h-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tactical Data */}
      <Card className="bg-black/80 border-green-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-400 text-sm font-bold tracking-wider">
            TACTICAL DATA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="text-green-300">COORDINATES</div>
              <div className="text-green-100">36.7058° N</div>
              <div className="text-green-100">80.2723° W</div>
            </div>
            <div className="space-y-1">
              <div className="text-green-300">WEATHER</div>
              <div className="text-green-100">CLEAR</div>
              <div className="text-green-100">72°F</div>
            </div>
          </div>
          
          <div className="border-t border-green-500/30 pt-3">
            <div className="text-xs text-green-300 mb-2">FLEET STATUS</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>1978 Chevy C30</span>
                <span className="text-green-400">READY</span>
              </div>
              <div className="flex justify-between">
                <span>1995 Dodge Dakota</span>
                <span className="text-green-400">READY</span>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700 text-black font-bold"
            >
              INITIALIZE MISSION
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};