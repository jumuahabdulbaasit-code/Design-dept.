import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a professional, modern, and minimalist logo for a brand named "Design dept.". The logo should be clean, geometric, and suitable for a high-end design agency. Style: ${prompt}. Background: White.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64Data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image was generated. Please try a different prompt.");
      }
    } catch (err) {
      console.error("Logo generation error:", err);
      setError("Failed to generate logo. Please check your API key or try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `design-dept-logo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="logo-generator" className="py-24 bg-background relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
              <Wand2 className="w-3 h-3" />
              <span>AI Brand Identity</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Generate Your <br />
              <span className="text-primary">Brand Identity</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-lg">
              Not sure about the logo? Use our AI-powered brand generator to create unique concepts for "Design dept." instantly. Describe a style, and we'll do the rest.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Bauhaus style, brutalist, futuristic, organic..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateLogo()}
                  className="rounded-full px-6 h-12 border-primary/20 focus-visible:ring-primary"
                />
                <Button 
                  onClick={generateLogo} 
                  disabled={isGenerating || !prompt.trim()}
                  className="rounded-full h-12 px-8 gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate
                </Button>
              </div>
              {error && <p className="text-sm text-red-500 ml-4">{error}</p>}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="text-xs font-medium text-muted-foreground pt-1">Try:</span>
              {['Minimalist', 'Brutalist', 'Bauhaus', 'Futuristic'].map((style) => (
                <button
                  key={style}
                  onClick={() => setPrompt(style)}
                  className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="aspect-square w-full max-w-md mx-auto overflow-hidden border-2 border-primary/10 shadow-2xl relative bg-white flex items-center justify-center p-12">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Crafting your identity...</p>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.div 
                    key="image"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group w-full h-full"
                  >
                    <img 
                      src={generatedImage} 
                      alt="Generated Logo" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button size="sm" variant="secondary" onClick={handleDownload} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="secondary" onClick={generateLogo} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
                      Your AI-generated logo concepts will appear here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}
