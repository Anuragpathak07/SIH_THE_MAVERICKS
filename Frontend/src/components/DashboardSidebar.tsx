import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  AlertTriangle,
  Brain,
  Box,
  Home,
  Settings,
  Shield,
  BarChart3,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "pinn", label: "PINN Results", icon: Brain },
  { id: "rockfall", label: "Rockfall Detection", icon: AlertTriangle },
  { id: "digital-twin", label: "Digital Twin", icon: Box },
  { id: "chatbot", label: "Chatbot", icon: BarChart3 },
  { id: "monitoring", label: "Live Monitoring", icon:  Eye  },
  { id: "graphical", label: "Graphical Data", icon: Activity },
];

export const DashboardSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative h-screen glass-card border-r border-border/20 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-3 sm:p-6 border-b border-border/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 neon-glow-aqua">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">MineGuard</h2>
                <p className="text-xs text-foreground/60">AI Dashboard</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full justify-start transition-all duration-200 h-10 sm:h-11",
                isActive ? "bg-primary/10 text-primary border border-primary/20 neon-glow-aqua" : "text-foreground/70 hover:text-foreground hover:bg-foreground/5",
                isCollapsed ? "px-2 sm:px-3" : "px-3 sm:px-4"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
              {!isCollapsed && (
                <span className="ml-2 sm:ml-3 text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Status Panel */}
      {!isCollapsed && (
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
          <div className="glass-card p-3 sm:p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">System Status</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">Sensors</span>
                <span className="text-foreground font-medium">98% Online</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">AI Models</span>
                <span className="text-foreground font-medium">Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">Risk Level</span>
                <span className="text-green-500 font-medium">Low</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Settings className="h-3 w-3 mr-2" />
              <span className="text-xs sm:text-sm">Settings</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};