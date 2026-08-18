import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, ChevronDown, Download, Share2, TrendingUp } from 'lucide-react';
import { ValidationResult } from '@/services/validationService';

interface ValidationReportPanelProps {
  result: ValidationResult;
  title: string;
  onExport?: () => void;
  onShare?: () => void;
}

export default function ValidationReportPanel({
  result,
  title,
  onExport,
  onShare,
}: ValidationReportPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['comparison']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle2 className="w-5 h-5 text-aerospace-success" />;
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-aerospace-success" />;
      case 'acceptable':
        return <AlertCircle className="w-5 h-5 text-aerospace-warning" />;
      case 'poor':
        return <XCircle className="w-5 h-5 text-aerospace-danger" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-aerospace-success/10 border-aerospace-success/30';
      case 'good':
        return 'bg-aerospace-success/10 border-aerospace-success/30';
      case 'acceptable':
        return 'bg-aerospace-warning/10 border-aerospace-warning/30';
      case 'poor':
        return 'bg-aerospace-danger/10 border-aerospace-danger/30';
      default:
        return 'bg-primary/50 border-aerospace-blue/20';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-aerospace-success';
    if (accuracy >= 85) return 'text-aerospace-success';
    if (accuracy >= 75) return 'text-aerospace-warning';
    return 'text-aerospace-danger';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-aerospace-dark to-primary rounded-lg border border-aerospace-blue/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-aerospace-blue/10 to-aerospace-accent/10 border-b border-aerospace-blue/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground">{title}</h3>
            <p className="text-secondary-foreground text-sm mt-1">
              Validation Report - Physics Accuracy Analysis
            </p>
          </div>
          <div className="flex gap-2">
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 rounded-lg bg-aerospace-blue/20 hover:bg-aerospace-blue/30 text-aerospace-blue transition-colors"
                title="Export Report"
              >
                <Download size={18} />
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-lg bg-aerospace-accent/20 hover:bg-aerospace-accent/30 text-aerospace-accent transition-colors"
                title="Share Report"
              >
                <Share2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Accuracy Score */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-3xl font-bold font-heading ${getAccuracyColor(result.accuracy)}`}>
                {result.accuracy.toFixed(1)}%
              </span>
              <span className="text-secondary-foreground text-sm">Accuracy</span>
            </div>
            <div className="w-full bg-primary/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${result.accuracy}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${
                  result.accuracy >= 85
                    ? 'bg-aerospace-success'
                    : result.accuracy >= 75
                    ? 'bg-aerospace-warning'
                    : 'bg-aerospace-danger'
                }`}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {result.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-aerospace-success" />
              ) : (
                <XCircle className="w-5 h-5 text-aerospace-danger" />
              )}
              <span className="text-sm font-medium">
                {result.isValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            <div className="text-xs text-secondary-foreground">
              {result.errors.length} errors, {result.warnings.length} warnings
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="divide-y divide-aerospace-blue/10">
        {/* Comparison Section */}
        <motion.div className="border-b border-aerospace-blue/10">
          <button
            onClick={() => toggleSection('comparison')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-aerospace-blue" />
              <span className="font-medium text-foreground">Real-World Comparison</span>
              <span className="text-xs text-secondary-foreground">
                ({result.comparisonWithRealData.length} parameters)
              </span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.has('comparison') ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-secondary-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.has('comparison') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 bg-primary/30 space-y-3"
              >
                {result.comparisonWithRealData.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-3 rounded-lg border ${getStatusColor(item.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="font-medium text-foreground">{item.parameter}</span>
                      </div>
                      <span className={`text-sm font-mono ${
                        item.deviation <= 5 ? 'text-aerospace-success' :
                        item.deviation <= 15 ? 'text-aerospace-warning' :
                        'text-aerospace-danger'
                      }`}>
                        {item.deviation.toFixed(1)}% deviation
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-secondary-foreground">Simulated</span>
                        <div className="font-mono text-foreground">{item.simulated.toFixed(4)}</div>
                      </div>
                      <div>
                        <span className="text-secondary-foreground">Real-World</span>
                        <div className="font-mono text-foreground">{item.realWorld.toFixed(4)}</div>
                      </div>
                      <div>
                        <span className="text-secondary-foreground">Status</span>
                        <div className="font-mono text-foreground capitalize">{item.status}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Errors Section */}
        {result.errors.length > 0 && (
          <motion.div>
            <button
              onClick={() => toggleSection('errors')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-aerospace-danger" />
                <span className="font-medium text-foreground">Errors</span>
                <span className="text-xs text-aerospace-danger">({result.errors.length})</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('errors') ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-secondary-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.has('errors') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-4 bg-aerospace-danger/10 space-y-2"
                >
                  {result.errors.map((error, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-3 text-sm text-foreground"
                    >
                      <span className="text-aerospace-danger mt-1">•</span>
                      <span>{error}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Warnings Section */}
        {result.warnings.length > 0 && (
          <motion.div>
            <button
              onClick={() => toggleSection('warnings')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-aerospace-warning" />
                <span className="font-medium text-foreground">Warnings</span>
                <span className="text-xs text-aerospace-warning">({result.warnings.length})</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('warnings') ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-secondary-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.has('warnings') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-4 bg-aerospace-warning/10 space-y-2"
                >
                  {result.warnings.map((warning, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-3 text-sm text-foreground"
                    >
                      <span className="text-aerospace-warning mt-1">•</span>
                      <span>{warning}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Recommendations Section */}
        {result.recommendations.length > 0 && (
          <motion.div>
            <button
              onClick={() => toggleSection('recommendations')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-aerospace-success" />
                <span className="font-medium text-foreground">Recommendations</span>
                <span className="text-xs text-aerospace-success">({result.recommendations.length})</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.has('recommendations') ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-secondary-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.has('recommendations') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-4 bg-aerospace-success/10 space-y-2"
                >
                  {result.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-3 text-sm text-foreground"
                    >
                      <span className="text-aerospace-success mt-1">✓</span>
                      <span>{rec}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
