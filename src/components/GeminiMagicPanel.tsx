import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export const GeminiMagicPanel = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [magicLevel, setMagicLevel] = useState(75);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const suggestions = [
        `🪄 Estimated material cost for ${prompt}: $2,850 - $3,200`,
        `✨ Optimal application temperature: 65-85°F`,
        `🌟 Recommended crew size: 3-4 personnel`,
        `💫 Project duration estimate: 2-3 days`,
        `🎭 Weather considerations: Clear skies preferred`
      ];
      
      setGeneratedContent(suggestions);
      setIsGenerating(false);
      setMagicLevel(Math.min(100, magicLevel + 10));
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            🪄 Gemini Create Magic
            <Badge variant="secondary" className="bg-purple-600/30 text-purple-100">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-purple-200">Magic Prompt</label>
            <Textarea
              placeholder="Describe your paving project and let AI magic enhance your estimates..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-purple-100 placeholder:text-purple-300/60"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? "✨ Generating Magic..." : "🪄 Cast Enhancement Spell"}
            </Button>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs text-purple-200">
                <span>Magic Level</span>
                <span>{magicLevel}%</span>
              </div>
              <Progress 
                value={magicLevel} 
                className="h-2 bg-purple-900/30"
              />
            </div>
          </div>

          {isGenerating && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin text-4xl">✨</div>
              <p className="text-purple-300 mt-2">Channeling AI magic...</p>
            </div>
          )}

          {generatedContent.length > 0 && !isGenerating && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-purple-200">🌟 Enhanced Insights</h4>
              <div className="space-y-2">
                {generatedContent.map((content, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-lg border border-purple-500/20"
                  >
                    <p className="text-sm text-purple-100">{content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};