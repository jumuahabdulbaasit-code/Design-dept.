import { motion } from "motion/react";
import { Shield, Zap, Globe, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Our AI engine processes your designs in seconds, providing immediate feedback on colors and typography."
    },
    {
      icon: Shield,
      title: "Professional Grade",
      description: "Built for designers who need precision. We use advanced computer vision to identify exact design elements."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join thousands of designers worldwide sharing templates and inspiring each other every day."
    },
    {
      icon: Users,
      title: "Collaborative Tools",
      description: "Share your analyzed results with clients or team members easily with our export features."
    }
  ];

  return (
    <section id="about" className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 tracking-tight">Why Design dept.?</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Design dept. was founded on a simple idea: that the technical details of a design 
              shouldn't be a mystery. We've built a platform that bridges the gap between 
              creative vision and technical implementation.
            </p>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Whether you're a seasoned professional looking to speed up your workflow or a 
              beginner trying to understand what makes a design work, our tools are 
              designed to empower your creative journey.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/graphic-designer-laptop/1000/1000" 
                alt="Graphic designer working on laptop"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl -z-10 rotate-12" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-accent rounded-2xl -z-10 -rotate-12" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
