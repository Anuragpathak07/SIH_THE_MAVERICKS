import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, TrendingDown, Activity, MapPin, Clock } from "lucide-react";

export const RiskAssessmentTab = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Assessment</h1>
          <p className="text-foreground/60">Comprehensive safety evaluation and risk management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-secondary border-secondary/30">
            <Shield className="h-3 w-3 mr-1" />
            Overall Risk: Low
          </Badge>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-secondary" />
              Overall Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">Safe</div>
<Progress 
  value={88} 
  className="mt-2 h-3 bg-neutral-200" 
/>

<p className="text-xs text-black/60 mt-2">88% safety confidence</p>
</CardContent>
</Card>


        <Card className="glass-card border-yellow-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              Medium Risk Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">3</div>
            <Progress value={35} className="mt-2 h-3 bg-neutral-200" />
            <p className="text-xs text-foreground/60 mt-2">Require monitoring</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-primary" />
              Risk Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">-12%</div>
            <Progress value={12} className="mt-2 h-3 bg-neutral-200" />
            <p className="text-xs text-foreground/60 mt-2">Decreasing this week</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-secondary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-secondary" />
              Active Protocols
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">7</div>
            <Progress value={100} className="mt-2 h-3 bg-neutral-200" />
            <p className="text-xs text-foreground/60 mt-2">All systems active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Map */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Mine Risk Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-background/50 to-background/30 rounded-xl p-6 relative overflow-hidden">
                {/* Mine Layout Visualization */}
                <div className="relative w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                  {/* Risk Zones */}
                  <div className="absolute top-6 left-6 space-y-2">
  <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
    {/* Green dot */}
    <div className="w-3 h-3 bg-green-500 rounded-full" />
    <span className="text-xs font-medium">Low Risk</span>
  </div>


                    <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-xs font-medium">Medium Risk</span>
                    </div>
                    <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs font-medium">High Risk</span>
                    </div>
                  </div>

                  {/* Risk Indicators */}
                  <div className="absolute top-1/4 right-1/3 p-2 glass-card rounded-full neon-glow-emerald">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="absolute bottom-1/3 left-1/4 p-2 glass-card rounded-full">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="absolute top-1/2 right-1/4 p-2 glass-card rounded-full">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                  </div>

                  {/* Central Information */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center glass-card p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Goldmine Operations</h3>
                      <p className="text-sm text-foreground/60">Real-time risk assessment</p>
                      <Badge className="mt-2 bg-secondary/20 text-secondary">All Clear</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Details */}
        <div>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Categories */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Risk Categories</h4>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Slope Stability</span>
                      <Badge className="bg-green-500/20 text-green-500">Low</Badge>
                    </div>
                    <Progress value={85} className="h-2 bg-neutral-200" />
                    <p className="text-xs text-foreground/60 mt-1">Stable conditions detected</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Weather Impact</span>
                      <Badge className="bg-yellow-500/20 text-yellow-500">Medium</Badge>
                    </div>
                    <Progress value={45} className="h-2 bg-neutral-200" />
                    <p className="text-xs text-foreground/60 mt-1">Rainfall expected this week</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Equipment Safety</span>
                      <Badge className="bg-green-500/20 text-green-500">Low</Badge>
                    </div>
                    <Progress value={92} className="h-2 bg-neutral-200" />
                    <p className="text-xs text-foreground/60 mt-1">All systems operational</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Ground Movement</span>
                      <Badge className="bg-yellow-500/20 text-yellow-500">Medium</Badge>
                    </div>
                    <Progress value={38} className="h-2 bg-neutral-200" />
                    <p className="text-xs text-foreground/60 mt-1">Minor shifts in sector C</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="pt-4 border-t border-border/20">
                <h4 className="font-medium text-foreground mb-3">Recommendations</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-foreground">Increase monitoring in sector C</p>
                    <p className="text-xs text-foreground/60 mt-1">Due to recent ground movement</p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                    <p className="text-sm font-medium text-foreground">Weather monitoring active</p>
                    <p className="text-xs text-foreground/60 mt-1">Rainfall alerts configured</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-border/20">
                <Button variant="hero" className="w-full mb-3">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate Safety Report
                </Button>
                <Button variant="glass" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};