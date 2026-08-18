import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, Settings, Zap, TrendingUp, Clock, Gauge } from 'lucide-react';
import { interactiveSimulationEngine, InteractiveSimulationState, SimulationParameters } from '@/services/interactiveSimulationEngine';
import AdvancedPhysicsVisualizer from './AdvancedPhysicsVisualizer';
import ValidationReportPanel from './ValidationReportPanel';

interface InteractiveSimulationPanelProps {
  title: string;
  description: string;
  defaultParameters?: Partial<SimulationParameters>;
}

export default function InteractiveSimulationPanel({
  title,
  description,
  defaultParameters,
}: InteractiveSimulationPanelProps) {
  const [state, setState] = useState<InteractiveSimulationState | null>(null);
  const [parameters, setParameters] = useState<SimulationParameters>({
    reynoldsNumber: defaultParameters?.reynoldsNumber || 1e6,
    machNumber: defaultParameters?.machNumber || 0.3,
    angleOfAttack: defaultParameters?.angleOfAttack || 5,
    altitude: defaultParameters?.altitude || 0,
    meshSize: defaultParameters?.meshSize || 10000,
    turbulenceModel: defaultParameters?.turbulenceModel || 'k-epsilon',
    solverType: defaultParameters?.solverType || 'RANS',
    timeStep: defaultParameters?.timeStep || 0.001,
    maxIterations: defaultParameters?.maxIterations || 100,
  });
  const [showSettings, setShowSettings] = useState(false);

  // Subscribe to simulation updates
  useEffect(() => {
    const unsubscribe = interactiveSimulationEngine.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  const handleStartSimulation = () => {
    interactiveSimulationEngine.initializeSimulation(parameters);
    interactiveSimulationEngine.startSimulation();
  };

  const handlePauseResume = () => {
    if (state?.isPaused) {
      interactiveSimulationEngine.resumeSimulation();
    } else {
      interactiveSimulationEngine.pauseSimulation();
    }
  };

  const handleStop = () => {
    interactiveSimulationEngine.stopSimulation();
  };

  const handleExport = () => {
    const results = interactiveSimulationEngine.exportResults();
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulation-results-${new Date().toISOString()}.json`;
    link.click();
  };

  const handleParameterChange = (param: keyof SimulationParameters, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  if (!state) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-br from-aerospace-dark to-primary rounded-lg border border-aerospace-blue/20 overflow-hidden p-8"
      >
        <div className="text-center">
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">{title}</h3>
          <p className="text-secondary-foreground mb-6">{description}</p>
          <button
            onClick={handleStartSimulation}
            className="px-6 py-3 bg-aerospace-blue hover:bg-aerospace-blue/80 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <Play size={18} />
            Start Simulation
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Main Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-br from-aerospace-dark to-primary rounded-lg border border-aerospace-blue/20 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-aerospace-blue/10 to-aerospace-accent/10 border-b border-aerospace-blue/20 p-6">
          <h3 className="text-xl font-heading font-bold text-foreground mb-2">{title}</h3>
          <p className="text-secondary-foreground text-sm">{description}</p>
        </div>

        {/* Progress Section */}
        <div className="p-6 border-b border-aerospace-blue/10">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Simulation Progress</span>
              <span className="text-sm font-mono text-aerospace-blue">
                {state.currentIteration} / {state.totalIterations}
              </span>
            </div>
            <div className="w-full bg-primary/50 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${state.progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/50 rounded-lg p-3">
              <div className="text-xs text-secondary-foreground mb-1">Progress</div>
              <div className="text-2xl font-bold text-aerospace-blue">{state.progress.toFixed(1)}%</div>
            </div>
            <div className="bg-primary/50 rounded-lg p-3">
              <div className="text-xs text-secondary-foreground mb-1 flex items-center gap-1">
                <Clock size={14} /> Elapsed
              </div>
              <div className="text-2xl font-bold text-aerospace-accent">
                {Math.floor(state.elapsedTime)}s
              </div>
            </div>
            <div className="bg-primary/50 rounded-lg p-3">
              <div className="text-xs text-secondary-foreground mb-1 flex items-center gap-1">
                <Gauge size={14} /> Remaining
              </div>
              <div className="text-2xl font-bold text-aerospace-success">
                {Math.ceil(state.estimatedTimeRemaining)}s
              </div>
            </div>
            <div className="bg-primary/50 rounded-lg p-3">
              <div className="text-xs text-secondary-foreground mb-1 flex items-center gap-1">
                <TrendingUp size={14} /> Convergence
              </div>
              <div className="text-2xl font-bold text-aerospace-warning">
                {state.results?.convergence.toFixed(1) || 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {state.results && (
          <div className="p-6 border-b border-aerospace-blue/10">
            <h4 className="text-sm font-medium text-foreground mb-4">Aerodynamic Coefficients</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/50 rounded-lg p-4">
                <div className="text-xs text-secondary-foreground mb-2">Drag Coefficient</div>
                <div className="text-3xl font-bold text-aerospace-blue font-mono">
                  {state.results.dragCoefficient.toFixed(4)}
                </div>
              </div>
              <div className="bg-primary/50 rounded-lg p-4">
                <div className="text-xs text-secondary-foreground mb-2">Lift Coefficient</div>
                <div className="text-3xl font-bold text-aerospace-accent font-mono">
                  {state.results.liftCoefficient.toFixed(4)}
                </div>
              </div>
              <div className="bg-primary/50 rounded-lg p-4">
                <div className="text-xs text-secondary-foreground mb-2">Pressure Coefficient</div>
                <div className="text-3xl font-bold text-aerospace-success font-mono">
                  {state.results.pressureCoefficient.toFixed(4)}
                </div>
              </div>
              <div className="bg-primary/50 rounded-lg p-4">
                <div className="text-xs text-secondary-foreground mb-2">Wall Shear Stress</div>
                <div className="text-3xl font-bold text-aerospace-warning font-mono">
                  {state.results.wallShearStress.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-6 flex items-center justify-between bg-primary/50 border-t border-aerospace-blue/10">
          <div className="flex gap-2">
            {!state.isRunning ? (
              <button
                onClick={handleStartSimulation}
                className="px-4 py-2 bg-aerospace-blue hover:bg-aerospace-blue/80 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                <Play size={18} />
                Start
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseResume}
                  className="px-4 py-2 bg-aerospace-accent hover:bg-aerospace-accent/80 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  {state.isPaused ? <Play size={18} /> : <Pause size={18} />}
                  {state.isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-aerospace-danger hover:bg-aerospace-danger/80 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  Stop
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg bg-aerospace-success/20 hover:bg-aerospace-success/30 text-aerospace-success transition-colors"
              title="Export"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full bg-gradient-to-br from-aerospace-dark to-primary rounded-lg border border-aerospace-blue/20 p-6"
        >
          <h4 className="text-lg font-heading font-bold text-foreground mb-4">Simulation Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-secondary-foreground mb-2 block">Reynolds Number</label>
              <input
                type="number"
                value={parameters.reynoldsNumber}
                onChange={(e) => handleParameterChange('reynoldsNumber', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-primary/50 border border-aerospace-blue/20 rounded-lg text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-2 block">Mach Number</label>
              <input
                type="number"
                step="0.01"
                value={parameters.machNumber}
                onChange={(e) => handleParameterChange('machNumber', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-primary/50 border border-aerospace-blue/20 rounded-lg text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-2 block">Angle of Attack (°)</label>
              <input
                type="number"
                value={parameters.angleOfAttack}
                onChange={(e) => handleParameterChange('angleOfAttack', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-primary/50 border border-aerospace-blue/20 rounded-lg text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-secondary-foreground mb-2 block">Mesh Size</label>
              <input
                type="number"
                value={parameters.meshSize}
                onChange={(e) => handleParameterChange('meshSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-primary/50 border border-aerospace-blue/20 rounded-lg text-foreground"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Validation Report */}
      {state.validationResult && (
        <ValidationReportPanel
          result={state.validationResult}
          title="Simulation Validation Report"
          onExport={handleExport}
        />
      )}
    </div>
  );
}
