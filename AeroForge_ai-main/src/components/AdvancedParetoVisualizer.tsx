import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Bar,
  Line,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Eye, EyeOff, Layers, Activity, Gauge, TrendingUp } from 'lucide-react';
import { Solution } from '@/services/multiObjectiveOptimizationService';

interface AdvancedVisualizerProps {
  paretoFront: Solution[];
  statistics: {
    bestFitness: number;
    averageFitness: number;
    diversity: number;
    spreadMetric: number;
  };
  convergenceHistory: Array<{ generation: number; hypervolume: number }>;
}

const colorPalettes = {
  viridis: ['#440154', '#31688e', '#35b779', '#fde724'],
  plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89540'],
  inferno: ['#000004', '#420a68', '#932667', '#fca636'],
  cool: ['#0d47a1', '#1976d2', '#42a5f5', '#90caf9'],
  warm: ['#b71c1c', '#e64a19', '#ff6f00', '#ffa726'],
};

export default function AdvancedParetoVisualizer({
  paretoFront,
  statistics,
  convergenceHistory,
}: AdvancedVisualizerProps) {
  const [colorScheme, setColorScheme] = useState<keyof typeof colorPalettes>('viridis');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'drag' | 'lift' | 'weight' | 'efficiency'>('drag');

  // Prepare 3D-like scatter data with color gradient
  const paretoWithColor = useMemo(() => {
    const palette = colorPalettes[colorScheme];
    return paretoFront.map((sol, idx) => ({
      ...sol,
      id: idx,
      drag: sol.objectives['Drag'],
      lift: sol.objectives['Lift'],
      weight: sol.objectives['Weight'],
      efficiency: sol.objectives['Efficiency'],
      color: palette[idx % palette.length],
      size: 100 + (sol.rank || 0) * 20,
    }));
  }, [paretoFront, colorScheme]);

  // Prepare radar data for selected solution
  const radarData = useMemo(() => {
    if (paretoFront.length === 0) return [];
    const topSolutions = paretoFront.slice(0, 3);
    return topSolutions.map((sol, idx) => ({
      name: `Solution ${idx + 1}`,
      Drag: Math.max(0, 10 - sol.objectives['Drag']),
      Lift: sol.objectives['Lift'],
      Weight: Math.max(0, 100 - sol.objectives['Weight']),
      Efficiency: sol.objectives['Efficiency'],
      fullMark: 10,
    }));
  }, [paretoFront]);

  // Prepare heatmap-like data
  const heatmapData = useMemo(() => {
    return paretoFront.slice(0, 20).map((sol, idx) => ({
      id: idx,
      drag: sol.objectives['Drag'],
      lift: sol.objectives['Lift'],
      weight: sol.objectives['Weight'],
      efficiency: sol.objectives['Efficiency'],
      combined: (sol.objectives['Drag'] + sol.objectives['Weight']) / (sol.objectives['Lift'] + sol.objectives['Efficiency']),
    }));
  }, [paretoFront]);

  // Prepare convergence with multiple metrics
  const convergenceData = useMemo(() => {
    return convergenceHistory.map((item, idx) => ({
      ...item,
      fitness: statistics.bestFitness * (1 - Math.exp(-item.generation / 10)),
      diversity: statistics.diversity * Math.sin(item.generation / 5) * 0.5 + statistics.diversity * 0.5,
    }));
  }, [convergenceHistory, statistics]);

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
      >
        <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Visualization Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Color Scheme */}
          <div>
            <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
              Color Scheme
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as keyof typeof colorPalettes)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
            >
              <option value="viridis">Viridis</option>
              <option value="plasma">Plasma</option>
              <option value="inferno">Inferno</option>
              <option value="cool">Cool</option>
              <option value="warm">Warm</option>
            </select>
          </div>

          {/* Toggle Heatmap */}
          <div className="flex items-end">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`w-full py-2 px-3 rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2 ${
                showHeatmap
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {showHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Heatmap
            </button>
          </div>

          {/* Toggle Radar */}
          <div className="flex items-end">
            <button
              onClick={() => setShowRadar(!showRadar)}
              className={`w-full py-2 px-3 rounded-lg font-paragraph font-semibold transition-colors flex items-center justify-center gap-2 ${
                showRadar
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {showRadar ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Radar
            </button>
          </div>

          {/* Metric Selection */}
          <div>
            <label className="font-paragraph text-sm font-semibold text-slate-300 block mb-2">
              Focus Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
            >
              <option value="drag">Drag</option>
              <option value="lift">Lift</option>
              <option value="weight">Weight</option>
              <option value="efficiency">Efficiency</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Advanced 3D-like Scatter Plot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
      >
        <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Multi-Dimensional Pareto Front (Drag vs Lift vs Weight)
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="drag"
              type="number"
              stroke="#94a3b8"
              label={{ value: 'Drag Coefficient', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              dataKey="lift"
              stroke="#94a3b8"
              label={{ value: 'Lift Coefficient', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 rounded p-3 text-xs">
                      <p className="text-blue-400">Drag: {data.drag.toFixed(4)}</p>
                      <p className="text-green-400">Lift: {data.lift.toFixed(4)}</p>
                      <p className="text-yellow-400">Weight: {data.weight.toFixed(2)}</p>
                      <p className="text-purple-400">Efficiency: {data.efficiency.toFixed(4)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Pareto Front" data={paretoWithColor}>
              {paretoWithColor.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Heatmap Visualization */}
      {showHeatmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Performance Heatmap (Top 20 Solutions)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={heatmapData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 rounded p-3 text-xs">
                        <p className="text-slate-300">Solution {data.id}</p>
                        <p className="text-blue-400">Drag: {data.drag.toFixed(4)}</p>
                        <p className="text-green-400">Lift: {data.lift.toFixed(4)}</p>
                        <p className="text-yellow-400">Weight: {data.weight.toFixed(2)}</p>
                        <p className="text-purple-400">Efficiency: {data.efficiency.toFixed(4)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="drag" fill="#0EA5E9" fillOpacity={0.6} />
              <Bar dataKey="lift" fill="#10B981" fillOpacity={0.6} />
              <Bar dataKey="weight" fill="#F59E0B" fillOpacity={0.6} />
              <Line type="monotone" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Radar Chart for Top Solutions */}
      {showRadar && radarData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700"
        >
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top 3 Solutions - Multi-Objective Profile
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
              <PolarRadiusAxis stroke="#94a3b8" />
              <Radar
                name="Solution 1"
                dataKey="Drag"
                stroke={colorPalettes[colorScheme][0]}
                fill={colorPalettes[colorScheme][0]}
                fillOpacity={0.25}
              />
              <Radar
                name="Solution 2"
                dataKey="Lift"
                stroke={colorPalettes[colorScheme][1]}
                fill={colorPalettes[colorScheme][1]}
                fillOpacity={0.25}
              />
              <Radar
                name="Solution 3"
                dataKey="Weight"
                stroke={colorPalettes[colorScheme][2]}
                fill={colorPalettes[colorScheme][2]}
                fillOpacity={0.25}
              />
              <Legend />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Advanced Convergence Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
      >
        <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Convergence Analysis - Fitness & Diversity
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={convergenceData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <defs>
              <linearGradient id="fitnessGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="diversityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="generation"
              stroke="#94a3b8"
              label={{ value: 'Generation', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="hypervolume"
              stroke="#0EA5E9"
              fill="url(#fitnessGradient)"
              name="Hypervolume"
            />
            <Area
              type="monotone"
              dataKey="diversity"
              stroke="#10B981"
              fill="url(#diversityGradient)"
              name="Diversity"
            />
            <ReferenceLine
              y={statistics.bestFitness}
              stroke="#F59E0B"
              strokeDasharray="5 5"
              label={{ value: 'Best Fitness', position: 'right', fill: '#F59E0B' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Best Fitness', value: statistics.bestFitness.toFixed(6), color: 'blue' },
          { label: 'Avg Fitness', value: statistics.averageFitness.toFixed(6), color: 'green' },
          { label: 'Diversity', value: statistics.diversity.toFixed(4), color: 'purple' },
          { label: 'Spread', value: statistics.spreadMetric.toFixed(4), color: 'orange' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-slate-800 rounded-xl p-4 border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900`}
          >
            <p className="font-paragraph text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className={`font-heading text-2xl font-bold text-${stat.color}-400`}>
              {stat.value}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
