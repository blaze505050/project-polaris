import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';

interface TelemetryMetric {
  name: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  min?: number;
  max?: number;
  precision?: number;
}

interface TelemetryDisplayProps {
  metrics: TelemetryMetric[];
  title?: string;
  refreshRate?: number;
}

export default function TelemetryDisplay({
  metrics,
  title = 'TELEMETRY',
  refreshRate = 1000,
}: TelemetryDisplayProps) {
  const [displayMetrics, setDisplayMetrics] = useState(metrics);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setDisplayMetrics(metrics);
    setLastUpdate(new Date());
  }, [metrics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-[#10B981]';
      case 'warning':
        return 'text-[#F59E0B]';
      case 'critical':
        return 'text-[#EF4444]';
      default:
        return 'text-[#00F0FF]';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-[#10B981]/10 border-[#10B981]/20';
      case 'warning':
        return 'bg-[#F59E0B]/10 border-[#F59E0B]/20';
      case 'critical':
        return 'bg-[#EF4444]/10 border-[#EF4444]/20';
      default:
        return 'bg-[#00F0FF]/10 border-[#00F0FF]/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle2 size={14} />;
      case 'warning':
      case 'critical':
        return <AlertCircle size={14} />;
      default:
        return <Zap size={14} />;
    }
  };

  const formatValue = (value: number | string, precision?: number): string => {
    if (typeof value === 'string') return value;
    if (precision !== undefined) return value.toFixed(precision);
    return value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00F0FF]/10">
        <h3 className="text-sm font-bold text-[#00F0FF] font-mono flex items-center gap-2">
          <Zap size={16} />
          {title}
        </h3>
        <span className="text-xs font-mono text-secondary-foreground">
          {lastUpdate.toISOString().split('T')[1].substring(0, 8)}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 space-y-3">
        {displayMetrics.map((metric, idx) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-3 rounded border ${getStatusBgColor(metric.status)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={getStatusColor(metric.status)}>
                  {getStatusIcon(metric.status)}
                </div>
                <span className="text-xs font-mono text-secondary-foreground">
                  {metric.name}
                </span>
              </div>
              {metric.min !== undefined && metric.max !== undefined && (
                <div className="text-xs font-mono text-secondary-foreground">
                  [{metric.min}, {metric.max}]
                </div>
              )}
            </div>

            {/* Value Display */}
            <div className="flex items-baseline gap-2">
              <span className={`text-sm font-bold font-mono ${getStatusColor(metric.status)}`}>
                {formatValue(metric.value, metric.precision)}
              </span>
              <span className="text-xs font-mono text-secondary-foreground">
                {metric.unit}
              </span>
            </div>

            {/* Progress Bar (if min/max provided) */}
            {metric.min !== undefined && metric.max !== undefined && typeof metric.value === 'number' && (
              <div className="mt-2 h-1.5 bg-[#0B0E14] rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((metric.value - metric.min) / (metric.max - metric.min)) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${
                    metric.status === 'normal'
                      ? 'bg-[#10B981]'
                      : metric.status === 'warning'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#EF4444]'
                  }`}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#00F0FF]/10 bg-[#0B0E14]/30">
        <div className="flex items-center justify-between text-xs font-mono text-secondary-foreground">
          <span>
            {displayMetrics.filter((m) => m.status === 'normal').length}/{displayMetrics.length} NOMINAL
          </span>
          <span>
            {displayMetrics.filter((m) => m.status === 'critical').length} CRITICAL
          </span>
        </div>
      </div>
    </motion.div>
  );
}
