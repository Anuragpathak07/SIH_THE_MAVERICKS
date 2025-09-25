import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Thermometer, Volume2, Zap } from "lucide-react";

// Sample data for different sensors
const generateSensorData = (type: string) => {
  const baseData = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00` }));
  
  switch (type) {
    case 'temperature':
      return baseData.map((item, i) => ({
        ...item,
        value: 18 + Math.sin(i * 0.3) * 5 + Math.random() * 2,
        threshold: 30
      }));
    case 'co2':
      return baseData.map((item, i) => ({
        ...item,
        value: 400 + Math.sin(i * 0.2) * 100 + Math.random() * 50,
        threshold: 800
      }));
    case 'noise':
      return baseData.map((item, i) => ({
        ...item,
        value: 65 + Math.sin(i * 0.4) * 15 + Math.random() * 10,
        threshold: 85
      }));
    case 'vibration':
      return baseData.map((item, i) => ({
        ...item,
        value: 2 + Math.sin(i * 0.5) * 1.5 + Math.random() * 0.5,
        threshold: 5
      }));
    default:
      return baseData.map((item, i) => ({
        ...item,
        value: Math.random() * 100,
        threshold: 80
      }));
  }
};

const sensorConfigs = {
  temperature: {
    name: 'Temperature',
    unit: '°C',
    icon: Thermometer,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E8E']
  },
  co2: {
    name: 'CO₂ Levels',
    unit: 'ppm',
    icon: Activity,
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#6ED5CD']
  },
  noise: {
    name: 'Noise Level',
    unit: 'dB',
    icon: Volume2,
    color: '#45B7D1',
    gradient: ['#45B7D1', '#6BC5D9']
  },
  vibration: {
    name: 'Vibration',
    unit: 'mm/s',
    icon: Zap,
    color: '#FFA726',
    gradient: ['#FFA726', '#FFB74D']
  }
};

export const GraphicalDataPanel = () => {
  const [selectedSensor, setSelectedSensor] = useState<string>('temperature');
  const [timeRange, setTimeRange] = useState<string>('24h');
  
  const currentData = generateSensorData(selectedSensor);
  const config = sensorConfigs[selectedSensor as keyof typeof sensorConfigs];
  const Icon = config.icon;
  
  const currentValue = currentData[currentData.length - 1]?.value || 0;
  const previousValue = currentData[currentData.length - 2]?.value || 0;
  const trend = currentValue > previousValue ? 'up' : 'down';
  const trendPercent = Math.abs(((currentValue - previousValue) / previousValue) * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Graphical Data Analysis</h1>
          <p className="text-foreground/60 text-sm sm:text-base">Interactive sensor data visualization and trends</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Select value={selectedSensor} onValueChange={setSelectedSensor}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select sensor" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sensorConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className="h-4 w-4" />
                    {config.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last 1h</SelectItem>
              <SelectItem value="6h">Last 6h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="glass-card border-border/20">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 neon-glow-aqua">
                <Icon className="h-5 w-5" style={{ color: config.color }} />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">{config.name} Trends</CardTitle>
                <p className="text-sm text-foreground/60">Real-time monitoring over {timeRange}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold" style={{ color: config.color }}>
                  {currentValue.toFixed(1)} {config.unit}
                </div>
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                  {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {trendPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id={`gradient-${selectedSensor}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={config.color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${selectedSensor})`}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(sensorConfigs).map(([key, sensorConfig]) => {
          const data = generateSensorData(key);
          const value = data[data.length - 1]?.value || 0;
          const SensorIcon = sensorConfig.icon;
          
          return (
            <Card 
              key={key} 
              className={`glass-card border-border/20 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedSensor === key ? 'ring-2 ring-primary/50 neon-glow-aqua' : ''
              }`}
              onClick={() => setSelectedSensor(key)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60">{sensorConfig.name}</p>
                    <p className="text-xl sm:text-2xl font-bold" style={{ color: sensorConfig.color }}>
                      {value.toFixed(1)} {sensorConfig.unit}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                    <SensorIcon className="h-5 w-5" style={{ color: sensorConfig.color }} />
                  </div>
                </div>
                
                <div className="mt-4 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.slice(-8)}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={sensorConfig.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};