import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useDashboard } from "../Dashboard";

export const LiveMonitoringTab = () => {
  const { monitoringData, setMonitoringData } = useDashboard();
  const [streamSrc, setStreamSrc] = useState<string>("");
  const [isRockfallCameraActive, setIsRockfallCameraActive] = useState(false);

  // Start stream on mount; stop on unmount to ensure camera turns off
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
    const url = `${backendUrl}/video_feed?detect=1&stride=2`;
    setStreamSrc(url);
    return () => {
      // Clearing src forces browser to close the MJPEG connection
      setStreamSrc("");
    };
  }, []);

  // Listen for rockfall camera status and stream
  useEffect(() => {
    // Listen for rockfall camera toggle events
    const handleRockfallCameraToggle = (event) => {
      setIsRockfallCameraActive(event.detail.active);
      setMonitoringData({ ...monitoringData, cameraActive: event.detail.active });
    };

    window.addEventListener('rockfallCameraToggle', handleRockfallCameraToggle);
    
    return () => {
      window.removeEventListener('rockfallCameraToggle', handleRockfallCameraToggle);
    };
  }, [monitoringData, setMonitoringData]);
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Monitoring</h1>
          <p className="text-foreground/60">Real-time camera feeds and monitoring</p>
        </div>
      </div>

      {/* Live Monitoring Grid */}
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-secondary" />
            Live Camera Feeds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rockfall Camera Feed - Shows when active */}
            {isRockfallCameraActive && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/30">
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 text-primary mx-auto animate-pulse" />
                    <p className="text-sm font-medium text-foreground">Rockfall Camera Active</p>
                    <p className="text-xs text-foreground/60">Live AI analysis • Frame prediction active</p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Recording & Analyzing</span>
                    </div>
                  </div>
                </div>
                
                {/* Badge */}
                <div className="absolute top-2 left-2 glass-card px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-primary">Rockfall Detection</span>
                </div>

                {/* Status Dot */}
                <div className="absolute top-2 right-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Live Stream from Backend */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border/20">
              <img
                src={streamSrc}
                alt="Live Camera Feed"
                className="w-full h-full object-cover"
              />

              {/* Badge */}
              <div className="absolute top-2 left-2 glass-card px-2 py-1 rounded-lg">
                <span className="text-xs font-medium text-foreground">Live (Local)</span>
              </div>

              {/* Status Dot */}
              <div className="absolute top-2 right-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse neon-glow-aqua" />
              </div>
            </div>


            {/* Placeholder streams to be wired later */}
            <div className="relative aspect-video bg-gradient-to-br from-background/50 to-background/30 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Camera 15 - North Face</p>
                  <Badge className="mt-2 bg-secondary/20 text-secondary">Active</Badge>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-gradient-to-br from-background/50 to-background/30 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Camera 23 - East Wall</p>
                  <Badge className="mt-2 bg-secondary/20 text-secondary">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


