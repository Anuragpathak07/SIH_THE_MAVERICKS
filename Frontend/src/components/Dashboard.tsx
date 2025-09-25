import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { DashboardSidebar } from "./DashboardSidebar";
import { OverviewTab } from "./dashboard/OverviewTab";
import { PINNTab } from "./dashboard/PINNTab";
import { RockfallTab } from "./dashboard/RockfallTab.jsx";
import { DigitalTwinTab } from "./dashboard/DigitalTwinTab";
import { LiveMonitoringTab } from "./dashboard/LiveMonitoring";
import { Chatbot } from "./dashboard/Chatbot";
import { GraphicalDataPanel } from "./GraphicalDataPanel";

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
        <div className="glass-nav p-3 sm:p-4 border-b border-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBackToHome}
                className="flex items-center space-x-1 sm:space-x-2 text-foreground/80 hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
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