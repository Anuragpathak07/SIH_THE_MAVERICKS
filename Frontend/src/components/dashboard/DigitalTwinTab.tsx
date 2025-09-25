import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Play, RotateCcw, Maximize2, Settings, Eye, Activity } from "lucide-react";
import mineHero from "@/assets/mine-hero.jpg";

export const DigitalTwinTab = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Digital Twin</h1>
          <p className="text-foreground/60">Interactive 3D mine visualization and simulation</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-primary border-primary/30">
            <Activity className="h-3 w-3 mr-1" />
            Real-time Sync
          </Badge>
          <Button variant="hero">
            <Play className="h-4 w-4 mr-2" />
            Start Simulation
          </Button>
        </div>
      </div>

      {/* Main 3D Viewer */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Box className="h-5 w-5 mr-2 text-primary" />
              3D Mine Model Viewer
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gradient-to-br from-background/50 to-background/30 rounded-2xl overflow-hidden">
            {/* 3D Viewer Background */}
            <img 
              src={mineHero} 
              alt="Digital Twin 3D Model"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            
            {/* 3D Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="glass" size="sm" className="p-2">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="glass" size="sm" className="p-2">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="glass" size="sm" className="p-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Layer Controls */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="glass-card p-2 rounded-lg">
                <h4 className="text-xs font-medium text-foreground mb-2">Layers</h4>
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 text-xs">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Geological Structure</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Sensor Network</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input type="checkbox" className="rounded" />
                    <span>Risk Zones</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input type="checkbox" className="rounded" />
                    <span>Equipment</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Points */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass-card p-4 rounded-xl">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">247</div>
                    <div className="text-xs text-foreground/60">Active Sensors</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">98.7%</div>
                    <div className="text-xs text-foreground/60">Sync Accuracy</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">2.1ms</div>
                    <div className="text-xs text-foreground/60">Update Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">Live</div>
                    <div className="text-xs text-foreground/60">Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Hotspots */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse neon-glow-aqua cursor-pointer" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-card px-2 py-1 rounded text-xs whitespace-nowrap">
                  Sensor Cluster A
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-1/3">
              <div className="relative">
                <div className="w-4 h-4 bg-secondary rounded-full animate-pulse neon-glow-emerald cursor-pointer" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-card px-2 py-1 rounded text-xs whitespace-nowrap">
                  Equipment Zone
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twin Data & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Data */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              Real-time Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Temperature</span>
                <span className="text-sm font-medium text-primary">24.7°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Humidity</span>
                <span className="text-sm font-medium text-secondary">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Pressure</span>
                <span className="text-sm font-medium text-primary">1013 hPa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Vibration</span>
                <span className="text-sm font-medium text-secondary">0.3 mm/s</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium text-foreground mb-2">Sync Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-foreground/60">Connected to 247 sensors</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-foreground/60">Last update: 2 seconds ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Settings className="h-4 w-4 mr-2 text-primary" />
              Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="hero" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Run Stability Analysis
              </Button>
              <Button variant="glass" className="w-full">
                <Box className="h-4 w-4 mr-2" />
                Stress Test Simulation
              </Button>
              <Button variant="glass" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                Weather Impact Model
              </Button>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium text-foreground mb-2">Time Controls</h4>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs">1x</Button>
                <Button variant="outline" size="sm" className="text-xs">2x</Button>
                <Button variant="outline" size="sm" className="text-xs">5x</Button>
                <Button variant="outline" size="sm" className="text-xs">10x</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Box className="h-4 w-4 mr-2 text-primary" />
              Model Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Vertices</span>
                <span className="text-sm font-medium">2.4M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Triangles</span>
                <span className="text-sm font-medium">1.8M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Resolution</span>
                <span className="text-sm font-medium">1cm³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Last Update</span>
                <span className="text-sm font-medium">2 min ago</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium text-foreground mb-2">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Render Time</span>
                  <span className="text-primary">16.7ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Memory Usage</span>
                  <span className="text-secondary">847MB</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">GPU Load</span>
                  <span className="text-primary">34%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};