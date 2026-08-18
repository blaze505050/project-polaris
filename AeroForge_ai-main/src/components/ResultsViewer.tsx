import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Trash2, Eye, BarChart3, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultData {
  id: string;
  name: string;
  simulationId: string;
  type: 'cfd' | 'fea' | 'thermal' | 'optimization';
  metrics: Record<string, number>;
  timestamp: Date;
  status: 'processing' | 'ready' | 'archived';
}

interface ResultsViewerProps {
  projectId: string;
}

export default function ResultsViewer({ projectId }: ResultsViewerProps) {
  const [results, setResults] = useState<ResultData[]>([
    {
      id: '1',
      name: 'Airfoil CFD - Run 1',
      simulationId: '1',
      type: 'cfd',
      metrics: {
        dragCoefficient: 0.0245,
        liftCoefficient: 1.2847,
        pressureDropPercent: 3.2,
        flowVelocity: 45.3,
      },
      timestamp: new Date(Date.now() - 3600000),
      status: 'ready',
    },
    {
      id: '2',
      name: 'Wing Structural - Run 1',
      simulationId: '2',
      type: 'fea',
      metrics: {
        maxStress: 245.6,
        maxDisplacement: 2.34,
        safetyFactor: 3.8,
        massKg: 12.5,
      },
      timestamp: new Date(Date.now() - 7200000),
      status: 'ready',
    },
  ]);

  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'metrics' | 'charts' | 'details'>('metrics');

  const getTypeIcon = (type: ResultData['type']) => {
    switch (type) {
      case 'cfd':
        return '💨';
      case 'fea':
        return '🔧';
      case 'thermal':
        return '🔥';
      case 'optimization':
        return '⚡';
      default:
        return '📊';
    }
  };

  const getTypeLabel = (type: ResultData['type']) => {
    switch (type) {
      case 'cfd':
        return 'CFD Analysis';
      case 'fea':
        return 'Structural Analysis';
      case 'thermal':
        return 'Thermal Analysis';
      case 'optimization':
        return 'Optimization';
      default:
        return 'Analysis';
    }
  };

  const selectedResultData = results.find(r => r.id === selectedResult);

  // Mock chart data
  const chartData = [
    { name: 'Iteration 1', value: 0.045, pressure: 1.2 },
    { name: 'Iteration 2', value: 0.038, pressure: 1.18 },
    { name: 'Iteration 3', value: 0.032, pressure: 1.25 },
    { name: 'Iteration 4', value: 0.028, pressure: 1.28 },
    { name: 'Iteration 5', value: 0.0245, pressure: 1.2847 },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-primary border border-secondary/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('metrics')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'metrics'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Metrics
          </button>
          <button
            onClick={() => setViewMode('charts')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'charts'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Charts
          </button>
          <button
            onClick={() => setViewMode('details')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
              viewMode === 'details'
                ? 'bg-aerospace-blue text-white'
                : 'text-secondary-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-4 h-4" />
            Details
          </button>
        </div>

        <div className="text-sm text-secondary-foreground">
          {results.filter(r => r.status === 'ready').length} results ready
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="space-y-2">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedResult(result.id)}
              className={`bg-primary border border-secondary/20 rounded-lg p-4 cursor-pointer transition-all ${
                selectedResult === result.id ? 'border-aerospace-blue bg-primary/80' : 'hover:border-secondary/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getTypeIcon(result.type)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium truncate">{result.name}</h3>
                  <p className="text-xs text-secondary-foreground mt-1">{getTypeLabel(result.type)}</p>
                  <p className="text-xs text-secondary-foreground mt-1">
                    {result.timestamp.toLocaleDateString()} {result.timestamp.toLocaleTimeString()}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      result.status === 'ready'
                        ? 'bg-aerospace-success/10 text-aerospace-success'
                        : 'bg-aerospace-warning/10 text-aerospace-warning'
                    }`}>
                      {result.status === 'ready' ? 'Ready' : 'Processing'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Results Content */}
        <div className="lg:col-span-2">
          {selectedResultData ? (
            <motion.div
              key={selectedResult}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary border border-secondary/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedResultData.name}</h2>
                  <p className="text-secondary-foreground mt-1">{getTypeLabel(selectedResultData.type)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-aerospace-danger/20 rounded transition-colors text-secondary-foreground hover:text-aerospace-danger">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {viewMode === 'metrics' && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedResultData.metrics).map(([key, value]) => (
                    <div key={key} className="bg-aerospace-dark rounded-lg p-4">
                      <p className="text-sm text-secondary-foreground mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-2xl font-bold text-aerospace-blue">
                        {typeof value === 'number' ? value.toFixed(3) : value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'charts' && (
                <div className="space-y-6">
                  <div className="bg-aerospace-dark rounded-lg p-4">
                    <h3 className="text-foreground font-semibold mb-4">Convergence Analysis</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#CBD5E1" />
                        <YAxis stroke="#CBD5E1" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #475569' }}
                          labelStyle={{ color: '#E2E8F0' }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#0EA5E9"
                          dot={{ fill: '#0EA5E9' }}
                          name="Drag Coefficient"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-aerospace-dark rounded-lg p-4">
                    <h3 className="text-foreground font-semibold mb-4">Pressure Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#CBD5E1" />
                        <YAxis stroke="#CBD5E1" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #475569' }}
                          labelStyle={{ color: '#E2E8F0' }}
                        />
                        <Legend />
                        <Bar dataKey="pressure" fill="#06B6D4" name="Pressure (kPa)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {viewMode === 'details' && (
                <div className="space-y-4">
                  <div className="bg-aerospace-dark rounded-lg p-4">
                    <h3 className="text-foreground font-semibold mb-3">Simulation Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary-foreground">Simulation ID:</span>
                        <span className="text-foreground font-mono">{selectedResultData.simulationId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-foreground">Result ID:</span>
                        <span className="text-foreground font-mono">{selectedResultData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-foreground">Status:</span>
                        <span className="text-aerospace-success capitalize">{selectedResultData.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-foreground">Generated:</span>
                        <span className="text-foreground">{selectedResultData.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-aerospace-dark rounded-lg p-4">
                    <h3 className="text-foreground font-semibold mb-3">Key Metrics</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedResultData.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-secondary-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-foreground font-semibold">
                            {typeof value === 'number' ? value.toFixed(4) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-primary border border-secondary/20 rounded-lg p-12 text-center"
            >
              <BarChart3 className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
              <p className="text-secondary-foreground">Select a result to view details</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
