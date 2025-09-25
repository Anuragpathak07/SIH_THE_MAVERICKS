import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  AlertTriangle,
  TrendingUp,
  Shield,
  Brain,
  Zap,
  Bell,
  CheckCircle,
  AlertCircle,
  Mountain,
  TrendingDown,
  ArrowRight
} from "lucide-react";
import { useDashboard } from "../Dashboard";

export const OverviewTab = () => {
  const { rockfallNotifications } = useDashboard();

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getRockSizeColor = (rockSize) => {
    switch (rockSize?.toLowerCase()) {
      case 'small': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'medium': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'large': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  const getTrajectoryColor = (trajectory) => {
    switch (trajectory?.toLowerCase()) {
      case 'stable': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'unstable': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-muted/50 text-muted-foreground border-border';
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-foreground/60">Real-time mining safety monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Safety Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">98.7%</div>
            <p className="text-xs text-foreground/60 mt-1">+2.1% from last week</p>
            <Progress value={98.7} className="mt-3 h-2 bg-neutral-200" />
          </CardContent>
        </Card>

        <Card className="glass-card border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-600" />
              Active Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">247</div>
            <p className="text-xs text-foreground/60 mt-1">of 252 total sensors</p>
            <Progress value={98} className="mt-3 h-2 bg-neutral-200" />
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <Brain className="h-4 w-4 mr-2 text-primary" />
              AI Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">99.3%</div>
            <p className="text-xs text-foreground/60 mt-1">Real-time predictions</p>
            <Progress value={99.3} className="mt-3 h-2 bg-neutral-200" />
          </CardContent>
        </Card>

        <Card className="glass-card border-border/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">Low</div>
            <p className="text-xs text-foreground/60 mt-1">Stable conditions</p>
            <Progress value={15} className="mt-3 h-2 bg-neutral-200" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Alerts */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Live Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rockfall Alerts */}
              {(rockfallNotifications.riskLevel || rockfallNotifications.rockSize || rockfallNotifications.trajectory || rockfallNotifications.recommendations.length > 0) && (
                <>
                  {/* Risk Level Alert */}
                  {rockfallNotifications.riskLevel && (
                    <div className={`flex items-center space-x-4 p-4 rounded-2xl border ${getRiskLevelColor(rockfallNotifications.riskLevel)}`}>
                      <div className={`p-2 rounded-full ${rockfallNotifications.riskLevel.toLowerCase() === 'critical' ? 'bg-red-100' : rockfallNotifications.riskLevel.toLowerCase() === 'high' ? 'bg-orange-100' : rockfallNotifications.riskLevel.toLowerCase() === 'medium' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                        <Shield className={`h-4 w-4 ${rockfallNotifications.riskLevel.toLowerCase() === 'critical' ? 'text-red-600' : rockfallNotifications.riskLevel.toLowerCase() === 'high' ? 'text-orange-600' : rockfallNotifications.riskLevel.toLowerCase() === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Rockfall Risk: {rockfallNotifications.riskLevel}</h4>
                        <p className="text-sm opacity-80">Live camera analysis detected {rockfallNotifications.riskLevel.toLowerCase()} risk level</p>
                      </div>
                      <Badge variant="outline" className="border-current">
                        Live
                      </Badge>
                    </div>
                  )}

                  {/* Rock Size Alert */}
                  {rockfallNotifications.rockSize && (
                    <div className={`flex items-center space-x-4 p-4 rounded-2xl border ${getRockSizeColor(rockfallNotifications.rockSize)}`}>
                      <div className={`p-2 rounded-full ${rockfallNotifications.rockSize.toLowerCase() === 'large' ? 'bg-red-100' : rockfallNotifications.rockSize.toLowerCase() === 'medium' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                        <Mountain className={`h-4 w-4 ${rockfallNotifications.rockSize.toLowerCase() === 'large' ? 'text-red-600' : rockfallNotifications.rockSize.toLowerCase() === 'medium' ? 'text-purple-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Rock Size: {rockfallNotifications.rockSize}</h4>
                        <p className="text-sm opacity-80">Detected {rockfallNotifications.rockSize.toLowerCase()} rock formation</p>
                      </div>
                      <Badge variant="outline" className="border-current">
                        Active
                      </Badge>
                    </div>
                  )}

                  {/* Trajectory Alert */}
                  {rockfallNotifications.trajectory && (
                    <div className={`flex items-center space-x-4 p-4 rounded-2xl border ${getTrajectoryColor(rockfallNotifications.trajectory)}`}>
                      <div className={`p-2 rounded-full ${rockfallNotifications.trajectory.toLowerCase() === 'unstable' ? 'bg-red-100' : rockfallNotifications.trajectory.toLowerCase() === 'moderate' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                        <TrendingDown className={`h-4 w-4 ${rockfallNotifications.trajectory.toLowerCase() === 'unstable' ? 'text-red-600' : rockfallNotifications.trajectory.toLowerCase() === 'moderate' ? 'text-yellow-600' : 'text-green-600'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Trajectory: {rockfallNotifications.trajectory}</h4>
                        <p className="text-sm opacity-80">Current slope stability assessment</p>
                      </div>
                      <Badge variant="outline" className="border-current">
                        Monitoring
                      </Badge>
                    </div>
                  )}

                  {/* Recommendations Alert */}
                  {rockfallNotifications.recommendations.length > 0 && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-700">Active Recommendations</h4>
                          <div className="mt-2 space-y-1">
                            {rockfallNotifications.recommendations.slice(0, 3).map((rec, index) => (
                              <p key={index} className="text-sm text-blue-600 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{rec}</span>
                              </p>
                            ))}
                            {rockfallNotifications.recommendations.length > 3 && (
                              <p className="text-sm text-blue-500 mt-1">
                                +{rockfallNotifications.recommendations.length - 3} more recommendations
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          {rockfallNotifications.recommendations.length} items
                        </Badge>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Default System Alerts when no rockfall data */}
              {!rockfallNotifications.riskLevel && !rockfallNotifications.rockSize && !rockfallNotifications.trajectory && rockfallNotifications.recommendations.length === 0 && (
                <>
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-green-50 border border-green-200">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-700">Sensor Calibration Complete</h4>
                      <p className="text-sm text-green-600/80">Section A-7 sensors successfully calibrated</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      2 min ago
                    </Badge>
                  </div> 
                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">PINN Model Update</h4>
                      <p className="text-sm text-foreground/60">Physics-informed neural network updated with new data</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/30">
                      5 min ago
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="p-2 rounded-full bg-yellow-500/20">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Maintenance Scheduled</h4>
                      <p className="text-sm text-foreground/60">Routine inspection scheduled for tomorrow</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                      1 hour ago
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="hero" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                View Live Feed
              </Button>
              
              <Button variant="glass" className="w-full justify-start">
                <Brain className="h-4 w-4 mr-2" />
                Run PINN Analysis
              </Button>
              
              <Button variant="glass" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              
              <Button variant="glass" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Safety Assessment
              </Button>

              {/* Status Indicators */}
   <div className="pt-4 space-y-3 border-t border-border/20">
  {/* Data Processing */}
  <div className="flex items-center justify-between text-sm">
    <span className="text-green-600">Data Processing</span>
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-green-600 font-medium">Active</span>
    </div>
  </div>

  {/* Model Training */}
  <div className="flex items-center justify-between text-sm">
    <span className="text-blue-600">Model Training</span>
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      <span className="text-blue-600 font-medium">Running</span>
    </div>
  </div>

  {/* Alert System */}
  <div className="flex items-center justify-between text-sm">
    <span className="text-green-600">Alert System</span>
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-green-600 font-medium">Online</span>
    </div>
  </div>
</div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};