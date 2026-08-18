import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Download, Share2, RefreshCw, FileText } from 'lucide-react';

interface ValidationCheck {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
  details?: string;
}

interface ValidationReport {
  id: string;
  name: string;
  simulationId: string;
  timestamp: Date;
  overallStatus: 'passed' | 'warning' | 'failed';
  checks: ValidationCheck[];
  score: number;
}

interface ValidationReportGeneratorProps {
  projectId: string;
}

export default function ValidationReportGenerator({ projectId }: ValidationReportGeneratorProps) {
  const [reports, setReports] = useState<ValidationReport[]>([
    {
      id: '1',
      name: 'Airfoil CFD Validation',
      simulationId: '1',
      timestamp: new Date(Date.now() - 3600000),
      overallStatus: 'passed',
      score: 94,
      checks: [
        {
          id: '1',
          name: 'Mesh Quality',
          category: 'Geometry',
          status: 'passed',
          message: 'Mesh quality metrics within acceptable range',
          details: 'Aspect ratio: 1.2-45.8, Skewness: 0.15-0.82',
        },
        {
          id: '2',
          name: 'Convergence',
          category: 'Simulation',
          status: 'passed',
          message: 'Solution converged after 2847 iterations',
          details: 'Residuals: < 1e-5',
        },
        {
          id: '3',
          name: 'Physical Bounds',
          category: 'Results',
          status: 'passed',
          message: 'All results within expected physical bounds',
          details: 'Pressure: 95-105 kPa, Velocity: 40-50 m/s',
        },
        {
          id: '4',
          name: 'Mass Conservation',
          category: 'Physics',
          status: 'warning',
          message: 'Mass conservation error: 0.8%',
          details: 'Acceptable but monitor for larger domains',
        },
      ],
    },
    {
      id: '2',
      name: 'Structural Analysis Validation',
      simulationId: '2',
      timestamp: new Date(Date.now() - 7200000),
      overallStatus: 'warning',
      score: 82,
      checks: [
        {
          id: '1',
          name: 'Boundary Conditions',
          category: 'Setup',
          status: 'passed',
          message: 'Boundary conditions properly defined',
        },
        {
          id: '2',
          name: 'Material Properties',
          category: 'Material',
          status: 'passed',
          message: 'Material properties verified',
        },
        {
          id: '3',
          name: 'Stress Singularities',
          category: 'Results',
          status: 'warning',
          message: 'Potential stress singularities detected near fixed support',
          details: 'Consider refining mesh in this region',
        },
      ],
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);

  const getStatusIcon = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="w-5 h-5 text-aerospace-success" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-aerospace-warning" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-aerospace-danger" />;
    }
  };

  const getStatusColor = (status: ValidationCheck['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-aerospace-success/10 text-aerospace-success';
      case 'warning':
        return 'bg-aerospace-warning/10 text-aerospace-warning';
      case 'failed':
        return 'bg-aerospace-danger/10 text-aerospace-danger';
    }
  };

  const getOverallStatusColor = (status: ValidationReport['overallStatus']) => {
    switch (status) {
      case 'passed':
        return 'border-aerospace-success';
      case 'warning':
        return 'border-aerospace-warning';
      case 'failed':
        return 'border-aerospace-danger';
    }
  };

  const selectedReportData = reports.find(r => r.id === selectedReport);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-primary border border-secondary/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="text-secondary-foreground">Total Reports</p>
            <p className="text-2xl font-bold text-foreground">{reports.length}</p>
          </div>
          <div className="w-px h-8 bg-secondary/20" />
          <div className="text-sm">
            <p className="text-secondary-foreground">Passed</p>
            <p className="text-2xl font-bold text-aerospace-success">
              {reports.filter(r => r.overallStatus === 'passed').length}
            </p>
          </div>
          <div className="text-sm">
            <p className="text-secondary-foreground">Warnings</p>
            <p className="text-2xl font-bold text-aerospace-warning">
              {reports.filter(r => r.overallStatus === 'warning').length}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-aerospace-blue hover:bg-aerospace-accent text-white rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
          Generate Report
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="space-y-2">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedReport(report.id)}
              className={`bg-primary border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedReport === report.id
                  ? `border-aerospace-blue bg-primary/80`
                  : `border-secondary/20 hover:border-secondary/40`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {report.overallStatus === 'passed' && (
                    <CheckCircle2 className="w-5 h-5 text-aerospace-success" />
                  )}
                  {report.overallStatus === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-aerospace-warning" />
                  )}
                  {report.overallStatus === 'failed' && (
                    <XCircle className="w-5 h-5 text-aerospace-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium truncate">{report.name}</h3>
                  <p className="text-xs text-secondary-foreground mt-1">
                    {report.timestamp.toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-aerospace-dark rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          report.score >= 90
                            ? 'bg-aerospace-success'
                            : report.score >= 70
                            ? 'bg-aerospace-warning'
                            : 'bg-aerospace-danger'
                        }`}
                        style={{ width: `${report.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{report.score}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Details */}
        <div className="lg:col-span-2">
          {selectedReportData ? (
            <motion.div
              key={selectedReport}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-primary border-2 rounded-lg p-6 ${getOverallStatusColor(selectedReportData.overallStatus)}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedReportData.name}</h2>
                  <p className="text-secondary-foreground mt-1">
                    Generated {selectedReportData.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-secondary/20 rounded transition-colors text-secondary-foreground hover:text-foreground">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Score Card */}
              <div className="bg-aerospace-dark rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-foreground text-sm mb-1">Validation Score</p>
                    <p className="text-4xl font-bold text-foreground">{selectedReportData.score}%</p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-aerospace-blue flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-aerospace-blue">{selectedReportData.score}</p>
                      <p className="text-xs text-secondary-foreground">Score</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checks */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">Validation Checks</h3>
                {selectedReportData.checks.map((check) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-aerospace-dark rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        {getStatusIcon(check.status)}
                        <div>
                          <p className="text-foreground font-medium">{check.name}</p>
                          <p className="text-xs text-secondary-foreground">{check.category}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                      </span>
                    </button>

                    {expandedCheck === check.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 border-t border-secondary/20"
                      >
                        <p className="text-foreground mt-3 mb-2">{check.message}</p>
                        {check.details && (
                          <p className="text-sm text-secondary-foreground font-mono bg-aerospace-dark/50 p-2 rounded">
                            {check.details}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-primary border border-secondary/20 rounded-lg p-12 text-center"
            >
              <FileText className="w-12 h-12 text-secondary-foreground mx-auto mb-4 opacity-50" />
              <p className="text-secondary-foreground">Select a report to view details</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
