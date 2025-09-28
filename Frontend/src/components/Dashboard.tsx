import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, MapPin } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { DashboardSidebar } from "./DashboardSidebar";
import { OverviewTab } from "./dashboard/OverviewTab";
import { PINNTab } from "./dashboard/PINNTab";
import { RockfallTab } from "./dashboard/RockfallTab.jsx";
import { DigitalTwinTab } from "./dashboard/DigitalTwinTab";
import { LiveMonitoringTab } from "./dashboard/LiveMonitoring";
import { Chatbot } from "./dashboard/Chatbot";
import { GraphicalDataPanel } from "./GraphicalDataPanel";

// Mine data for location selection
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

// Create Dashboard Context for React-based state management
const DashboardContext = createContext<{
  rockfallNotifications: any;
  setRockfallNotifications: (notifications: any) => void;
  liveData: any[];
  setLiveData: (data: any[]) => void;
  confidenceHistory: any[];
  setConfidenceHistory: (history: any[]) => void;
  pinnGraphs: any;
  setPinnGraphs: (graphs: any) => void;
  monitoringData: any;
  setMonitoringData: (data: any) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  realtimeWeather: any;
  setRealtimeWeather: (weather: any) => void;
  refreshAll: () => void;
} | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const Dashboard = ({ onBackToHome }: { onBackToHome?: () => void }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // React-based state management instead of localStorage
  const [rockfallNotifications, setRockfallNotifications] = useState({
    riskLevel: null,
    rockSize: null,  
    trajectory: null,
    recommendations: []
  });
  
  const [liveData, setLiveData] = useState([]);
  const [confidenceHistory, setConfidenceHistory] = useState([]);
  const [pinnGraphs, setPinnGraphs] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [realtimeWeather, setRealtimeWeather] = useState(null);

  // Refresh all notifications and data across all tabs
  const refreshAllNotifications = async () => {
    setIsRefreshing(true);
    
    // Reset all React state instead of localStorage
    setRockfallNotifications({
      riskLevel: null,
      rockSize: null,  
      trajectory: null,
      recommendations: []
    });
    setLiveData([]);
    setConfidenceHistory([]);
    setPinnGraphs(null);
    setMonitoringData(null);
    setSelectedLocation("");
    setRealtimeWeather(null);
    
    // Clear any remaining localStorage items
    localStorage.removeItem('rockfallNotifications');
    localStorage.removeItem('rockfallCameraActive');
    localStorage.removeItem('rockfallCameraStream');
    
    // Simulate refresh time
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const contextValue = {
    rockfallNotifications,
    setRockfallNotifications,
    liveData,
    setLiveData,
    confidenceHistory,
    setConfidenceHistory,
    pinnGraphs,
    setPinnGraphs,
    monitoringData,
    setMonitoringData,
    selectedLocation,
    setSelectedLocation,
    realtimeWeather,
    setRealtimeWeather,
    refreshAll: refreshAllNotifications
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "chatbot":
        return <Chatbot />;
      case "pinn":
        return <PINNTab />;
      case "rockfall":
        return <RockfallTab />;
      case "digital-twin":
        return <DigitalTwinTab />;
      case "monitoring":
        return <LiveMonitoringTab />;
      case "graphical":
        return <GraphicalDataPanel />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="flex h-screen bg-background">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
        {/* Header with theme toggle and logout */}
        <div className="glass-nav p-3 sm:p-4 border-b border-border/10 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-foreground/60" />
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-64 h-8 text-xs">
                    <SelectValue placeholder="Select Mine Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {mineData.map((mine) => (
                      <SelectItem key={mine.id} value={mine.id.toString()}>
                        {mine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshAllNotifications}
                disabled={isRefreshing}
                className="flex items-center space-x-1 sm:space-x-2 text-foreground/80 hover:text-primary border-primary/20"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
        
          <div className="p-3 sm:p-6">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
};