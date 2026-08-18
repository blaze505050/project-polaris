import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Clock,
  Activity,
} from 'lucide-react';
import ConvergenceMonitoringService, {
  ConvergenceMetrics,
  ConvergenceReport,
} from '@/services/convergenceMonitoringService';

interface AdvancedConvergenceMonitorProps {
  metrics: ConvergenceMetrics;
  isRunning: boolean;
  currentIteration: number;
  maxIterations: number;
}

export default function AdvancedConvergenceMonitor({
  metrics,
  isRunning,
  currentIteration,
  maxIterations,
}: AdvancedConvergenceMonitorProps) {
  const [report, setReport] = useState<ConvergenceReport | null>(null);
  const [selectedResidual, setSelectedResidual] = useState<'continuity' | 'momentum' | 'energy' | 'turbulence'>('continuity');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const newReport = ConvergenceMonitoringService.generateConvergenceReport(metrics);
    setReport(newReport);
  }, [metrics]);

  const convergenceData = metrics.convergenceHistory.map((entry, idx) => ({
    iteration: entry.iteration,
    residuals: Math.log10(Math.max(entry.residuals, 1e-15)),
    forces: entry.forces,
  }));

  const residualData = metrics.residuals.continuity.map((_, idx) => ({
    iteration: idx,
    continuity: Math.log10(Math.max(metrics.residuals.continuity[idx], 1e-15)),
    momentum: Math.log10(Math.max(metrics.residuals.momentum[idx], 1e-15)),
    energy: Math.log10(Math.max(metrics.residuals.energy[idx], 1e-15)),
    turbulence: Math.log10(Math.max(metrics.residuals.turbulence[idx], 1e-15)),
  }));

  const forceData = metrics.forceCoefficients.cl.map((_, idx) => ({
    iteration: idx,
    cl: metrics.forceCoefficients.cl[idx],
    cd: metrics.forceCoefficients.cd[idx],
    cm: metrics.forceCoefficients.cm[idx],
  }));

  const stats = ConvergenceMonitoringService.getConvergenceStatistics(metrics);
  const issues = ConvergenceMonitoringService.detectConvergenceIssues(metrics);

  const progressPercentage = (currentIteration / maxIterations) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Header with status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 border border-aerospace-blue/20"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Convergence Analysis</h2>
            <p className="text-secondary-foreground">
              Iteration {currentIteration} / {maxIterations}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {metrics.isConverged ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-aerospace-success/20 rounded-lg border border-aerospace-success">
                <CheckCircle className="w-5 h-5 text-aerospace-success" />
                <span className="text-aerospace-success font-medium">Converged</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-aerospace-warning/20 rounded-lg border border-aerospace-warning">
                <Activity className="w-5 h-5 text-aerospace-warning animate-pulse" />
                <span className="text-aerospace-warning font-medium">Running</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-primary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary rounded-lg p-4 border border-aerospace-blue/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-secondary-foreground text-sm">Convergence Rate</span>
            <TrendingUp className="w-4 h-4 text-aerospace-blue" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Math.abs(metrics.convergenceRate).toFixed(3)}
          </p>
          <p className="text-xs text-secondary-foreground mt-1">
            {metrics.convergenceRate < -0.05 ? 'Good' : metrics.convergenceRate < 0 ? 'Acceptable' : 'Poor'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-primary rounded-lg p-4 border border-aerospace-blue/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-secondary-foreground text-sm">Est. Iterations</span>
            <Clock className="w-4 h-4 text-aerospace-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Math.max(0, metrics.estimatedIterationsToConvergence)}
          </p>
          <p className="text-xs text-secondary-foreground mt-1">
            {metrics.estimatedIterationsToConvergence > maxIterations ? 'May exceed limit' : 'Within limit'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary rounded-lg p-4 border border-aerospace-blue/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-secondary-foreground text-sm">Residual Reduction</span>
            <Zap className="w-4 h-4 text-aerospace-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(stats.residualReduction * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-secondary-foreground mt-1">
            {stats.minResidual.toExponential(2)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary rounded-lg p-4 border border-aerospace-blue/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-secondary-foreground text-sm">CL Stability</span>
            <Activity className="w-4 h-4 text-aerospace-accent" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {(stats.clStability * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-secondary-foreground mt-1">
            {stats.clStability > 0.8 ? 'Stable' : 'Unstable'}
          </p>
        </motion.div>
      </div>

      {/* Multi-residual tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary rounded-lg p-6 border border-aerospace-blue/20"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Multi-Residual Tracking</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={residualData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
            <XAxis
              dataKey="iteration"
              stroke="#CBD5E1"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#CBD5E1"
              style={{ fontSize: '12px' }}
              label={{ value: 'log10(Residual)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #0EA5E9',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="continuity"
              stroke="#0EA5E9"
              dot={false}
              isAnimationActive={isRunning}
              name="Continuity"
            />
            <Line
              type="monotone"
              dataKey="momentum"
              stroke="#06B6D4"
              dot={false}
              isAnimationActive={isRunning}
              name="Momentum"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#10B981"
              dot={false}
              isAnimationActive={isRunning}
              name="Energy"
            />
            <Line
              type="monotone"
              dataKey="turbulence"
              stroke="#F59E0B"
              dot={false}
              isAnimationActive={isRunning}
              name="Turbulence"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Force coefficients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-primary rounded-lg p-6 border border-aerospace-blue/20"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Force Coefficients</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
            <XAxis
              dataKey="iteration"
              stroke="#CBD5E1"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#CBD5E1"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid #0EA5E9',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cl"
              stroke="#0EA5E9"
              dot={false}
              isAnimationActive={isRunning}
              name="Lift (CL)"
            />
            <Line
              type="monotone"
              dataKey="cd"
              stroke="#06B6D4"
              dot={false}
              isAnimationActive={isRunning}
              name="Drag (CD)"
            />
            <Line
              type="monotone"
              dataKey="cm"
              stroke="#10B981"
              dot={false}
              isAnimationActive={isRunning}
              name="Moment (CM)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Warnings and recommendations */}
      <AnimatePresence>
        {(report?.warnings.length || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-aerospace-warning/10 rounded-lg p-6 border border-aerospace-warning/30"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-aerospace-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Convergence Warnings</h3>
                <p className="text-secondary-foreground text-sm mt-1">
                  {report?.warnings.length} issue(s) detected
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {report?.warnings.map((warning, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-aerospace-warning mt-1.5 flex-shrink-0" />
                  <p className="text-foreground text-sm">{warning}</p>
                </div>
              ))}
            </div>

            {report?.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-aerospace-warning/20">
                <p className="text-secondary-foreground text-sm font-medium mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-foreground text-sm flex items-start gap-2">
                      <span className="text-aerospace-warning">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convergence issues */}
      <AnimatePresence>
        {issues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-aerospace-danger/10 rounded-lg p-6 border border-aerospace-danger/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-aerospace-danger flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Convergence Issues</h3>
                <ul className="mt-3 space-y-2">
                  {issues.map((issue, idx) => (
                    <li key={idx} className="text-foreground text-sm flex items-start gap-2">
                      <span className="text-aerospace-danger">⚠</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed metrics */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full py-3 px-4 bg-primary rounded-lg border border-aerospace-blue/20 text-foreground hover:bg-primary/80 transition-colors font-medium"
      >
        {showDetails ? 'Hide' : 'Show'} Detailed Metrics
      </motion.button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary rounded-lg p-6 border border-aerospace-blue/20 grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <div>
              <p className="text-secondary-foreground text-sm">Min Residual</p>
              <p className="text-foreground font-semibold">{stats.minResidual.toExponential(2)}</p>
            </div>
            <div>
              <p className="text-secondary-foreground text-sm">Max Residual</p>
              <p className="text-foreground font-semibold">{stats.maxResidual.toExponential(2)}</p>
            </div>
            <div>
              <p className="text-secondary-foreground text-sm">Avg Residual</p>
              <p className="text-foreground font-semibold">{stats.averageResidual.toExponential(2)}</p>
            </div>
            <div>
              <p className="text-secondary-foreground text-sm">CD Stability</p>
              <p className="text-foreground font-semibold">{(stats.cdStability * 100).toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-secondary-foreground text-sm">Mesh Aspect Ratio</p>
              <p className="text-foreground font-semibold">
                {metrics.qualityMetrics.aspectRatio.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-secondary-foreground text-sm">Mesh Skewness</p>
              <p className="text-foreground font-semibold">
                {(metrics.qualityMetrics.skewness * 100).toFixed(1)}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
