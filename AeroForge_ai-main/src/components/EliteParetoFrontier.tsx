import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Bar,
} from 'recharts';
import {
  Maximize2,
  Minimize2,
  Download,
  Filter,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface ParetoPoint {
  id: string;
  x: number;
  y: number;
  z?: number;
  label: string;
  isDominated: boolean;
  metrics: Record<string, number>;
}

interface EliteParetoFrontierProps {
  data: ParetoPoint[];
  xAxis: string;
  yAxis: string;
  zAxis?: string;
  title?: string;
  onPointSelect?: (point: ParetoPoint) => void;
}

export default function EliteParetoFrontier({
  data,
  xAxis,
  yAxis,
  zAxis,
  title = 'Pareto Frontier Analysis',
  onPointSelect,
}: EliteParetoFrontierProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<ParetoPoint | null>(null);
  const [showDominated, setShowDominated] = useState(false);
  const [view3D, setView3D] = useState(false);

  const paretoFront = useMemo(() => {
    return data.filter(p => !p.isDominated);
  }, [data]);

  const displayData = useMemo(() => {
    return showDominated ? data : paretoFront;
  }, [data, paretoFront, showDominated]);

  const handlePointClick = (point: ParetoPoint) => {
    setSelectedPoint(point);
    onPointSelect?.(point);
  };

  const downloadData = () => {
    const csv = [
      ['ID', xAxis, yAxis, ...(zAxis ? [zAxis] : []), 'Status'],
      ...displayData.map(p => [
        p.label,
        p.x.toFixed(4),
        p.y.toFixed(4),
        ...(zAxis && p.z ? [p.z.toFixed(4)] : []),
        p.isDominated ? 'Dominated' : 'Pareto Optimal',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pareto-frontier-${Date.now()}.csv`;
    a.click();
  };

  const containerClass = isExpanded
    ? 'fixed inset-0 z-50 bg-aerospace-dark p-6'
    : 'relative w-full h-96';

  return (
    <motion.div
      className={`${containerClass} rounded-lg border border-aerospace-blue/30 bg-gradient-to-br from-aerospace-dark to-slate-900 overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-aerospace-blue/20">
        <div>
          <h3 className="text-lg font-heading font-bold text-aerospace-blue">{title}</h3>
          <p className="text-sm text-secondary-foreground mt-1">
            {paretoFront.length} optimal solutions • {data.length - paretoFront.length} dominated
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadData}
            className="p-2 rounded-lg bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue transition-colors"
            title="Download data"
          >
            <Download size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-aerospace-blue/10 hover:bg-aerospace-blue/20 text-aerospace-blue transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 p-4 border-b border-aerospace-blue/20 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDominated(!showDominated)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            showDominated
              ? 'bg-aerospace-blue text-white'
              : 'bg-aerospace-blue/10 text-aerospace-blue hover:bg-aerospace-blue/20'
          }`}
        >
          <Filter size={14} className="inline mr-1" />
          {showDominated ? 'Hide' : 'Show'} Dominated
        </motion.button>

        {zAxis && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView3D(!view3D)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              view3D
                ? 'bg-aerospace-accent text-white'
                : 'bg-aerospace-accent/10 text-aerospace-accent hover:bg-aerospace-accent/20'
            }`}
          >
            <Zap size={14} className="inline mr-1" />
            {view3D ? '3D' : '2D'} View
          </motion.button>
        )}
      </div>

      {/* Chart */}
      <div className={isExpanded ? 'h-[calc(100vh-200px)]' : 'h-80'}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.1)" />
            <XAxis
              type="number"
              dataKey="x"
              name={xAxis}
              stroke="rgba(203, 213, 225, 0.5)"
              label={{ value: xAxis, position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yAxis}
              stroke="rgba(203, 213, 225, 0.5)"
              label={{ value: yAxis, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => value.toFixed(4)}
            />
            <Legend />

            {/* Pareto Front */}
            <Scatter
              name="Pareto Optimal"
              data={paretoFront}
              fill="rgba(16, 185, 129, 0.8)"
              onClick={(data: any) => handlePointClick(data)}
              cursor="pointer"
            />

            {/* Dominated Solutions */}
            {showDominated && (
              <Scatter
                name="Dominated"
                data={data.filter(p => p.isDominated)}
                fill="rgba(239, 68, 68, 0.4)"
                onClick={(data: any) => handlePointClick(data)}
                cursor="pointer"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <motion.div
          className="p-4 border-t border-aerospace-blue/20 bg-aerospace-blue/5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-secondary-foreground uppercase tracking-wide">Solution</p>
              <p className="text-lg font-bold text-aerospace-blue">{selectedPoint.label}</p>
            </div>
            <div>
              <p className="text-xs text-secondary-foreground uppercase tracking-wide">{xAxis}</p>
              <p className="text-lg font-bold text-aerospace-accent">
                {selectedPoint.x.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary-foreground uppercase tracking-wide">{yAxis}</p>
              <p className="text-lg font-bold text-aerospace-success">
                {selectedPoint.y.toFixed(4)}
              </p>
            </div>
            {selectedPoint.z && (
              <div>
                <p className="text-xs text-secondary-foreground uppercase tracking-wide">{zAxis}</p>
                <p className="text-lg font-bold text-aerospace-warning">
                  {selectedPoint.z.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
