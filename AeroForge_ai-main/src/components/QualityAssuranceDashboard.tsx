import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import QualityAssuranceService, { ValidationResult } from '@/services/qualityAssuranceService';

export default function QualityAssuranceDashboard() {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runQA = async () => {
    setIsRunning(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const qaResults = QualityAssuranceService.runComprehensiveQA();
    setResults(qaResults);
    setLastRun(new Date());
    setIsRunning(false);
  };

  useEffect(() => {
    runQA();
  }, []);

  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const warnings = results.filter((r) => r.status === 'warning').length;
  const total = results.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-aerospace-success" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-aerospace-danger" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-aerospace-warning" />;
      default:
        return null;
    }
  };

  const overallStatus = failed === 0 ? 'Production Ready' : 'Requires Attention';
  const overallColor = failed === 0 ? 'text-aerospace-success' : 'text-aerospace-danger';

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Quality Assurance</h2>
          <p className="text-foreground/70 text-sm mt-1">Production-grade validation suite</p>
        </div>
        <button
          onClick={runQA}
          disabled={isRunning}
          className="px-4 py-2 bg-aerospace-blue text-white font-mono text-sm font-bold rounded-lg hover:bg-aerospace-accent disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run QA Suite'}
        </button>
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-primary border border-secondary/20 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`font-heading text-2xl font-bold ${overallColor}`}>{overallStatus}</p>
            <p className="text-sm text-foreground/60 mt-1 font-mono">
              {lastRun && `Last run: ${lastRun.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-aerospace-blue">{passed}/{total}</p>
            <p className="text-xs text-foreground/60 font-mono">Tests Passed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-foreground/60 font-mono">
            <span>Overall Progress</span>
            <span>{Math.round((passed / total) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-primary/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(passed / total) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-aerospace-success to-aerospace-blue"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Passed', value: passed, color: 'text-aerospace-success', bg: 'bg-aerospace-success/10' },
          { label: 'Warnings', value: warnings, color: 'text-aerospace-warning', bg: 'bg-aerospace-warning/10' },
          { label: 'Failed', value: failed, color: 'text-aerospace-danger', bg: 'bg-aerospace-danger/10' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 ${stat.bg} border border-secondary/20 rounded-lg text-center`}
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-foreground/60 mt-1 font-mono">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-2">
        <h3 className="font-heading font-bold text-foreground">Test Results</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="p-3 bg-primary border border-secondary/20 rounded-lg flex items-start gap-3 hover:border-secondary/50 transition-colors"
            >
              <div className="mt-1">{getStatusIcon(result.status)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm text-foreground font-bold">{result.tool}</p>
                <p className="text-xs text-foreground/70 mt-1">{result.message}</p>
              </div>
              <div className="text-xs text-foreground/50 font-mono whitespace-nowrap">
                {result.timestamp.toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* QA Report */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-primary/50 border border-secondary/20 rounded-lg"
      >
        <details className="cursor-pointer">
          <summary className="font-mono text-sm text-aerospace-blue hover:text-aerospace-accent transition-colors">
            View Full QA Report
          </summary>
          <pre className="mt-4 text-xs text-foreground/70 overflow-x-auto bg-aerospace-dark/50 p-3 rounded border border-secondary/20 font-mono">
            {QualityAssuranceService.generateQAReport(results)}
          </pre>
        </details>
      </motion.div>

      {/* Certification Badge */}
      {failed === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-r from-aerospace-success/10 to-aerospace-blue/10 border border-aerospace-success/30 rounded-lg text-center"
        >
          <p className="font-heading text-lg font-bold text-aerospace-success mb-2">
            ✓ Production Certified
          </p>
          <p className="text-sm text-foreground/80">
            All quality assurance tests passed. System is ready for production deployment.
          </p>
        </motion.div>
      )}
    </div>
  );
}
