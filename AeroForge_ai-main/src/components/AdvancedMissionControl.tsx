/**
 * Advanced Mission Control Center
 * Professional-grade command center with real-time monitoring
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, AlertTriangle, Zap, Gauge, TrendingUp, Lock, Eye, Settings, Download, Share2 } from 'lucide-react';

interface MissionStatus {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'alert' | 'offline';
  uptime: number;
  efficiency: number;
  lastUpdate: Date;
}

const AdvancedMissionControl: React.FC = () => {
  const [missions, setMissions] = useState<MissionStatus[]>([
    { id: '1', name: 'ISS Tracking', status: 'active', uptime: 99.99, efficiency: 94.2, lastUpdate: new Date() },
    { id: '2', name: 'Satellite Network', status: 'active', uptime: 99.95, efficiency: 91.8, lastUpdate: new Date() },
    { id: '3', name: 'Deep Space Probe', status: 'standby', uptime: 98.5, efficiency: 87.3, lastUpdate: new Date() },
    { id: '4', name: 'Telemetry Stream', status: 'active', uptime: 99.98, efficiency: 96.1, lastUpdate: new Date() },
  ]);

  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    network: 78,
    storage: 34,
  });

  // Update system health periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth({
        cpu: Math.max(20, Math.min(95, 45 + (Math.random() - 0.5) * 20)),
        memory: Math.max(30, Math.min(90, 62 + (Math.random() - 0.5) * 15)),
        network: Math.max(40, Math.min(100, 78 + (Math.random() - 0.5) * 25)),
        storage: Math.max(20, Math.min(80, 34 + (Math.random() - 0.5) * 10)),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-aerospace-success';
      case 'standby':
        return 'text-aerospace-warning';
      case 'alert':
        return 'text-aerospace-danger';
      default:
        return 'text-secondary-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-aerospace-success/10 border-aerospace-success/30';
      case 'standby':
        return 'bg-aerospace-warning/10 border-aerospace-warning/30';
      case 'alert':
        return 'bg-aerospace-danger/10 border-aerospace-danger/30';
      default:
        return 'bg-primary/50 border-secondary/30';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-aerospace-success rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold text-foreground">Mission Control Center</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-aerospace-blue/30 hover:bg-aerospace-blue/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" variant="outline" className="border-aerospace-blue/30 hover:bg-aerospace-blue/10">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* System Health Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CPU Usage', value: systemHealth.cpu, icon: Zap },
          { label: 'Memory', value: systemHealth.memory, icon: Gauge },
          { label: 'Network', value: systemHealth.network, icon: Radio },
          { label: 'Storage', value: systemHealth.storage, icon: Eye },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          const isWarning = metric.value > 80;
          const isCritical = metric.value > 90;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`p-4 border ${isCritical ? 'bg-aerospace-danger/10 border-aerospace-danger/30' : isWarning ? 'bg-aerospace-warning/10 border-aerospace-warning/30' : 'bg-primary/50 border-aerospace-blue/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${isCritical ? 'text-aerospace-danger' : isWarning ? 'text-aerospace-warning' : 'text-aerospace-blue'}`} />
                  <span className="text-xs font-mono font-bold text-foreground">{metric.value.toFixed(0)}%</span>
                </div>
                <div className="text-xs text-secondary-foreground mb-2">{metric.label}</div>
                <div className="w-full h-1.5 bg-aerospace-dark/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${isCritical ? 'bg-aerospace-danger' : isWarning ? 'bg-aerospace-warning' : 'bg-aerospace-success'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Active Missions */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-aerospace-blue" />
          Active Missions
        </h3>

        <div className="space-y-3">
          {missions.map((mission, idx) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusBg(mission.status)} backdrop-blur`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${mission.status === 'active' ? 'bg-aerospace-success animate-pulse' : mission.status === 'standby' ? 'bg-aerospace-warning' : 'bg-aerospace-danger'}`} />
                  <span className="font-semibold text-foreground">{mission.name}</span>
                </div>
                <span className={`text-xs font-mono font-bold uppercase ${getStatusColor(mission.status)}`}>
                  {mission.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-secondary-foreground mb-1">Uptime</div>
                  <div className="font-mono font-bold text-aerospace-blue">{mission.uptime.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-secondary-foreground mb-1">Efficiency</div>
                  <div className="font-mono font-bold text-aerospace-success">{mission.efficiency.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-secondary-foreground mb-1">Last Update</div>
                  <div className="font-mono font-bold text-aerospace-accent">
                    {mission.lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Alert Panel */}
      {systemHealth.cpu > 80 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-aerospace-warning/10 border border-aerospace-warning/30 rounded-lg p-4 flex gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-aerospace-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">System Alert</h4>
            <p className="text-sm text-secondary-foreground">
              CPU usage exceeds safe threshold. Consider optimizing workload distribution.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedMissionControl;
