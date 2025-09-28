import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Camera, Settings, Video, VideoOff } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDashboard } from "../Dashboard";

export const LiveMonitoringTab = () => {
  const { monitoringData, setMonitoringData } = useDashboard();
  const [streamSrc, setStreamSrc] = useState<string>("");
  const [isRockfallCameraActive, setIsRockfallCameraActive] = useState(false);
  const [userCameraStream, setUserCameraStream] = useState<MediaStream | null>(null);
  const [laptopCameraStream, setLaptopCameraStream] = useState<MediaStream | null>(null);
  const [isLaptopCameraActive, setIsLaptopCameraActive] = useState(false);
  const [showCameraConfig, setShowCameraConfig] = useState(false);
  const [cameras, setCameras] = useState([
    { id: 1, name: "Camera 15 - North Face", location: "North Face", color: "blue", active: true },
    { id: 2, name: "Camera 23 - East Wall", location: "East Wall", color: "blue", active: true },
    { id: 3, name: "Camera 31 - South Pit", location: "South Pit", color: "blue", active: true },
    { id: 4, name: "Camera 42 - West Ridge", location: "West Ridge", color: "blue", active: true },
    { id: 5, name: "Camera 56 - Central Hub", location: "Central Hub", color: "blue", active: true }
  ]);
  const [newCameraName, setNewCameraName] = useState("");
  const [newCameraLocation, setNewCameraLocation] = useState("");
  const [newCameraColor, setNewCameraColor] = useState("blue");
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const laptopVideoRef = useRef<HTMLVideoElement>(null);

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
      
      // If camera is active and stream is provided, use it for user face display
      if (event.detail.active && event.detail.stream) {
        setUserCameraStream(event.detail.stream);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = event.detail.stream;
        }
      } else {
        // Clean up stream when camera is stopped
        if (userCameraStream) {
          userCameraStream.getTracks().forEach(track => track.stop());
        }
        setUserCameraStream(null);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = null;
        }
      }
    };

    window.addEventListener('rockfallCameraToggle', handleRockfallCameraToggle);
    
    return () => {
      window.removeEventListener('rockfallCameraToggle', handleRockfallCameraToggle);
      // Clean up stream on unmount
      if (userCameraStream) {
        userCameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [monitoringData, setMonitoringData, userCameraStream]);

  // Laptop camera functions
  const toggleLaptopCamera = async () => {
    if (isLaptopCameraActive) {
      // Stop camera
      if (laptopCameraStream) {
        laptopCameraStream.getTracks().forEach(track => track.stop());
      }
      setLaptopCameraStream(null);
      setIsLaptopCameraActive(false);
      if (laptopVideoRef.current) {
        laptopVideoRef.current.srcObject = null;
      }
    } else {
      // Start camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLaptopCameraStream(stream);
        setIsLaptopCameraActive(true);
        if (laptopVideoRef.current) {
          laptopVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check permissions.');
      }
    }
  };

  // Cleanup laptop camera on unmount
  useEffect(() => {
    return () => {
      if (laptopCameraStream) {
        laptopCameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [laptopCameraStream]);
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Monitoring</h1>
          <p className="text-foreground/60">Real-time camera feeds and monitoring</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={isLaptopCameraActive ? "secondary" : "outline"} 
            onClick={toggleLaptopCamera}
            className="flex items-center space-x-2"
          >
            {isLaptopCameraActive ? (
              <>
                <VideoOff className="h-4 w-4" />
                <span>Turn Off Camera</span>
              </>
            ) : (
              <>
                <Video className="h-4 w-4" />
                <span>Turn On Camera</span>
              </>
            )}
          </Button>
          <Button
            variant="outline" 
            onClick={() => setShowCameraConfig(!showCameraConfig)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Configure Camera</span>
          </Button>
        </div>
      </div>

      {/* Camera Configuration Panel */}
      {showCameraConfig && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Camera Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera Settings */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Camera Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Resolution</label>
                  <select className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground">
                    <option>1920x1080 (Full HD)</option>
                    <option>1280x720 (HD)</option>
                    <option>640x480 (SD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Frame Rate</label>
                  <select className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground">
                    <option>30 FPS</option>
                    <option>25 FPS</option>
                    <option>15 FPS</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Exposure</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="50" 
                    className="w-full" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Brightness</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="50" 
                    className="w-full" 
                  />
                </div>
              </div>
            </div>

            {/* Add New Camera */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Add New Camera</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Camera Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Camera 67 - Overview"
                    value={newCameraName}
                    onChange={(e) => setNewCameraName(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <select 
                    value={newCameraLocation}
                    onChange={(e) => setNewCameraLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground z-10"
                  >
                    <option value="">Select Location</option>
                    <option value="North Face">North Face</option>
                    <option value="East Wall">East Wall</option>
                    <option value="South Pit">South Pit</option>
                    <option value="West Ridge">West Ridge</option>
                    <option value="Central Hub">Central Hub</option>
                    <option value="Overview Point">Overview Point</option>
                    <option value="Main Entrance">Main Entrance</option>
                    <option value="Processing Area">Processing Area</option>
                    <option value="Storage Zone">Storage Zone</option>
                    <option value="Equipment Bay">Equipment Bay</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Camera Color</label>
                  <select 
                    value={newCameraColor}
                    onChange={(e) => setNewCameraColor(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="red">Red</option>
                  </select>
                </div>
              </div>
              <Button 
                onClick={() => {
                  if (newCameraName && newCameraLocation) {
                    const newCamera = {
                      id: Date.now(),
                      name: newCameraName,
                      location: newCameraLocation,
                      color: newCameraColor,
                      active: true
                    };
                    setCameras([...cameras, newCamera]);
                    setNewCameraName("");
                    setNewCameraLocation("");
                    setNewCameraColor("blue");
                  }
                }}
                className="mt-4"
                disabled={!newCameraName || !newCameraLocation}
              >
                Add Camera
              </Button>
            </div>

            {/* Manage Existing Cameras */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Manage Cameras</h3>
              <div className="space-y-2">
                {cameras.map((camera) => (
                  <div key={camera.id} className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${camera.color}-500`}></div>
                      <div>
                        <p className="font-medium text-foreground">{camera.name}</p>
                        <p className="text-sm text-foreground/60">{camera.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={camera.active ? "default" : "secondary"}>
                        {camera.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCameras(cameras.filter(c => c.id !== camera.id));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm">Reset to Default</Button>
              <Button size="sm">Apply Settings</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Monitoring Grid */}
      <Card className="glass-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-secondary" />
            Live Camera Feeds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {/* Laptop Camera Feed - First position when active */}
            {isLaptopCameraActive && laptopCameraStream && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/30">
                <video
                  ref={laptopVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Badge */}
                <div className="absolute top-2 left-2 glass-card px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-primary">Laptop Camera</span>
                </div>

                {/* Status Dot */}
                <div className="absolute top-2 right-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                </div>

                {/* Live Indicator */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="glass-card px-2 py-1 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Live Camera Feed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Face Camera Feed - Shows when coming from Rockfall Detection */}
            {isRockfallCameraActive && userCameraStream && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/30">
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Badge */}
                <div className="absolute top-2 left-2 glass-card px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-primary">User Camera</span>
                </div>

                {/* Status Dot */}
                <div className="absolute top-2 right-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                </div>

                {/* AI Analysis Indicator */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="glass-card px-2 py-1 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400 font-medium">Live from Rockfall Detection</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Stream from Backend */}
            <div 
              className="relative aspect-video rounded-xl overflow-hidden border border-border/20 cursor-pointer hover:border-primary/50 transition-all"
              onClick={toggleLaptopCamera}
            >
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

            {/* Rockfall Detection Camera Feed */}
            {isRockfallCameraActive && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-red-500/30">
                <div className="w-full h-full bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera className="h-8 w-8 text-red-400 mx-auto animate-pulse" />
                    <p className="text-sm font-medium text-foreground">Rockfall AI Detection</p>
                    <p className="text-xs text-foreground/60">Live analysis • Frame prediction active</p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                      <span className="text-xs text-red-400 font-medium">AI Processing</span>
                    </div>
                  </div>
                </div>
                
                {/* Badge */}
                <div className="absolute top-2 left-2 glass-card px-2 py-1 rounded-lg">
                  <span className="text-xs font-medium text-red-400">Rockfall Detection</span>
                </div>

                {/* Status Dot */}
                <div className="absolute top-2 right-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Dynamic Camera Feeds */}
            {cameras.map((camera) => {
              const getColorClasses = (color) => {
                const colorMap = {
                  blue: { bg: "from-blue-500/10 to-cyan-500/10", text: "text-blue-400", badge: "bg-blue-500/20 text-blue-400", dot: "bg-blue-500" },
                  green: { bg: "from-green-500/10 to-emerald-500/10", text: "text-green-400", badge: "bg-green-500/20 text-green-400", dot: "bg-green-500" },
                  purple: { bg: "from-purple-500/10 to-violet-500/10", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-400", dot: "bg-purple-500" },
                  yellow: { bg: "from-yellow-500/10 to-amber-500/10", text: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-400", dot: "bg-yellow-500" },
                  pink: { bg: "from-pink-500/10 to-rose-500/10", text: "text-pink-400", badge: "bg-pink-500/20 text-pink-400", dot: "bg-pink-500" },
                  orange: { bg: "from-orange-500/10 to-red-500/10", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-400", dot: "bg-orange-500" },
                  cyan: { bg: "from-cyan-500/10 to-teal-500/10", text: "text-cyan-400", badge: "bg-cyan-500/20 text-cyan-400", dot: "bg-cyan-500" },
                  red: { bg: "from-red-500/10 to-pink-500/10", text: "text-red-400", badge: "bg-red-500/20 text-red-400", dot: "bg-red-500" }
                };
                return colorMap[color] || colorMap.blue;
              };

              const colors = getColorClasses(camera.color);

              return (
                <div 
                  key={camera.id} 
                  className="relative aspect-video rounded-xl overflow-hidden border border-border/20 cursor-pointer hover:border-primary/50 transition-all"
                  onClick={toggleLaptopCamera}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                    <div className="text-center">
                      <Activity className={`h-8 w-8 ${colors.text} mx-auto mb-2`} />
                      <p className="text-sm font-medium text-foreground">{camera.name}</p>
                      <Badge className={`mt-2 ${colors.badge}`}>
                        {camera.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 glass-card px-2 py-1 rounded-lg">
                    <span className={`text-xs font-medium ${colors.text}`}>{camera.location}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className={`w-2.5 h-2.5 ${colors.dot} rounded-full animate-pulse`} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


