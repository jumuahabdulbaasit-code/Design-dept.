import { motion } from "motion/react";
import { ArrowRight, Sparkles, Layers, MousePointer2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background 3D-like elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>AI-Powered Design Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            The Department of <br />
            <span className="text-primary">Design Intelligence</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
            Upload your designs and let our AI extract colors, identify fonts, 
            and analyze shapes instantly. The ultimate toolkit for modern graphic designers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#analyze"
              className="group bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
            >
              Analyze Design
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#showcase"
              className="px-8 py-4 rounded-full font-semibold border border-border hover:bg-muted transition-colors"
            >
              Explore Showcase
            </a>
          </div>
        </motion.div>

        {/* 3D Floating Cards Preview */}
        <div className="mt-20 relative h-[400px] hidden md:block">
          <motion.div
            initial={{ rotateY: -20, rotateX: 10, opacity: 0 }}
            animate={{ rotateY: -10, rotateX: 5, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[350px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="text-xs font-mono text-muted-foreground">DESIGN_ANALYSIS_V1.EXE</div>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-32 w-full bg-muted rounded-lg flex items-center justify-center">
                  <Layers className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded bg-muted" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded" />
                  <div className="h-2 w-full bg-muted rounded" />
                  <div className="h-2 w-2/3 bg-muted rounded" />
                </div>
                <div className="pt-4">
                  <div className="h-10 w-full border border-primary/30 rounded-lg flex items-center justify-center text-xs text-primary font-medium">
                    IDENTIFYING FONTS...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[20%] top-10 p-4 bg-background border border-border rounded-xl shadow-xl"
          >
            <MousePointer2 className="w-6 h-6 text-primary" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[20%] bottom-20 p-4 bg-background border border-border rounded-xl shadow-xl"
          >
            <Sparkles className="w-6 h-6 text-accent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
