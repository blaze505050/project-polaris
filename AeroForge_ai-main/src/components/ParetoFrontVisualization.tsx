import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Bar,
  Line,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  LineChart,
} from 'recharts';
import { Solution } from '@/services/multiObjectiveOptimizationService';
import { Maximize2, Minimize2, TrendingUp, Zap } from 'lucide-react';

interface ParetoVisualizationProps {
  paretoFront: Solution[];
  convergenceHistory: Array<{ generation: number; hypervolume: number }>;
  statistics: {
    bestFitness: number;
    averageFitness: number;
    diversity: number;
    spreadMetric: number;
  };
}

const getColorByRank = (rank: number | undefined, maxRank: number): string => {
  if (!rank) return '#0EA5E9';
  const ratio = rank / maxRank;
  if (ratio < 0.25) return '#10B981';
  if (ratio < 0.5) return '#0EA5E9';
  if (ratio < 0.75) return '#F59E0B';
  return '#EF4444';
};

export default function ParetoFrontVisualization({
  paretoFront,
  convergenceHistory,
  statistics,
}: ParetoVisualizationProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d-like' | 'metrics'>('2d');

  const maxRank = Math.max(...paretoFront.map((s) => s.rank || 0), 1);

  // Prepare data for different views
  const paretoData = useMemo(() => {
    return paretoFront.map((sol, idx) => ({
      id: idx,
      drag: sol.objectives['Drag'],
      lift: sol.objectives['Lift'],
      weight: sol.objectives['Weight'],
      efficiency: sol.objectives['Efficiency'],
      rank: sol.rank || 0,
      color: getColorByRank(sol.rank, maxRank),
      size: 50 + (maxRank - (sol.rank || 0)) * 10,
    }));
  }, [paretoFront, maxRank]);

  // Prepare metrics comparison data
  const metricsData = useMemo(() => {
    return paretoFront.slice(0, 15).map((sol, idx) => ({
      id: idx,
      drag: sol.objectives['Drag'],
      lift: sol.objectives['Lift'],
      weight: sol.objectives['Weight'] / 10, // Scale for visibility
      efficiency: sol.objectives['Efficiency'],
    }));
  }, [paretoFront]);

  // Prepare convergence data with smoothing
  const convergenceData = useMemo(() => {
    return convergenceHistory.map((item, idx) => ({
      ...item,
      smoothed: convergenceHistory
        .slice(Math.max(0, idx - 2), idx + 3)
        .reduce((sum, h) => sum + h.hypervolume, 0) / Math.min(5, idx + 3),
    }));
  }, [convergenceHistory]);

  return (
    <div className="space-y-8">
      {/* View Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 bg-slate-800 rounded-xl p-4 border border-slate-700"
      >
        {(['2d', '3d-like', 'metrics'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-lg font-paragraph font-semibold transition-all ${
              viewMode === mode
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {mode === '2d' && 'Standard 2D'}
            {mode === '3d-like' && '3D-Like View'}
            {mode === 'metrics' && 'Metrics'}
          </button>
        ))}
      </motion.div>

      {/* 2D Standard View */}
      {viewMode === '2d' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Drag vs Lift */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Maximize2 className="w-5 h-5" />
              Drag vs Lift Optimization
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="drag"
                  type="number"
                  stroke="#94a3b8"
                  label={{ value: 'Drag (Lower is Better)', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  dataKey="lift"
                  stroke="#94a3b8"
                  label={{ value: 'Lift (Higher is Better)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter name="Pareto Front" data={paretoData}>
                  {paretoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Weight vs Efficiency */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Minimize2 className="w-5 h-5" />
              Weight vs Efficiency Trade-off
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="weight"
                  type="number"
                  stroke="#94a3b8"
                  label={{ value: 'Weight (Lower is Better)', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  dataKey="efficiency"
                  stroke="#94a3b8"
                  label={{ value: 'Efficiency (Higher is Better)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter name="Pareto Front" data={paretoData}>
                  {paretoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* 3D-Like View */}
      {viewMode === '3d-like' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Multi-dimensional scatter with size encoding */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="font-heading text-lg font-bold text-white mb-4">
              4D Pareto Front (Drag, Lift, Weight, Efficiency)
            </h4>
            <p className="font-paragraph text-sm text-slate-400 mb-4">
              X: Drag | Y: Lift | Size: Weight | Color: Efficiency Rank
            </p>
            <ResponsiveContainer width="100%" height={400}>
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
                        <div className="bg-slate-900 border border-slate-700 rounded p-3 text-xs space-y-1">
                          <p className="text-blue-400">Drag: {data.drag.toFixed(4)}</p>
                          <p className="text-green-400">Lift: {data.lift.toFixed(4)}</p>
                          <p className="text-yellow-400">Weight: {data.weight.toFixed(2)}</p>
                          <p className="text-purple-400">Efficiency: {data.efficiency.toFixed(4)}</p>
                          <p className="text-slate-300">Rank: {data.rank}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Pareto Front" data={paretoData}>
                  {paretoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Convergence with confidence band */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Convergence Trajectory
            </h4>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={convergenceData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient id="convergenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="hypervolume"
                  stroke="#0EA5E9"
                  fill="url(#convergenceGradient)"
                  name="Hypervolume"
                />
                <Line
                  type="monotone"
                  dataKey="smoothed"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Smoothed Trend"
                />
                <ReferenceLine
                  y={statistics.bestFitness}
                  stroke="#F59E0B"
                  strokeDasharray="5 5"
                  label={{ value: 'Best Fitness', position: 'right', fill: '#F59E0B', fontSize: 12 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Metrics View */}
      {viewMode === 'metrics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Metrics comparison */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Objective Metrics Comparison (Top 15)
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={metricsData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                />
                <Legend />
                <Bar dataKey="drag" fill="#0EA5E9" fillOpacity={0.7} name="Drag" />
                <Bar dataKey="lift" fill="#10B981" fillOpacity={0.7} name="Lift" />
                <Bar dataKey="weight" fill="#F59E0B" fillOpacity={0.7} name="Weight (scaled)" />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="Efficiency"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Best Fitness',
                value: statistics.bestFitness.toFixed(6),
                icon: '⚡',
                color: 'blue',
              },
              {
                label: 'Average Fitness',
                value: statistics.averageFitness.toFixed(6),
                icon: '📊',
                color: 'green',
              },
              {
                label: 'Population Diversity',
                value: statistics.diversity.toFixed(4),
                icon: '🎯',
                color: 'purple',
              },
              {
                label: 'Spread Metric',
                value: statistics.spreadMetric.toFixed(4),
                icon: '📈',
                color: 'orange',
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-paragraph text-sm text-slate-400">{stat.label}</span>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className={`font-heading text-2xl font-bold text-${stat.color}-400`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
