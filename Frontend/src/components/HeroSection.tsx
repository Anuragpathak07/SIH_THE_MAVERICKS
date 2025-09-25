import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Play, Shield, Zap } from "lucide-react";
import mineHero from "@/assets/mine-hero.jpg";

export const HeroSection = ({ onDashboardClick }: { onDashboardClick?: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden particle-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-background/10 to-background/20" />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - 3D Visualization */}
          <div className="relative animate-scale-in order-2 lg:order-1">
            <div className="relative p-8 rounded-3xl overflow-hidden group hover:scale-105 transition-transform duration-500" 
                 style={{
                   background: 'hsla(231, 85%, 8%, 0.15)',
                   backdropFilter: 'blur(12px)',
                   border: '0.1px solid hsla(231, 40%, 10%, 0.08)',
                   boxShadow: '0 4px 16px hsla(231, 85%, 7%, 0.2)'
                 }}>
              {/* 3D Mine Model Placeholder */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/3"
                   style={{
                     background: 'linear-gradient(135deg, hsla(186, 100%, 50%, 0.05) 0%, hsla(160, 84%, 39%, 0.05) 100%)',
                     backdropFilter: 'blur(8px)'
                   }}>
                <img 
                  src={mineHero} 
                  alt="3D Mine Digital Twin Visualization"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                
                {/* Real-time Data Points */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full"
                       style={{
                         background: 'hsla(231, 85%, 8%, 0.2)',
                         backdropFilter: 'blur(8px)',
                         border: '0.1px solid hsla(231, 40%, 10%, 0.1)'
                       }}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-white">Sensors Online</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full"
                       style={{
                         background: 'hsla(231, 85%, 8%, 0.2)',
                         backdropFilter: 'blur(8px)',
                         border: '0.1px solid hsla(231, 40%, 10%, 0.1)'
                       }}>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-white">Risk: Low</span>
                  </div>
                </div>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      variant="hero" 
                      size="icon" 
                      className="w-16 h-16 rounded-full neon-glow-aqua"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Digital Twin Label */}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-foreground">Digital Twin Visualization</h3>
                <p className="text-sm text-foreground/60">Interactive 3D mine slope monitoring</p>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 glass-card p-4 rounded-2xl animate-float">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Live</div>
                <div className="text-xs text-foreground/60">Monitoring</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8 animate-fade-in order-1 lg:order-2">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Physics-Informed
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI for Safer Mines
                </span>
              </h1>
              
              <p className="text-xl text-foreground/70 leading-relaxed max-w-xl">
                Revolutionary digital twin technology combined with advanced PINN algorithms 
                to predict and prevent mining disasters before they happen.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">PINN Models</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Real-time Detection</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Predictive Analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="group text-lg px-12 py-6"
                onClick={onDashboardClick}
              >
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.7%</div>
                <div className="text-sm text-foreground/60">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-foreground/60">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-foreground/60">Mines Protected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};