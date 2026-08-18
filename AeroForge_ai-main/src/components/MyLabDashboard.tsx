/**
 * MY LAB DASHBOARD
 * View and manage saved experiments
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMyLabStore, ExperimentData } from '@/stores/myLabStore';
import { formatDistanceToNow } from 'date-fns';

export default function MyLabDashboard() {
  const experiments = useMyLabStore((s) => s.experiments);
  const deleteExperiment = useMyLabStore((s) => s.deleteExperiment);
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentData | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Delete this experiment?')) {
      deleteExperiment(id);
    }
  };

  const handleExport = (experiment: ExperimentData) => {
    const json = JSON.stringify(experiment, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experiment.name}-${experiment.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const typeColors = {
    orbital: 'bg-blue-500/20 text-blue-300',
    gravity: 'bg-purple-500/20 text-purple-300',
    transit: 'bg-green-500/20 text-green-300',
    stellar: 'bg-yellow-500/20 text-yellow-300',
  };

  if (experiments.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="p-12 text-center space-y-4">
          <h2 className="text-2xl font-heading font-semibold">My Lab is Empty</h2>
          <p className="text-secondary-foreground">
            Run simulations and save experiments to see them here
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-heading">My Lab</h1>
        <p className="text-secondary-foreground">
          {experiments.length} saved experiment{experiments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experiments List */}
        <div className="lg:col-span-2 space-y-3">
          {experiments.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className="p-4 cursor-pointer hover:border-accent transition-colors"
                onClick={() => setSelectedExperiment(exp)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-heading font-semibold truncate">
                        {exp.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          typeColors[exp.type]
                        }`}
                      >
                        {exp.type}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-foreground mb-2">
                      {exp.notes}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      {formatDistanceToNow(new Date(exp.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExperiment(exp);
                      }}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(exp);
                      }}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp.id);
                      }}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Details Panel */}
        <div>
          {selectedExperiment ? (
            <Card className="p-6 space-y-4 sticky top-6">
              <h3 className="text-lg font-heading font-semibold">
                {selectedExperiment.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-secondary-foreground text-xs mb-1">Type</p>
                  <p className="font-semibold capitalize">{selectedExperiment.type}</p>
                </div>
                <div>
                  <p className="text-secondary-foreground text-xs mb-1">Created</p>
                  <p className="font-semibold">
                    {new Date(selectedExperiment.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-foreground text-xs mb-1">Notes</p>
                  <p className="font-semibold">{selectedExperiment.notes}</p>
                </div>
                <div className="pt-4 border-t border-secondary">
                  <p className="text-secondary-foreground text-xs mb-2">Data Summary</p>
                  <pre className="text-xs bg-primary p-2 rounded overflow-auto max-h-48">
                    {JSON.stringify(selectedExperiment.data, null, 2)}
                  </pre>
                </div>
              </div>
              <Button
                onClick={() => handleExport(selectedExperiment)}
                className="w-full gap-2"
              >
                <Download className="w-4 h-4" /> Export
              </Button>
            </Card>
          ) : (
            <Card className="p-6 text-center text-secondary-foreground">
              <p>Select an experiment to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
