/**
 * Advanced Real-Time Telemetry Dashboard
 * Professional mission-control style data visualization
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Radio, Zap, Gauge, Thermometer, Wind, Droplets } from 'lucide-react';

interface TelemetryPoint {
  timestamp: number;
  altitude: number;
  velocity: number;
  temperature: number;
  pressure: number;
  radiation: number;
  signalStrength: number;
}

interface SystemStatus {
  name: string;
  status: 'nominal' | 'warning' | 'critical';
  value: number;
  unit: string;
  icon: React.ReactNode;
}

const AdvancedTelemetryDashboard: React.FC = () => {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'altitude' | 'velocity' | 'temperature'>('altitude');

  // Generate realistic telemetry data
  useEffect(() => {
    const generateTelemetry = () => {
      const now = Date.now();
      const altitude = 400 + Math.sin(now / 10000) * 50 + Math.random() * 20;
      const newPoint: TelemetryPoint = {
        timestamp: now,
        altitude,
        velocity: 7.66 + Math.random() * 0.1,
        temperature: 288 + Math.sin(now / 5000) * 30 + Math.random() * 10,
        pressure: 101.325 * Math.exp(-altitude / 8500),
        radiation: 50 + Math.random() * 30,
        signalStrength: 85 + Math.random() * 10,
      };

      setTelemetryHistory((prev) => {
        const updated = [...prev, newPoint];
        return updated.slice(-60); // Keep last 60 points
      });

      // Update system status
      setSystemStatus([
        {
          name: 'Altitude',
          status: newPoint.altitude > 350 && newPoint.altitude < 450 ? 'nominal' : 'warning',
          value: newPoint.altitude,
          unit: 'km',
          icon: <Gauge className="w-5 h-5" />,
        },
        {
          name: 'Velocity',
          status: 'nominal',
          value: newPoint.velocity,
          unit: 'km/s',
          icon: <TrendingUp className="w-5 h-5" />,
        },
        {
          name: 'Temperature',
          status: newPoint.temperature > 250 && newPoint.temperature < 320 ? 'nominal' : 'warning',
          value: newPoint.temperature,
          unit: 'K',
          icon: <Thermometer className="w-5 h-5" />,
        },
        {
          name: 'Pressure',
          status: 'nominal',
          value: newPoint.pressure,
          unit: 'kPa',
          icon: <Wind className="w-5 h-5" />,
        },
        {
          name: 'Radiation',
          status: newPoint.radiation > 100 ? 'critical' : 'nominal',
          value: newPoint.radiation,
          unit: 'mSv/h',
          icon: <Zap className="w-5 h-5" />,
        },
        {
          name: 'Signal',
          status: newPoint.signalStrength > 80 ? 'nominal' : 'warning',
          value: newPoint.signalStrength,
          unit: '%',
          icon: <Radio className="w-5 h-5" />,
        },
      ]);
    };

    const interval = setInterval(generateTelemetry, 1000);
    generateTelemetry(); // Initial call

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nominal':
        return 'text-aerospace-success';
      case 'warning':
        return 'text-aerospace-warning';
      case 'critical':
        return 'text-aerospace-danger';
      default:
        return 'text-secondary-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'nominal':
        return 'bg-aerospace-success/10 border-aerospace-success/30';
      case 'warning':
        return 'bg-aerospace-warning/10 border-aerospace-warning/30';
      case 'critical':
        return 'bg-aerospace-danger/10 border-aerospace-danger/30';
      default:
        return 'bg-primary/50 border-secondary/30';
    }
  };

  const radarData = systemStatus.map((s) => ({
    name: s.name,
    value: Math.min(100, (s.value / 100) * 100),
  }));

  return (
    <div className="w-full space-y-6">
      {/* Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {systemStatus.map((status, idx) => (
          <motion.div
            key={status.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`p-4 border ${getStatusBg(status.status)} backdrop-blur`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`${getStatusColor(status.status)}`}>{status.icon}</div>
                <div className={`w-2 h-2 rounded-full ${status.status === 'nominal' ? 'bg-aerospace-success' : status.status === 'warning' ? 'bg-aerospace-warning' : 'bg-aerospace-danger'}`} />
              </div>
              <div className="text-xs text-secondary-foreground mb-1">{status.name}</div>
              <div className="text-lg font-mono font-bold text-foreground">
                {status.value.toFixed(1)}<span className="text-xs ml-1">{status.unit}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-aerospace-blue" />
            Real-Time Telemetry Stream
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={telemetryHistory}>
              <defs>
                <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
              <XAxis dataKey="timestamp" stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#0EA5E9' }}
              />
              <Area
                type="monotone"
                dataKey="altitude"
                stroke="#0EA5E9"
                fillOpacity={1}
                fill="url(#colorAltitude)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart - System Health */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-aerospace-accent" />
            System Health Profile
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(14, 165, 233, 0.2)" />
              <PolarAngleAxis dataKey="name" stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '11px' }} />
              <PolarRadiusAxis stroke="rgba(203, 213, 225, 0.3)" style={{ fontSize: '11px' }} />
              <Radar
                name="System Status"
                dataKey="value"
                stroke="#06B6D4"
                fill="#06B6D4"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Velocity vs Temperature */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-aerospace-success" />
            Velocity Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={telemetryHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
              <XAxis dataKey="timestamp" stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#0EA5E9' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="velocity"
                stroke="#10B981"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Temperature Distribution */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-aerospace-warning" />
            Temperature Profile
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={telemetryHistory.slice(-20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
              <XAxis dataKey="timestamp" stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#0EA5E9' }}
              />
              <Bar dataKey="temperature" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Alert Panel */}
      {systemStatus.some((s) => s.status !== 'nominal') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-aerospace-warning/10 border border-aerospace-warning/30 rounded-lg p-4 flex gap-3"
        >
          <AlertCircle className="w-5 h-5 text-aerospace-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">System Alerts</h4>
            <p className="text-sm text-secondary-foreground">
              {systemStatus.filter((s) => s.status !== 'nominal').map((s) => s.name).join(', ')} require attention
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedTelemetryDashboard;
