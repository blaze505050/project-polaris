import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Cpu,
  Database,
  BarChart3,
  CheckCircle2,
  Settings,
  Share2,
  Download,
  Folder,
  Layers,
  Activity,
  Zap,
  Tag,
  Clock,
  User,
  Shield,
  FileCheck,
  FlaskConical,
  Play,
  ArrowRight,
  GitBranch,
  HelpCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';
import AICopilotSidebar from '@/components/AICopilotSidebar';
import EngineeringNotebook from '@/components/EngineeringNotebook';
import SimulationManager from '@/components/SimulationManager';
import DatasetManager from '@/components/DatasetManager';
import ResultsViewer from '@/components/ResultsViewer';
import ValidationReportGenerator from '@/components/ValidationReportGenerator';
import EngineeringTable, { ColumnDef } from '@/components/ui/EngineeringTable';
import GuidedEngineeringDemo from '@/components/GuidedEngineeringDemo';
import UniversalComparison from '@/components/UniversalComparison';
import DigitalThreadProvenance from '@/components/DigitalThreadProvenance';
import ProjectOnboardingModal from '@/components/ProjectOnboardingModal';

interface RequirementItem {
  id: string;
  code: string;
  category: string;
  specification: string;
  targetValue: string;
  currentValue: string;
  status: 'VERIFIED' | 'IN_PROGRESS' | 'FAILED';
}

export default function ProjectWorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentProject, projects, setCurrentProject, workspace, updateWorkspaceTab, addRequirement } = useProjectStore();
  const [showCopilot, setShowCopilot] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Sync active project by URL parameter
  const activeProject = useMemo(() => {
    if (projectId) {
      const found = projects.find((p) => p._id === projectId);
      if (found) return found;
    }
    return currentProject || projects[0] || null;
  }, [projectId, projects, currentProject]);

  useEffect(() => {
    if (activeProject && currentProject?._id !== activeProject._id) {
      setCurrentProject(activeProject);
    }
  }, [activeProject, currentProject, setCurrentProject]);

  const initialTab = searchParams.get('tab') || workspace?.activeTab || 'overview';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    updateWorkspaceTab(tabId as any);
  };

  const requirements: RequirementItem[] = (activeProject?.requirements || []).map((r) => ({
    id: r.id,
    code: r.code,
    category: r.category,
    specification: r.specification,
    targetValue: r.targetValue,
    currentValue: r.currentValue,
    status: r.status,
  }));

  const reqColumns: ColumnDef<RequirementItem>[] = [
    { key: 'code', header: 'Req Code', accessor: (r) => r.code, width: '120px' },
    { key: 'category', header: 'Category', accessor: (r) => r.category, width: '120px' },
    { key: 'specification', header: 'Engineering Spec', accessor: (r) => r.specification },
    { key: 'targetValue', header: 'Target Value', accessor: (r) => r.targetValue, width: '120px' },
    { key: 'currentValue', header: 'Current Value', accessor: (r) => r.currentValue, width: '150px' },
    {
      key: 'status',
      header: 'Compliance',
      accessor: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
            r.status === 'VERIFIED'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {r.status}
        </span>
      ),
      width: '120px',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: Folder },
    { id: 'requirements', label: 'Requirements Matrix', icon: FileCheck },
    { id: 'comparison', label: 'Design Comparison', icon: Layers },
    { id: 'provenance', label: 'Digital Thread', icon: GitBranch },
    { id: 'notebook', label: 'Engineering Notebook', icon: BookOpen },
    { id: 'simulations', label: 'Simulation Manager', icon: Cpu },
    { id: 'datasets', label: 'Datasets & CAD', icon: Database },
    { id: 'results', label: 'Results & Visuals', icon: BarChart3 },
    { id: 'validation', label: 'Validation Sign-off', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6 space-y-6">
          {/* Top Guided Demo / Quick Onboarding Bar */}
          <div className="bg-gradient-to-r from-cyan-500/10 via-[#080E1C] to-purple-500/10 border border-cyan-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-white">
                Pre-Launch Engineering Demo & Pathways
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="px-3 py-1 rounded border border-white/20 hover:border-white/40 text-xs font-bold transition-colors"
              >
                Onboarding & Templates
              </button>
              <button
                onClick={() => setShowDemoModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch 5-Min Guided Demo</span>
              </button>
            </div>
          </div>

          {/* Project Headquarters Banner */}
          <div className="bg-[#080E1C] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    PROJECT HEADQUARTERS
                  </span>
                  <span className="text-[10px] text-white/40">ID: PRJ-2026-HYPER-04</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {currentProject?.name || 'Hypersonic UAV Aerodynamics & Structural Optimization'}
                </h1>
                <p className="text-xs text-white/60 font-sans max-w-3xl leading-relaxed">
                  {currentProject?.description ||
                    'Multi-physics design iteration suite evaluating Mach 5.0 boundary layer shockwave dynamics, aerothermal heat flux, and wing-root FEA stress margins.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs transition-colors">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Share Result Link</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Package</span>
                </button>
              </div>
            </div>

            {/* Project Status & Health Indicator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-white/40 block text-[10px]">PROJECT HEALTH INDEX:</span>
                <span className="text-emerald-400 font-bold text-sm block">84% (Verified)</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">REQUIREMENTS VERIFIED:</span>
                <span className="text-cyan-300 font-bold block mt-0.5">2 of 3 (67%)</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">ACTIVE SOLVERS:</span>
                <span className="text-pink-400 font-bold block mt-0.5">2 Jobs Running</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">DIGITAL THREAD REVISION:</span>
                <span className="text-amber-400 font-bold block mt-0.5">v0.8.4 (AS9100)</span>
              </div>
            </div>

            {/* Sub-Workspace Navigation Tabs */}
            <div className="flex items-center gap-1 border-t border-white/10 pt-3 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guided Demo Component Modal View */}
          {showDemoModal && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="text-xs text-white/50 hover:text-white underline"
                >
                  Close Guided Demo
                </button>
              </div>
              <GuidedEngineeringDemo onComplete={() => setShowDemoModal(false)} />
            </div>
          )}

          {/* Active Tab Workspace Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* INTELLIGENT NEXT BEST ACTION WIDGET */}
                <div className="bg-[#080E1C] border border-amber-500/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        RECOMMENDED NEXT BEST ACTION
                      </span>
                      <p className="text-xs text-white/90 font-sans mt-0.5">
                        Latest CFD Case 04 achieved a <strong>-7.4% drag reduction</strong>, but structural wing-root yield margin remains unverified for Design v0.8.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTabChange('simulations')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shrink-0"
                  >
                    <span>Run Structural FEA Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <EngineeringTable
                      title="Design Requirements & Compliance Matrix"
                      description="Live verification tracking linked to CFD, FEA, and thermal solver outputs."
                      data={requirements}
                      columns={reqColumns}
                      keyExtractor={(r) => r.id}
                    />

                    {/* Universal Comparison Preview Embed */}
                    <UniversalComparison />
                  </div>

                  {/* Right Column: AI Insights & Digital Thread Summary */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <h3 className="font-bold text-xs text-white uppercase">AI COPILOT ANALYSIS</h3>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed font-sans">
                        "Based on CFD Case 04 results, the pressure coefficient gradient near the wing root indicates micro-separation at Mach 0.88. Recommend smoothing leading-edge radius by 0.4mm."
                      </p>
                      <button
                        onClick={() => setShowCopilot(true)}
                        className="w-full py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-colors"
                      >
                        Ask Copilot for Details
                      </button>
                    </div>

                    {/* Provenance Tree Embed */}
                    <DigitalThreadProvenance />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <EngineeringTable
                title="System Engineering Requirements Matrix"
                description="AS9100 Rev D requirement tracking and test verification logs."
                data={requirements}
                columns={reqColumns}
                keyExtractor={(r) => r.id}
              />
            )}

            {activeTab === 'comparison' && <UniversalComparison />}

            {activeTab === 'provenance' && <DigitalThreadProvenance />}

            {activeTab === 'notebook' && <EngineeringNotebook projectId={projectId} />}

            {activeTab === 'simulations' && <SimulationManager projectId={projectId} />}

            {activeTab === 'datasets' && <DatasetManager projectId={projectId!} />}

            {activeTab === 'results' && <ResultsViewer projectId={projectId!} />}

            {activeTab === 'validation' && (
              <ValidationReportGenerator projectId={projectId!} />
            )}
          </div>
        </main>
      </div>

      <Footer />

      <AICopilotSidebar
        projectId={projectId}
        isOpen={showCopilot}
        onToggle={setShowCopilot}
      />

      <ProjectOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onLaunchDemo={() => setShowDemoModal(true)}
      />
    </div>
  );
}
