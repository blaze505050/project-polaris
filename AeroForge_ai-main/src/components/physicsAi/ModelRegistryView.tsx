import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Shield, Cpu, BookOpen, Layers, X, Filter, Play } from 'lucide-react';
import { ModelCard, ModelStatus, ModelCategory } from '@/types/physicsAi';
import { MODEL_REGISTRY } from '@/services/physicsAi/modelRegistryData';
import ModelInspectionModal from './ModelInspectionModal';

interface Props {
  onRunInAeroForge?: (modelId: string) => void;
}

export default function ModelRegistryView({ onRunInAeroForge }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedModel, setSelectedModel] = useState<ModelCard | null>(null);

  const filteredModels = MODEL_REGISTRY.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.architecture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: ModelStatus) => {
    switch (status) {
      case 'LIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PROTOTYPE':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'RESEARCH':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'PLANNED':
        return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const handleRunModel = (modelId: string) => {
    if (onRunInAeroForge) {
      onRunInAeroForge(modelId);
    } else {
      window.location.href = `/physics-ai?tab=experiment&model=${modelId}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0A1020] p-4 rounded-xl border border-white/10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search neural operators, architectures, domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#060B18] border border-white/10 rounded-lg text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
          <span className="text-[10px] text-white/40 uppercase mr-1">Status:</span>
          {['ALL', 'LIVE', 'PROTOTYPE', 'RESEARCH', 'PLANNED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] transition-all border ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A1020] border border-white/10 rounded-xl p-5 shadow-xl hover:border-cyan-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-0.5">
                    {model.category}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{model.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getStatusBadge(model.status)}`}>
                  {model.status === 'LIVE' ? 'LIVE IN AEROFORGE' : model.status}
                </span>
              </div>

              <p className="text-xs text-white/60 line-clamp-2 mb-4 leading-relaxed font-sans">
                {model.description}
              </p>

              <div className="space-y-2 bg-[#060B18] p-3 rounded-lg border border-white/5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Architecture:</span>
                  <span className="text-white/80 truncate max-w-[170px]" title={model.architecture}>
                    {model.architecture}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Application:</span>
                  <span className="text-cyan-300 truncate max-w-[170px]" title={model.aeroforgeApplication}>
                    {model.aeroforgeApplication}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">License:</span>
                  <span className="text-purple-300">{model.license}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Run in AeroForge & Inspect Model */}
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs gap-2">
              <button
                onClick={() => setSelectedModel(model)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded transition-all font-bold text-[11px]"
              >
                Inspect Model
              </button>

              <button
                onClick={() => handleRunModel(model.id)}
                className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded transition-all font-bold text-[11px] flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-cyan-300" />
                Run in AeroForge
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Model Inspection Modal */}
      {selectedModel && (
        <ModelInspectionModal
          model={selectedModel}
          isOpen={!!selectedModel}
          onClose={() => setSelectedModel(null)}
          onRunInAeroForge={handleRunModel}
        />
      )}
    </div>
  );
}
