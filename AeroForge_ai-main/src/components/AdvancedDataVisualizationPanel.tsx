/**
 * Advanced Data Visualization Panel
 * Professional-grade multi-parameter visualization
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

interface DataPoint {
  time: number;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
}

const AdvancedDataVisualizationPanel: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'metric1' | 'metric2'>('all');

  // Generate realistic data
  useEffect(() => {
    const generateData = () => {
      const newData: DataPoint[] = Array.from({ length: 50 }, (_, i) => ({
        time: i,
        value1: 50 + Math.sin(i / 10) * 30 + Math.random() * 10,
        value2: 60 + Math.cos(i / 8) * 25 + Math.random() * 8,
        value3: 40 + Math.sin(i / 12) * 20 + Math.random() * 5,
        value4: 70 + Math.random() * 15,
      }));
      setData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Peak Value', value: '94.2', trend: '+2.1%', icon: TrendingUp, color: 'text-aerospace-success' },
    { label: 'Average', value: '67.8', trend: '-0.5%', icon: Activity, color: 'text-aerospace-blue' },
    { label: 'Min Value', value: '32.1', trend: '+1.3%', icon: TrendingDown, color: 'text-aerospace-warning' },
    { label: 'Volatility', value: '12.4%', trend: 'Stable', icon: Zap, color: 'text-aerospace-accent' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-primary/50 border-aerospace-blue/20 p-4">
                <div className="flex items-start justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-aerospace-success font-mono">{stat.trend}</span>
                </div>
                <div className="text-xs text-secondary-foreground mb-1">{stat.label}</div>
                <div className="text-2xl font-mono font-bold text-foreground">{stat.value}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Visualization */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Multi-Parameter Analysis</h3>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
            <XAxis dataKey="time" stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '12px' }} />
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
            <Area
              type="monotone"
              dataKey="value1"
              stroke="#0EA5E9"
              fillOpacity={1}
              fill="url(#colorValue1)"
              name="Parameter 1"
            />
            <Area
              type="monotone"
              dataKey="value2"
              stroke="#06B6D4"
              fillOpacity={1}
              fill="url(#colorValue2)"
              name="Parameter 2"
            />
            <Line
              type="monotone"
              dataKey="value3"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Parameter 3"
            />
            <Line
              type="monotone"
              dataKey="value4"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="Parameter 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Value Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.slice(-15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
              <XAxis dataKey="time" stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '11px' }} />
              <YAxis stroke="rgba(203, 213, 225, 0.5)" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value1" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Correlation Matrix */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Parameter Correlation</h3>
          <div className="space-y-3">
            {[
              { pair: 'Param 1 ↔ Param 2', correlation: 0.87, strength: 'Strong' },
              { pair: 'Param 1 ↔ Param 3', correlation: 0.62, strength: 'Moderate' },
              { pair: 'Param 2 ↔ Param 4', correlation: 0.45, strength: 'Weak' },
              { pair: 'Param 3 ↔ Param 4', correlation: 0.91, strength: 'Very Strong' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-aerospace-dark/50 rounded border border-aerospace-blue/20">
                <span className="text-sm text-secondary-foreground">{item.pair}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-aerospace-dark/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.correlation * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-aerospace-blue font-bold w-12 text-right">
                    {(item.correlation * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedDataVisualizationPanel;
