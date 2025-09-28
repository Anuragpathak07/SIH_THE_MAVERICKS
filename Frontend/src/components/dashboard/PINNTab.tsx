import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Activity, TrendingUp, Zap, Play, Download, MapPin, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useDashboard } from "../Dashboard";

const mineData = [
  { id: 1, name: "Bailadila Iron Ore Mine, Iron Ore, Chhattisgarh", latitude: 18.7100, longitude: 81.0500 },
  { id: 2, name: "Dalli-Rajhara Mine, Iron Ore, Chhattisgarh", latitude: 20.5610, longitude: 81.0700 },
  { id: 3, name: "Gokul Open Pit Mine, Manganese, Maharashtra (Nagpur)", latitude: 20.6697, longitude: 79.2964 },
  { id: 4, name: "Hutti Gold Mine, Gold, Karnataka", latitude: 16.1972, longitude: 76.6602 },
  { id: 5, name: "Jaduguda Mine, Uranium, Jharkhand", latitude: 22.6500, longitude: 86.3500 },
  { id: 6, name: "Jharia Coal Mine, Coal, Jharkhand", latitude: 23.7406, longitude: 86.4146 },
  { id: 7, name: "Khetri Copper Mine, Copper, Rajasthan", latitude: 27.9833, longitude: 75.7833 },
  { id: 8, name: "Korba Coal Mine, Coal, Chhattisgarh", latitude: 22.3545, longitude: 82.6872 },
  { id: 9, name: "Majri Mine, Coal, Maharashtra", latitude: 20.0681, longitude: 79.3583 },
  { id: 10, name: "Neemuch Cement Mine, Limestone, Madhya Pradesh", latitude: 24.4766, longitude: 74.8726 },
];

export const PINNTab = () => {
  const { selectedLocation, realtimeWeather, setRealtimeWeather } = useDashboard();
  
  const [params, setParams] = useState({
    height: 45,
    cohesion: 25,
    friction_angle: 32,
    unit_weight: 22,
    slope_angle: 38,
    water_depth_ratio: 0.15,
    rainfall_mm_7d: 120,
    temperature_c: 28,
    vibrations_ms2: 0.8,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isUpdatingWeather, setIsUpdatingWeather] = useState(false);

  const onChange = (key: keyof typeof params) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setParams((p) => ({ ...p, [key]: value }));
  };

  const updateWeatherData = async () => {
    if (!selectedLocation) return;
    
    const mine = mineData.find(m => m.id.toString() === selectedLocation);
    if (!mine) return;

    setIsUpdatingWeather(true);
    try {
      const url = new URL('http://localhost:8000/realtimedata');
      url.searchParams.append('lat', mine.latitude.toString());
      url.searchParams.append('lon', mine.longitude.toString());
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      
      setRealtimeWeather(data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setIsUpdatingWeather(false);
    }
  };

  // Auto-update weather data when location changes
  useEffect(() => {
    if (selectedLocation) {
      updateWeatherData();
    }
  }, [selectedLocation]);

  const runAnalysis = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:8000/pinn/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback demo result if backend not ready
      setResult({
        success: true,
        metrics: {
          accuracy: 98.9,
          confidence: 97.4,
          loss: 0.0021,
          speedMs: 2.3,
        },
        message: 'Demo results (backend not connected)'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Derived UI from backend result
  const riskLabel: string | undefined = result?.risk?.label;
  const riskProbPct: number = Math.round((result?.risk?.probability ?? 0) * 100);
  const slopeBadge = riskLabel === 'Low' ? 'Stable' : riskLabel === 'Medium' ? 'Monitor' : riskLabel === 'High' ? 'Unstable' : riskLabel === 'Critical' ? 'Critical' : 'Unknown';
  const slopeProgress = riskProbPct || 92;
  const slopeSubtitle = `${slopeProgress}% confidence - ${slopeBadge === 'Stable' ? 'No immediate risk detected' : slopeBadge === 'Monitor' ? 'Increase monitoring advised' : slopeBadge === 'Unstable' ? 'Instability likely' : slopeBadge === 'Critical' ? 'Immediate action required' : 'Awaiting analysis'}`;

  // Optional risk distribution rendering (e.g., { Low: p, Medium: p, ... })
  const distribution: Record<string, number> | undefined = result?.risk?.distribution;
  const sortedDistribution = distribution
    ? Object.entries(distribution)
        .map(([k, v]) => [k, typeof v === 'number' ? v : Number(v)] as [string, number])
        .sort((a, b) => b[1] - a[1])
    : [];

  const fmt = (n: number | undefined, digits: number = 1) =>
    typeof n === 'number' && isFinite(n) ? n.toFixed(digits) : '—';

  const stressBadge = riskLabel && (riskLabel === 'Low' ? 'Normal' : 'Elevated');
  const stressProgress = riskLabel === 'Low' ? 78 : 88;
  const stressSubtitle = `${stressProgress}% within ${riskLabel === 'Low' ? 'safe' : 'elevated'} parameters`;

  const movementBadge = riskLabel === 'Low' ? 'Normal' : riskLabel === 'Medium' ? 'Monitor' : 'High';
  const movementProgress = riskLabel === 'Low' ? 34 : riskLabel === 'Medium' ? 60 : 85;
  const movementSubtitle = movementBadge === 'Normal' ? 'Minor displacement' : movementBadge === 'Monitor' ? 'Noticeable movement detected' : 'Severe movement detected';

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">PINN Results</h1>
          <p className="text-foreground/60 mt-1">Physics-Informed Neural Network Analysis</p>
        </div>
        <div className="flex gap-3">
          <Button variant="hero" onClick={runAnalysis} disabled={isRunning} className="px-6">
            <Play className="h-4 w-4 mr-2" /> {isRunning ? 'Running...' : 'Run Analysis'}
          </Button>
          <Button variant="outline" disabled={!result} className="px-6">
            <Download className="h-4 w-4 mr-2" /> Export Results
          </Button>
        </div>
      </div>

      {/* Input Parameters Grid */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Geological Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm font-medium">Height (m)</Label>
              <Input 
                id="height" 
                type="number" 
                step="0.1" 
                value={params.height}
                onChange={onChange('height')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cohesion" className="text-sm font-medium">Cohesion (kPa)</Label>
              <Input 
                id="cohesion" 
                type="number" 
                step="0.1" 
                value={params.cohesion}
                onChange={onChange('cohesion')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="friction_angle" className="text-sm font-medium">Friction Angle (°)</Label>
              <Input 
                id="friction_angle" 
                type="number" 
                step="0.1" 
                value={params.friction_angle}
                onChange={onChange('friction_angle')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_weight" className="text-sm font-medium">Unit Weight (kN/m³)</Label>
              <Input 
                id="unit_weight" 
                type="number" 
                step="0.1" 
                value={params.unit_weight}
                onChange={onChange('unit_weight')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slope_angle" className="text-sm font-medium">Slope Angle (°)</Label>
              <Input 
                id="slope_angle" 
                type="number" 
                step="0.1" 
                value={params.slope_angle}
                onChange={onChange('slope_angle')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="water_depth_ratio" className="text-sm font-medium">Water Depth Ratio</Label>
              <Input 
                id="water_depth_ratio" 
                type="number" 
                step="0.01" 
                value={params.water_depth_ratio}
                onChange={onChange('water_depth_ratio')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rainfall_mm_7d" className="text-sm font-medium">Rainfall (7d, mm)</Label>
              <Input 
                id="rainfall_mm_7d" 
                type="number" 
                step="1" 
                value={params.rainfall_mm_7d}
                onChange={onChange('rainfall_mm_7d')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature_c" className="text-sm font-medium">Temperature (°C)</Label>
              <Input 
                id="temperature_c" 
                type="number" 
                step="0.1" 
                value={params.temperature_c}
                onChange={onChange('temperature_c')}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vibrations_ms2" className="text-sm font-medium">Vibrations (m/s²)</Label>
              <Input 
                id="vibrations_ms2" 
                type="number" 
                step="0.01" 
                value={params.vibrations_ms2}
                onChange={onChange('vibrations_ms2')}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Performance Cards (dynamic from backend metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <Brain className="h-4 w-4 mr-2 text-primary" />
              Model Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">{fmt(result?.metrics?.accuracy)}</div>
            <Progress value={Number(result?.metrics?.accuracy ?? 0)} className="h-2 bg-neutral-200" />
            <p className="text-xs text-foreground/60">{result?.message ?? 'Validation accuracy on test set'}</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-secondary" />
              Processing Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-secondary">{fmt(result?.metrics?.speedMs, 2)}ms</div>
            <Progress value={85} className="h-2 bg-neutral-200" />
            <p className="text-xs text-foreground/60">Average inference time</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Confidence Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-primary">{fmt(result?.metrics?.confidence)}</div>
            <Progress value={Number(result?.metrics?.confidence ?? 0)} className="h-2 bg-neutral-200" />
            <p className="text-xs text-foreground/60">Current prediction confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Physics Model Visualization */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Physics Model Simulation
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={updateWeatherData}
                  disabled={isUpdatingWeather || !selectedLocation}
                  className="h-8 px-3"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isUpdatingWeather ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline ml-1">Update Data</span>
                </Button>
                <Badge variant="outline" className="text-primary border-primary/30">
                  Live
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
              {/* Simulation Placeholder */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/30 animate-pulse mx-auto" />
                <h3 className="text-xl font-semibold text-foreground">Neural Network Active</h3>
                <p className="text-sm text-foreground/60">Processing geological data...</p>
              </div>
              
              {/* Animated Data Points */}
              <div className="absolute top-6 left-6 space-y-3">
                <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Stress Analysis</span>
                </div>
                <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Stability Prediction</span>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Height (m):</span>
                <span className="text-secondary font-medium">{params.height}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Cohesion (kPa):</span>
                <span className="text-secondary font-medium">{params.cohesion}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Friction Angle (°):</span>
                <span className="text-secondary font-medium">{params.friction_angle}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Unit Weight (kN/m³):</span>
                <span className="text-secondary font-medium">{params.unit_weight}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Slope Angle (°):</span>
                <span className="text-secondary font-medium">{params.slope_angle}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Water Depth Ratio:</span>
                <span className="text-secondary font-medium">{params.water_depth_ratio}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Temperature (°C):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.temperature_C?.toFixed(1) || params.temperature_c}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Humidity (%):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.humidity_percent?.toFixed(1) || '--'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Pressure (hPa):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.pressure_hPa?.toFixed(1) || '--'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Wind Speed (m/s):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.windspeed_m_s?.toFixed(1) || '--'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Wind Direction (°):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.winddirection_deg || '--'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Rainfall (7d, mm):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.rainfall_7d_mm?.toFixed(1) || params.rainfall_mm_7d}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                <span className="text-foreground/60">Vibration (mm/s):</span>
                <span className="text-secondary font-medium">{realtimeWeather?.vibration_mm_s?.toFixed(1) || params.vibrations_ms2}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Analysis */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prediction Results */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-foreground">Slope Stability</h4>
                  <Badge className="bg-secondary/20 text-secondary px-3 py-1">{slopeBadge}</Badge>
                </div>
                <Progress value={slopeProgress} className="h-3 mb-3 bg-neutral-200" />
                <p className="text-sm text-foreground/60 mb-4">{slopeSubtitle}</p>
                {sortedDistribution.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground/80 mb-2">Confidence Breakdown:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {sortedDistribution.map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center p-2 rounded-lg bg-background/50">
                          <span className="text-sm text-foreground/70">{k}</span>
                          <span className="text-sm font-medium text-foreground">{Math.round(v * 10000) / 100}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-foreground">Stress Distribution</h4>
                  <Badge className="bg-primary/20 text-primary px-3 py-1">{stressBadge}</Badge>
                </div>
                <Progress value={stressProgress} className="h-3 mb-3 bg-neutral-200" />
                <p className="text-sm text-foreground/60">{stressSubtitle}</p>
              </div>

              <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-foreground">Ground Movement</h4>
                  <Badge className="bg-yellow-500/20 text-yellow-500 px-3 py-1">{movementBadge}</Badge>
                </div>
                <Progress value={movementProgress} className="h-3 mb-3 bg-neutral-200" />
                <p className="text-sm text-foreground/60">{movementSubtitle}</p>
              </div>
            </div>

            {/* Model Parameters */}
            <div className="pt-6 border-t border-border/20">
              <h4 className="text-lg font-semibold text-foreground mb-4">Model Parameters</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Learning Rate:</span>
                  <span className="text-sm font-medium text-foreground">0.001</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Batch Size:</span>
                  <span className="text-sm font-medium text-foreground">64</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Hidden Layers:</span>
                  <span className="text-sm font-medium text-foreground">8</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                  <span className="text-sm text-foreground/60">Neurons:</span>
                  <span className="text-sm font-medium text-foreground">256</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};