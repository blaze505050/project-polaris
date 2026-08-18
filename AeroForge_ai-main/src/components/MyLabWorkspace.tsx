import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download, Eye, Plus, Search } from 'lucide-react';
import { useAstroLabStore, ExperimentData } from '@/stores/astrolabStore';
import { BaseCrudService } from '@/integrations';
import { Experiments } from '@/entities';

export default function MyLabWorkspace() {
  const { experiments, addExperiment, deleteExperiment, selectExperiment } = useAstroLabStore();
  const [savedExperiments, setSavedExperiments] = useState<Experiments[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        const result = await BaseCrudService.getAll<Experiments>('experiments', [], { limit: 50 });
        setSavedExperiments(result.items);
      } catch (error) {
        console.error('Error loading experiments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExperiments();
  }, []);

  const filteredExperiments = savedExperiments.filter((exp) =>
    exp.experimentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveExperiment = async (experiment: ExperimentData) => {
    try {
      await BaseCrudService.create('experiments', {
        _id: experiment.id,
        experimentName: experiment.name,
        parameters: JSON.stringify(experiment.parameters),
        results: JSON.stringify(experiment.results),
        conductedAt: experiment.timestamp,
        userNotes: experiment.notes,
        status: experiment.status,
      });
      addExperiment(experiment);
    } catch (error) {
      console.error('Error saving experiment:', error);
    }
  };

  const handleDeleteExperiment = async (id: string) => {
    try {
      await BaseCrudService.delete('experiments', id);
      deleteExperiment(id);
      setSavedExperiments(savedExperiments.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error('Error deleting experiment:', error);
    }
  };

  const handleExportExperiment = (experiment: Experiments) => {
    const data = {
      name: experiment.experimentName,
      parameters: experiment.parameters,
      results: experiment.results,
      notes: experiment.userNotes,
      date: experiment.conductedAt,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${experiment.experimentName}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">My Lab Workspace</h2>
            <p className="text-foreground/70 text-sm mt-1">
              Save, manage, and review your experiments
            </p>
          </div>
          <button className="px-4 py-2 bg-aerospace-blue text-white font-mono text-sm font-bold rounded-lg hover:bg-aerospace-accent transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Experiment
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-aerospace-blue/50"
          />
        </div>
      </div>

      {/* Experiments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-foreground/60 font-mono text-sm">Loading experiments...</div>
        </div>
      ) : filteredExperiments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-primary border border-secondary/20 rounded-lg">
          <Eye className="w-12 h-12 text-foreground/30 mb-4" />
          <p className="text-foreground/60 font-mono text-sm">No experiments yet</p>
          <p className="text-foreground/40 text-xs mt-1">Create your first experiment to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExperiments.map((experiment, idx) => (
            <motion.div
              key={experiment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-primary border border-secondary/30 rounded-lg hover:border-aerospace-blue/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-foreground truncate">
                    {experiment.experimentName}
                  </h3>
                  <p className="text-xs text-foreground/60 mt-1 font-mono">
                    Status: <span className="text-aerospace-success">{experiment.status}</span>
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">
                    {experiment.conductedAt
                      ? new Date(experiment.conductedAt).toLocaleDateString()
                      : 'No date'}
                  </p>
                  {experiment.userNotes && (
                    <p className="text-xs text-foreground/60 mt-2 line-clamp-2">
                      {experiment.userNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleExportExperiment(experiment)}
                    className="p-2 hover:bg-aerospace-blue/20 rounded transition-colors"
                    title="Export"
                  >
                    <Download className="w-4 h-4 text-aerospace-blue" />
                  </button>
                  <button
                    onClick={() => handleDeleteExperiment(experiment._id!)}
                    className="p-2 hover:bg-aerospace-danger/20 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-aerospace-danger" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Experiments', value: filteredExperiments.length },
          { label: 'Completed', value: filteredExperiments.filter((e) => e.status === 'completed').length },
          { label: 'In Progress', value: filteredExperiments.filter((e) => e.status === 'running').length },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="p-4 bg-primary border border-secondary/20 rounded-lg text-center"
          >
            <p className="text-2xl font-bold text-aerospace-blue">{stat.value}</p>
            <p className="text-xs text-foreground/60 mt-1 font-mono">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
