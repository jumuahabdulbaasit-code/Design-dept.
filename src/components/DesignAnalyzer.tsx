import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Loader2, Palette, Type as TypeIcon, Shapes, FileText, X, Check, Sparkles as SparklesIcon } from "lucide-react";
import { analyzeDesign, DesignAnalysis } from "@/src/lib/gemini";
import { extractColors, ColorResult } from "@/src/lib/colors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DesignAnalysis | null>(null);
  const [colors, setColors] = useState<ColorResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setAnalysis(null);
      setColors([]);
      setError(null);
      
      handleAnalyze(result, selectedFile.type);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
  } as any);

  const handleAnalyze = async (base64Data: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const extractedColors = await extractColors(base64Data);
      setColors(extractedColors);

      const base64Content = base64Data.split(",")[1];
      const aiResult = await analyzeDesign(base64Content, mimeType);
      setAnalysis(aiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
    setColors([]);
    setError(null);
  };

  return (
    <section id="analyze" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Design Analyzer</h2>
          <p className="text-muted-foreground">Drop your design here to unlock its secrets</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Area */}
          <div className="space-y-6">
            {!preview ? (
              <div
                {...getRootProps()}
                className={`
                  aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer
                  flex flex-col items-center justify-center p-12 text-center
                  ${isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-border hover:border-primary/50 hover:bg-muted"}
                `}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & drop your design</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Supports PNG, JPG, and WebP. Max file size 10MB.
                </p>
              </div>
            ) : (
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-border group">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain bg-black/5"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                    <div className="relative">
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <SparklesIcon className="w-5 h-5 text-accent absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <p className="mt-4 font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse">
                      Analyzing with AI...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-3xl bg-muted/20"
                >
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <SparklesIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Upload an image to see the AI analysis results</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm">
                      {error}
                    </div>
                  )}

                  <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid grid-cols-4 w-full h-12 p-1 bg-muted rounded-xl">
                      <TabsTrigger value="colors" className="rounded-lg gap-2">
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Colors</span>
                      </TabsTrigger>
                      <TabsTrigger value="fonts" className="rounded-lg gap-2">
                        <TypeIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Fonts</span>
                      </TabsTrigger>
                      <TabsTrigger value="shapes" className="rounded-lg gap-2">
                        <Shapes className="w-4 h-4" />
                        <span className="hidden sm:inline">Shapes</span>
                      </TabsTrigger>
                      <TabsTrigger value="description" className="rounded-lg gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">AI Info</span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                      <TabsContent value="colors" className="mt-0">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Palette className="w-5 h-5 text-primary" />
                              Color Palette
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {isAnalyzing && colors.length === 0 ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/20">
                                    <Skeleton className="w-12 h-12 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                      <Skeleton className="h-4 w-20" />
                                      <Skeleton className="h-3 w-32" />
                                    </div>
                                  </div>
                                ))
                              ) : (
                                colors.map((color, idx) => (
                                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors group">
                                    <div 
                                      className="w-12 h-12 rounded-lg shadow-inner border border-black/5"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm font-bold">{color.hex.toUpperCase()}</span>
                                        <span className="text-xs text-muted-foreground">{color.percentage}%</span>
                                      </div>
                                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{color.rgb}</div>
                                    </div>
                                    <button 
                                      onClick={() => navigator.clipboard.writeText(color.hex)}
                                      className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background rounded-md"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="fonts" className="mt-0">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <TypeIcon className="w-5 h-5 text-primary" />
                              Typography Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {isAnalyzing && !analysis ? (
                                Array.from({ length: 2 }).map((_, i) => (
                                  <div key={i} className="p-4 rounded-xl border border-border bg-muted/10 space-y-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-7 w-48" />
                                  </div>
                                ))
                              ) : (
                                analysis?.fonts.map((font, idx) => (
                                  <div key={idx} className="p-4 rounded-xl border border-border bg-muted/30">
                                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Identified Font</div>
                                    <div className="text-xl font-semibold">{font}</div>
                                  </div>
                                ))
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="shapes" className="mt-0">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Shapes className="w-5 h-5 text-primary" />
                              Shapes & Elements
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {isAnalyzing && !analysis ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                                ))
                              ) : (
                                analysis?.shapes.map((shape, idx) => (
                                  <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm rounded-full">
                                    {shape}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="description" className="mt-0">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="w-5 h-5 text-primary" />
                              AI Design Description
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {isAnalyzing && !analysis ? (
                                  <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[95%]" />
                                    <Skeleton className="h-4 w-[85%]" />
                                    <Skeleton className="h-4 w-[92%]" />
                                    <Skeleton className="h-4 w-[80%]" />
                                  </div>
                                ) : (
                                  analysis?.description
                                )}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
