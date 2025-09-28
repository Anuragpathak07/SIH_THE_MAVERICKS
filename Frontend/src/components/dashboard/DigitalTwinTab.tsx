import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Box, Play, RotateCcw, Maximize2, Settings, Eye, Activity, RefreshCw, MapPin, CloudRain, Wind, Target, AlertTriangle, Wrench } from "lucide-react";
import mineHero from "@/assets/mine-hero.jpg";
import { useState, useEffect } from "react";
import { useDashboard } from "../Dashboard";
import { GLBViewer } from "./GLBViewer";

// WebGL capability check (for Sketchfab and GLB fallbacks)
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    return !!gl;
  } catch (e) {
    return false;
  }
}

const mineData = [
  { id: 1, name: "Bailadila Iron Ore Mine, Iron Ore, Chhattisgarh", latitude: 18.7100, longitude: 81.0500 },
  { id: 2, name: "Dalli-Rajhara Mine, Iron Ore, Chhattisgarh", latitude: 20.5610, longitude: 81.0700 },
  { id: 3, name: "Gokul Open Pit Mines, Coal, Maharashtra (Nagpur)", latitude: 20.6697, longitude: 79.2964 },
  { id: 4, name: "Hutti Gold Mine, Gold, Karnataka", latitude: 16.1972, longitude: 76.6602 },
  { id: 5, name: "Jaduguda Mine, Uranium, Jharkhand", latitude: 22.6500, longitude: 86.3500 },
  { id: 6, name: "Jharia Coal Mine, Coal, Jharkhand", latitude: 23.7406, longitude: 86.4146 },
  { id: 7, name: "Khetri Copper Mine, Copper, Rajasthan", latitude: 27.9833, longitude: 75.7833 },
  { id: 8, name: "Korba Coal Mine, Coal, Chhattisgarh", latitude: 22.3545, longitude: 82.6872 },
  { id: 9, name: "Majri Mine, Coal, Maharashtra", latitude: 20.0681, longitude: 79.3583 },
  { id: 10, name: "Neemuch Cement Mines, Limestone, Madhya Pradesh", latitude: 24.4766, longitude: 74.8726 },
];

const sketchfabModels = {
  1: {
    src: "https://sketchfab.com/models/e05d6bd862e1494da87f4d62f77f6090/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "Tosyalı Holding / İskenderun Sahası"
  },
  2: {
    src: "https://sketchfab.com/models/64b887af4676475f8e9310e7c54c049c/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "Kopalnia odkrywkowa \"Graniczna\"/ open-pit mine"
  },
  3: {
    src: "https://sketchfab.com/models/d4c90edf676843ed89a26c12228f0abc/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "Jaduguda Mine, Uranium, Jharkhand"
  },
  4: {
    src: "https://sketchfab.com/models/ed830a657f1c43e5bfd7c71687266278/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "Hutti Gold Mine, Gold, Karnataka"
  },
  5: {
    src: "https://sketchfab.com/models/d4c90edf676843ed89a26c12228f0abc/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "Jaduguda Mine, Uranium, Jharkhand"
  },
  6: {
    src: "https://sketchfab.com/models/dd7c1551640241eea23fdbfbeb8511ad/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "ÇİMKO ÇİMENTO FABRİKASI A.Ş. OCAK #2"
  },
  7: {
    src: "https://sketchfab.com/models/d86665e1b1a14331909e3a44ec35fc45/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "In-Active Open Pit Mine"
  },
  8: {
    src: "https://sketchfab.com/models/db7ff66f50af4cda91361b51d20b46ac/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "Bingham Canyon Mine Utah"
  },
  9: {
    src: "https://sketchfab.com/models/b103552d06814fefac93089060897378/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "03.05.2019 Coal Mine Open Pit"
  },
  10: {
    src: "https://sketchfab.com/models/ed830a657f1c43e5bfd7c71687266278/embed?ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0",
    title: "AYC Quarry Model / Adana-Karaisalı #2"
  }
};

const glbModels = {
  1: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  2: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  3: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  4: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  5: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  6: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  7: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  },
  8: {
    path: "/chuquicamata_mine_chile.glb",
    title: "Chuquicamata Mine - Chile"
  }
};

// Location types and positions for mine areas
const mineLocations = [
  { id: 'overview', name: 'Mine Overview', icon: Target, position: [0, 0, 0] },
  { id: 'risk-zones', name: 'Risk Zones', icon: AlertTriangle, position: [-5, 2, -3] },
  { id: 'equipment', name: 'Equipment Zone', icon: Wrench, position: [4, -1, 2] },
  { id: 'mine-centre', name: 'Mine Centre', icon: MapPin, position: [0, -2, 0] }
];

export const DigitalTwinTab = () => {
  const { selectedLocation, realtimeWeather, setRealtimeWeather } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const webglSupported = typeof window !== 'undefined' ? isWebGLSupported() : true;

  const fetchRealtimeData = async () => {
    if (!selectedLocation) return;

    const mine = mineData.find((m) => m.id.toString() === selectedLocation);
    if (!mine) return;

    setIsLoading(true);
    try {
      const url = new URL("http://localhost:8000/realtimedata");
      url.searchParams.set("lat", mine.latitude.toString());
      url.searchParams.set("lon", mine.longitude.toString());
      url.searchParams.set("id", String(mine.id));
      url.searchParams.set("location", mine.name);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setRealtimeWeather(data);
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-update realtime data when location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchRealtimeData();
    }
  }, [selectedLocation]);

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
              
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gradient-to-br from-background/50 to-background/30 rounded-2xl overflow-hidden">
            {/* Conditional 3D Viewer */}
            {selectedLocation && sketchfabModels[parseInt(selectedLocation)] ? (
              // Show Sketchfab 3D Model
              <div className="w-full h-full relative">
                {webglSupported ? (
                  <iframe
                    title={sketchfabModels[parseInt(selectedLocation)].title}
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src={sketchfabModels[parseInt(selectedLocation)].src}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted/40">
                    <div className="text-center space-y-2 p-6">
                      <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto" />
                      <p className="text-sm text-foreground">WebGL not available in this browser or session.</p>
                      <p className="text-xs text-muted-foreground">Enable hardware acceleration or try a different browser. The 3D viewer will be available when WebGL is supported.</p>
                    </div>
                  </div>
                )}
                
                {/* Mine Name Overlay - Full Width Top */}
                <div className="absolute top-0 left-0 right-0 z-10">
                  <div className="bg-card backdrop-blur-sm text-card-foreground border-b border-border px-6 py-2 flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg font-semibold tracking-wide">
                      {mineData.find(m => m.id.toString() === selectedLocation)?.name}
                    </span>
                  </div>
                </div>

                {/* Sensor Statistics Overlay - Bottom Left */}
<div className="absolute bottom-1 left-1 z-10">
  <div className="bg-white p-4 rounded-xl shadow-lg">
    <div className="grid grid-cols-2 gap-4 text-center min-w-[240px]">
      <div>
        <div className="text-lg font-bold text-primary">{realtimeWeather?.active_sensors || "__"}</div>
        <div className="text-xs text-gray-600">Active Sensors</div>
      </div>
      <div>
        <div className="text-lg font-bold text-green-500">{realtimeWeather?.sync_accuracy || "__"}</div>
        <div className="text-xs text-gray-600">Sync Accuracy</div>
      </div>
      <div>
        <div className="text-lg font-bold text-primary">{realtimeWeather?.update_rate || "__"}</div>
        <div className="text-xs text-gray-600">Update Rate</div>
      </div>
      <div>
        <div className="text-lg font-bold text-green-500">{realtimeWeather?.last_update || "__"}</div>
        <div className="text-xs text-gray-600">Last Update</div>
      </div>
    </div>
  </div>
</div>

              </div>
            ) : selectedLocation && glbModels[parseInt(selectedLocation)] ? (
              // Show GLB 3D Model
              <div className="w-full h-full relative">
                <GLBViewer 
                  modelPath={glbModels[parseInt(selectedLocation)].path}
                  className="w-full h-full"
                  cameraTarget={mineLocations.find(loc => loc.id === selectedView)?.position}
                />
                
                {/* Mine Name Overlay - Full Width Top */}
                <div className="absolute top-0 left-0 right-0 z-10">
                  <div className="bg-card backdrop-blur-sm text-card-foreground border-b border-border px-6 py-2 flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg font-semibold tracking-wide">
                      {mineData.find(m => m.id.toString() === selectedLocation)?.name}
                    </span>
                  </div>
                </div>

                {/* Sensor Statistics Overlay - Bottom Left */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="grid grid-cols-2 gap-4 text-center min-w-[240px]">
                      <div>
                        <div className="text-lg font-bold text-primary">{realtimeWeather?.active_sensors || "__"}</div>
                        <div className="text-xs text-gray-600">Active Sensors</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-500">{realtimeWeather?.sync_accuracy || "__"}</div>
                        <div className="text-xs text-gray-600">Sync Accuracy</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary">{realtimeWeather?.update_rate || "__"}</div>
                        <div className="text-xs text-gray-600">Update Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-500">{realtimeWeather?.last_update || "__"}</div>
                        <div className="text-xs text-gray-600">Last Update</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Navigation Panel - Moved Right */}
                <div className="absolute top-4 right-4 glass-card p-4 rounded-lg min-w-[200px]">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Location
                  </h4>
                  <RadioGroup value={selectedView} onValueChange={setSelectedView} className="space-y-2">
                    {mineLocations.map((location) => {
                      const IconComponent = location.icon;
                      return (
                        <div key={location.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={location.id} id={location.id} />
                          <Label 
                            htmlFor={location.id} 
                            className="flex items-center space-x-2 text-xs cursor-pointer hover:text-primary transition-colors"
                          >
                            <IconComponent className="h-3 w-3" />
                            <span>{location.name}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            ) : (
              // Show Static Image (for mines 9-11 or when no selection)
              <div className="w-full h-full relative">
                <img 
                  src={mineHero} 
                  alt="Digital Twin 3D Model"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                
                {/* Mine Name Overlay - Full Width Top */}
                <div className="absolute top-0 left-0 right-0 z-10">
                  <div className="bg-card backdrop-blur-sm text-card-foreground border-b border-border px-6 py-2 flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg font-semibold tracking-wide">
                      {selectedLocation 
                        ? mineData.find(m => m.id.toString() === selectedLocation)?.name 
                        : "Select a mine location to view 3D model"
                      }
                    </span>
                  </div>
                </div>

                {/* Mine Icon Overlay - Bottom Left (if location selected) */}
                {selectedLocation && (
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-background/95 backdrop-blur-sm text-primary border border-primary/30 p-4 rounded-full shadow-lg hover:bg-background transition-colors">
                      <Target className="h-6 w-6" />
                    </div>
                  </div>
                )}
                
                {/* 3D Controls - Only show when location is selected */}
                {selectedLocation && (
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
                )}

                {/* Layer Controls - Only show when location is selected */}
                {selectedLocation && (
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 space-y-2">
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
                )}

                {/* Data Points - Only show when location is selected */}
                {selectedLocation && (
                  <div className="absolute bottom-4 right-4">
                    <div className="glass-card p-4 rounded-xl">
                      <div className="grid grid-cols-2 gap-4 text-center min-w-[280px]">
                        <div>
                          <div className="text-lg font-bold text-primary">{realtimeWeather?.active_sensors || "__"}</div>
                          <div className="text-xs text-foreground/60">Active Sensors</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-500">{realtimeWeather?.sync_accuracy || "__"}</div>
                          <div className="text-xs text-foreground/60">Sync Accuracy</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{realtimeWeather?.update_rate || "__"}</div>
                          <div className="text-xs text-foreground/60">Update Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-500">{realtimeWeather?.last_update || "__"}</div>
                          <div className="text-xs text-foreground/60">Status</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Twin Data & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Real-time Data */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-primary" />
                Real-time Data
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchRealtimeData}
                  disabled={isLoading || !selectedLocation}
                  className="h-7 px-2"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLocation && (
              <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {mineData.find(m => m.id.toString() === selectedLocation)?.name}
                  </span>
                </div>
                {realtimeWeather && (
                  <div className="text-xs text-foreground/60">
                    Last Updated: {new Date(realtimeWeather.time || Date.now()).toLocaleString()}
                  </div>
                )}
              </div>
            )}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Temperature</span>
                <span className="text-sm font-medium text-primary">
                  {realtimeWeather?.temperature_C ? `${realtimeWeather.temperature_C.toFixed(2)}°C` : '__'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Humidity</span>
                <span className="text-sm font-medium text-secondary">
                  {realtimeWeather?.humidity_percent ? `${realtimeWeather.humidity_percent.toFixed(2)}%` : '__'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Pressure</span>
                <span className="text-sm font-medium text-primary">
                  {realtimeWeather?.pressure_hPa ? `${realtimeWeather.pressure_hPa.toFixed(2)} hPa` : '__'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Wind Speed</span>
                <span className="text-sm font-medium text-secondary">
                  {realtimeWeather?.windspeed_m_s ? `${realtimeWeather.windspeed_m_s.toFixed(2)} m/s` : '__'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Wind Direction</span>
                <span className="text-sm font-medium text-primary">
                  {realtimeWeather?.winddirection_deg ? `${realtimeWeather.winddirection_deg.toFixed(0)}°` : '__'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Vibration</span>
                <span className="text-sm font-medium text-secondary">
                  {realtimeWeather?.vibration_mm_s ? `${realtimeWeather.vibration_mm_s.toFixed(2)} mm/s` : '__'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Rainfall (7d)</span>
                <span className="text-sm font-medium text-primary">
                  {realtimeWeather?.rainfall_7d_mm ? `${realtimeWeather.rainfall_7d_mm.toFixed(2)} mm` : '__'}
                </span>
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
              <Button variant="glass" className="w-full hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
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
              <h4 className="text-sm font-medium text-foreground mb-2">Sync Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-foreground/60">
                  Connected to {realtimeWeather?.active_sensors || "__"} sensors
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-foreground/60">
                  Last update: {realtimeWeather?.last_update || "__"}
                </span>
              </div>
              {realtimeWeather && (
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-xs text-foreground/60">Location: {realtimeWeather.location}</span>
                </div>
              )}
              {realtimeWeather && realtimeWeather.area_acres && (
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs text-foreground/60">Area: {realtimeWeather.area_acres} acres</span>
                </div>
              )}
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
                <span className="text-sm font-medium">{realtimeWeather?.vertices || "__"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Triangles</span>
                <span className="text-sm font-medium">{realtimeWeather?.triangles || "__"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Resolution</span>
                <span className="text-sm font-medium">{realtimeWeather?.resolution || "__"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Last Update</span>
                <span className="text-sm font-medium">{realtimeWeather?.last_update || "__"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h4 className="text-sm font-medium text-foreground mb-2">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Render Time</span>
                  <span className="text-primary">{realtimeWeather?.render_time || "__"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">Memory Usage</span>
                  <span className="text-secondary">{realtimeWeather?.memory_usage || "__"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/60">GPU Load</span>
                  <span className="text-primary">{realtimeWeather?.gpu_load || "__"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
