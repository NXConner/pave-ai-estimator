import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type Theme = 'default' | 'gemini-magic' | 'tactical-comm' | 'matrix-protocol' | 'nexus-combined';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes = {
  'default': {
    name: 'PaveEstimator Pro',
    description: 'Professional asphalt estimation platform',
    colors: ['#00BFFF', '#1E293B', '#0F172A'],
    features: ['Material calculations', 'Cost estimation', 'Map integration']
  },
  'gemini-magic': {
    name: 'Gemini Create Magic',
    description: 'AI-powered creative workspace with mystical aesthetics',
    colors: ['#CC99FF', '#FF66CC', '#DDAAFF'],
    features: ['AI assistance', 'Creative tools', 'Magic generation']
  },
  'tactical-comm': {
    name: 'Echo Comm Tactical',
    description: 'Military-grade communication interface',
    colors: ['#66FF66', '#FFCC33', '#FF3333'],
    features: ['Tactical HUD', 'Mission planning', 'Real-time comms']
  },
  'matrix-protocol': {
    name: 'Matrix Protocol',
    description: 'Cyberpunk data visualization dashboard',
    colors: ['#00FF00', '#00FFFF', '#BB66FF'],
    features: ['Data streams', 'Cyber interface', 'Protocol analysis']
  },
  'nexus-combined': {
    name: 'NexTech System Nexus',
    description: 'Unified multi-modal interface combining all capabilities',
    colors: ['#00BFFF', '#CC99FF', '#66FF66'],
    features: ['All features', 'Adaptive UI', 'Cross-platform']
  }
};

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const handlePreview = (theme: Theme) => {
    setPreviewTheme(theme);
    // Apply temporary theme preview
    document.documentElement.setAttribute('data-theme-preview', theme);
  };

  const handleApply = (theme: Theme) => {
    onThemeChange(theme);
    setPreviewTheme(null);
    document.documentElement.removeAttribute('data-theme-preview');
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎨 Theme Integration Center
          <Badge variant="secondary">Experimental</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(themes).map(([key, theme]) => {
            const themeKey = key as Theme;
            const isActive = currentTheme === themeKey;
            const isPreviewing = previewTheme === themeKey;
            
            return (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all duration-300 ${
                  isActive ? 'ring-2 ring-primary' : ''
                } ${isPreviewing ? 'ring-2 ring-accent' : ''}`}
                onClick={() => handlePreview(themeKey)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">{theme.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-1">
                    {theme.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    {theme.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(themeKey);
                      }}
                    >
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(themeKey);
                      }}
                      className={isActive ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {isActive ? 'Active' : 'Apply'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Quick Theme Selection</h4>
          <Select value={currentTheme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a theme..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(themes).map(([key, theme]) => (
                <SelectItem key={key} value={key}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};