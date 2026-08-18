import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Download,
  Share2,
  Settings,
  TrendingUp,
  Activity,
  Zap,
  Wind,
  Gauge,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { realTimeSimulationService, SimulationSession } from '@/services/realTimeSimulationService';

interface RealTimeSimulationViewerProps {
  sessionId: string;
  dataSourceId: string;
  onClose?: () => void;
}

export default function RealTimeSimulationViewer({
  sessionId,
  dataSourceId,
  onClose,
}: RealTimeSimulationViewerProps) {
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'aerodynamics' | 'flow' | 'turbulence' | 'convergence'>(
    'aerodynamics'
  );
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const newSession = await realTimeSimulationService.initializeSession(
          sessionId,
          `Simulation ${sessionId}`,
          dataSourceId
        );
        setSession(newSession);
        setIsLoading(false);

        // Subscribe to real-time updates
        const unsubscribe = realTimeSimulationService.subscribe(sessionId, updatedSession => {
          if (autoRefresh) {
            setSession(updatedSession);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing simulation:', error);
        setIsLoading(false);
      }
    };

    initializeSession();

    return () => {
      realTimeSimulationService.clearSession(sessionId);
    };
  }, [sessionId, dataSourceId, autoRefresh]);

  const handlePlayPause = () => {
    if (!session) return;

    if (session.status === 'running') {
      realTimeSimulationService.pauseSession(sessionId);
    } else if (session.status === 'paused') {
      realTimeSimulationService.resumeSession(sessionId, dataSourceId);
    }
  };

  const handleStop = () => {
    if (!session) return;
    realTimeSimulationService.stopSession(sessionId);
  };

  const handleExport = () => {
    if (!session) return;
    const data = realTimeSimulationService.exportResults(sessionId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-${sessionId}-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-aerospace-dark rounded-lg border border-aerospace-blue/30">
        <div className="text-center">
          <Zap className="mx-auto mb-4 text-aerospace-blue animate-spin" size={48} />
          <p className="text-secondary-foreground">Initializing real-time simulation...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-96 bg-aerospace-dark rounded-lg border border-aerospace-danger/30">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-aerospace-danger" size={48} />
          <p className="text-aerospace-danger">Failed to initialize simulation</p>
        </div>
      </div>
    );
  }

  const statusColor =
    session.status === 'running'
      ? 'text-aerospace-success'
      : session.status === 'paused'
        ? 'text-aerospace-warning'
        : 'text-aerospace-blue';

  const statusBgColor =
    session.status === 'running'
      ? 'bg-aerospace-success'
      : session.status === 'paused'
        ? 'bg-aerospace-warning'
        : 'bg-aerospace-blue';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-aerospace-blue/30 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-aerospace-blue/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">{session.name}</h2>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusBgColor} animate-pulse`} />
                <span className={`text-sm font-medium capitalize ${statusColor}`}>{session.status}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-foreground text-sm">
                <Activity size={16} />
                Progress: {session.progress.toFixed(1)}%
              </div>
              <div className="flex items-center gap-2 text-secondary-foreground text-sm">
                <Gauge size={16} />
                Convergence: {session.convergenceHistory.length > 0 ? session.convergenceHistory[session.convergenceHistory.length - 1].toFixed(2) : '0'}%
              </div>
            </div>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-secondary-foreground hover:text-white transition-colors"
            >
              ✕
            </motion.button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${session.progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-aerospace-blue/20 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              session.status === 'running'
                ? 'bg-aerospace-warning/20 text-aerospace-warning hover:bg-aerospace-warning/30'
                : 'bg-aerospace-success/20 text-aerospace-success hover:bg-aerospace-success/30'
            }`}
          >
            {session.status === 'running' ? (
              <>
                <Pause size={18} /> Pause
              </>
            ) : (
              <>
                <Play size={18} /> Resume
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 bg-aerospace-danger/20 text-aerospace-danger hover:bg-aerospace-danger/30 rounded-lg font-medium transition-colors"
          >
            <Square size={18} /> Stop
          </motion.button>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue/20 text-aerospace-blue hover:bg-aerospace-blue/30 rounded-lg font-medium transition-colors"
          >
            <Download size={18} /> Export
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-aerospace-accent/20 text-aerospace-accent hover:bg-aerospace-accent/30 rounded-lg font-medium transition-colors"
          >
            <Share2 size={18} /> Share
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              autoRefresh
                ? 'bg-aerospace-success/20 text-aerospace-success'
                : 'bg-slate-700/50 text-secondary-foreground'
            }`}
          >
            <Zap size={18} /> {autoRefresh ? 'Live' : 'Paused'}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 border-b border-aerospace-blue/20 flex gap-2 overflow-x-auto">
        {(['aerodynamics', 'flow', 'turbulence', 'convergence'] as const).map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedTab === tab
                ? 'bg-aerospace-blue text-white'
                : 'bg-slate-700/50 text-secondary-foreground hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {selectedTab === 'aerodynamics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wind size={20} className="text-aerospace-blue" />
              Aerodynamic Coefficients
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Drag Coefficient */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-blue/20">
                <p className="text-sm text-secondary-foreground mb-2">Drag Coefficient (Cd)</p>
                <p className="text-3xl font-bold text-aerospace-blue">
                  {session.aerodynamics.dragCoefficient.value.toFixed(4)}
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.aerodynamics.dragCoefficient.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Lift Coefficient */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-accent/20">
                <p className="text-sm text-secondary-foreground mb-2">Lift Coefficient (Cl)</p>
                <p className="text-3xl font-bold text-aerospace-accent">
                  {session.aerodynamics.liftCoefficient.value.toFixed(4)}
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.aerodynamics.liftCoefficient.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Pitch Moment */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-success/20">
                <p className="text-sm text-secondary-foreground mb-2">Pitch Moment (Cm)</p>
                <p className="text-3xl font-bold text-aerospace-success">
                  {session.aerodynamics.pitchMoment.value.toFixed(4)}
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.aerodynamics.pitchMoment.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Stall Angle */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-warning/20">
                <p className="text-sm text-secondary-foreground mb-2">Stall Angle</p>
                <p className="text-3xl font-bold text-aerospace-warning">
                  {session.aerodynamics.stallAngle.value.toFixed(2)}°
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.aerodynamics.stallAngle.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Max Lift */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-blue/20">
                <p className="text-sm text-secondary-foreground mb-2">Max Lift Coefficient</p>
                <p className="text-3xl font-bold text-aerospace-blue">
                  {session.aerodynamics.maxLiftCoefficient.value.toFixed(4)}
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.aerodynamics.maxLiftCoefficient.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Mesh Quality */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-accent/20">
                <p className="text-sm text-secondary-foreground mb-2">Mesh Quality</p>
                <p className="text-3xl font-bold text-aerospace-accent">
                  {(session.flowVisualization.meshQuality * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.flowVisualization.meshQuality > 0.8 ? (
                    <span className="text-aerospace-success flex items-center gap-1">
                      <CheckCircle size={12} /> Excellent
                    </span>
                  ) : (
                    <span className="text-aerospace-warning">Good</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'flow' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Wind size={20} className="text-aerospace-blue" />
              Flow Visualization
            </h3>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-aerospace-blue/20 min-h-96">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-secondary-foreground mb-2">Velocity Field</p>
                  <div className="grid grid-cols-10 gap-1">
                    {session.flowVisualization.velocityField.flat().slice(0, 50).map((val, idx) => (
                      <div
                        key={idx}
                        className="w-full aspect-square rounded-sm"
                        style={{
                          backgroundColor: `hsl(${200 + (val / 50) * 60}, 70%, ${50 - (val / 50) * 20}%)`,
                        }}
                        title={`Velocity: ${val.toFixed(2)} m/s`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-secondary-foreground mb-2">Pressure Field</p>
                  <div className="grid grid-cols-10 gap-1">
                    {session.flowVisualization.pressureField.flat().slice(0, 50).map((val, idx) => (
                      <div
                        key={idx}
                        className="w-full aspect-square rounded-sm"
                        style={{
                          backgroundColor: `hsl(${0 + ((val - 101325) / 5000) * 60}, 70%, ${50 + ((val - 101325) / 5000) * 20}%)`,
                        }}
                        title={`Pressure: ${val.toFixed(0)} Pa`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-secondary-foreground mb-2">Streamlines: {session.flowVisualization.streamlines.length} detected</p>
                  <p className="text-xs text-secondary-foreground">
                    {session.flowVisualization.streamlines.length > 0
                      ? `Average streamline length: ${(session.flowVisualization.streamlines[0]?.length || 0)} points`
                      : 'No streamlines detected'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'turbulence' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap size={20} className="text-aerospace-blue" />
              Turbulence Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-blue/20">
                <p className="text-sm text-secondary-foreground mb-2">Kinetic Energy (k)</p>
                <p className="text-3xl font-bold text-aerospace-blue">
                  {session.turbulence.kineticEnergy.value.toFixed(4)}
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.turbulence.kineticEnergy.unit}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-accent/20">
                <p className="text-sm text-secondary-foreground mb-2">Dissipation Rate (ε)</p>
                <p className="text-3xl font-bold text-aerospace-accent">
                  {session.turbulence.dissipationRate.value.toFixed(4)}
                </p>
                <p className="text-xs text-secondary-foreground mt-2">
                  {session.turbulence.dissipationRate.unit}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-aerospace-blue/20">
              <p className="text-sm text-secondary-foreground mb-3">Reynolds Stress Tensor</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {session.turbulence.reynoldsStress.length > 0 ? (
                  (session.turbulence.reynoldsStress as any[]).slice(0, 9).map((val: any, idx: number) => (
                    <div key={idx} className="bg-slate-700 rounded p-2">
                      <p className="text-xs text-secondary-foreground">σ{idx}</p>
                      <p className="text-lg font-bold text-aerospace-blue">
                        {typeof val === 'number' ? val.toFixed(2) : (Array.isArray(val) ? (val[0]?.toFixed(2) ?? '0.00') : '0.00')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-secondary-foreground text-sm">Computing...</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'convergence' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-aerospace-blue" />
              Convergence History
            </h3>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-aerospace-blue/20 min-h-80">
              {session.convergenceHistory.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-end justify-center gap-1 h-64">
                    {session.convergenceHistory.map((val, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / 100) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 bg-gradient-to-t from-aerospace-blue to-aerospace-accent rounded-t-sm"
                        title={`Iteration ${idx}: ${val.toFixed(2)}%`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-secondary-foreground">Current</p>
                      <p className="text-2xl font-bold text-aerospace-blue">
                        {session.convergenceHistory[session.convergenceHistory.length - 1].toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-foreground">Average</p>
                      <p className="text-2xl font-bold text-aerospace-accent">
                        {(session.convergenceHistory.reduce((a, b) => a + b, 0) / session.convergenceHistory.length).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-foreground">Iterations</p>
                      <p className="text-2xl font-bold text-aerospace-success">
                        {session.convergenceHistory.length}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-secondary-foreground">Waiting for convergence data...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
