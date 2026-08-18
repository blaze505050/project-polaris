import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Cpu,
  CheckCircle2,
  Rocket,
  Plus,
  FolderOpen,
  Wind,
  Wrench,
  Globe,
  BookOpen,
  ArrowRight,
  Sparkles,
  FlaskConical,
  BarChart3,
} from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommandCenterSidebar from '@/components/CommandCenterSidebar';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { projects } = useProjectStore();

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter(
    (p) => p.status === 'completed'
  ).length;

  const quickLaunch = [
    {
      label: 'New Project',
      icon: Plus,
      path: '/projects',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      desc: 'Start an engineering project',
    },
    {
      label: 'AeroLab',
      icon: Wind,
      path: '/aerolab',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      desc: 'Airfoil analysis & propulsion',
    },
    {
      label: 'MechLab',
      icon: Wrench,
      path: '/mechlab',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      desc: 'Structures & materials',
    },
    {
      label: 'AstroLab',
      icon: Globe,
      path: '/astrolab',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      desc: 'Space & orbital mechanics',
    },
    {
      label: 'Documentation',
      icon: BookOpen,
      path: '/documentation',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      desc: 'Guides & reference',
    },
  ];

  const platformFeatures = [
    {
      name: 'Projects & Workspaces',
      status: 'Available',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'Airfoil Analysis (NACA)',
      status: 'Available',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'Propulsion Calculator',
      status: 'Available',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'ISA Atmosphere Model',
      status: 'Available',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'Engineering Notebook',
      status: 'Available',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      name: 'Simulation Manager',
      status: 'Beta',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      name: 'Orbital Mechanics',
      status: 'Beta',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      name: 'Structural Analysis (FEA)',
      status: 'Beta',
      statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      name: 'AI Copilot',
      status: 'Experimental',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      name: 'CFD Solver Integration',
      status: 'Experimental',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A16] flex flex-col font-mono text-white">
      <Header />
      <div className="flex flex-1">
        <CommandCenterSidebar />
        <main className="flex-1 lg:ml-64 p-4 md:p-6 space-y-6">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                DASHBOARD
              </h1>
              <p className="text-xs text-white/50">
                Engineering workspace overview
              </p>
            </div>

            <Link
              to="/projects"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-tight transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>
          </div>

          {/* Metric Cards — Real Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 uppercase">
                  PROJECTS
                </span>
                <div className="text-2xl font-bold text-cyan-400 mt-0.5">
                  {projects.length}
                </div>
              </div>
              <FolderOpen className="w-6 h-6 text-cyan-400/50" />
            </div>

            <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 uppercase">
                  ACTIVE
                </span>
                <div className="text-2xl font-bold text-emerald-400 mt-0.5">
                  {activeProjects}
                </div>
              </div>
              <Rocket className="w-6 h-6 text-emerald-400/50" />
            </div>

            <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 uppercase">
                  COMPLETED
                </span>
                <div className="text-2xl font-bold text-amber-400 mt-0.5">
                  {completedProjects}
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-amber-400/50" />
            </div>

            <div className="bg-[#080E1C] border border-white/10 rounded-lg p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 uppercase">
                  LABS AVAILABLE
                </span>
                <div className="text-2xl font-bold text-purple-400 mt-0.5">
                  3
                </div>
              </div>
              <FlaskConical className="w-6 h-6 text-purple-400/50" />
            </div>
          </div>

          {/* Quick Launch & Platform Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Launch */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                QUICK LAUNCH
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickLaunch.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`p-4 rounded-lg border ${item.bg} hover:bg-white/5 transition-all group`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                        <span className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50">{item.desc}</p>
                    </Link>
                  );
                })}
              </div>

              {/* Recent Projects */}
              {projects.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                    RECENT PROJECTS
                  </h3>
                  <div className="space-y-2">
                    {projects.slice(0, 5).map((project) => (
                      <Link
                        key={project._id}
                        to={`/projects/${project._id}`}
                        className="flex items-center justify-between p-3 bg-[#080E1C] border border-white/10 rounded-lg hover:border-cyan-500/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FolderOpen className="w-4 h-4 text-cyan-400/60" />
                          <div>
                            <p className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {project.name}
                            </p>
                            {project.description && (
                              <p className="text-[10px] text-white/40 mt-0.5 truncate max-w-[300px]">
                                {project.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                              project.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : project.status === 'completed'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                : 'bg-white/5 text-white/50 border-white/10'
                            }`}
                          >
                            {project.status.toUpperCase()}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {projects.length === 0 && (
                <div className="mt-6 p-8 bg-[#080E1C] border border-white/10 rounded-lg text-center">
                  <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/60 mb-1">
                    No projects yet
                  </p>
                  <p className="text-xs text-white/40 mb-4">
                    Create your first engineering project or explore the demo
                    projects
                  </p>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Project
                  </Link>
                </div>
              )}
            </div>

            {/* Platform Status Panel */}
            <div className="bg-[#080E1C] border border-white/10 rounded-lg p-4 space-y-4">
              <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                PLATFORM FEATURES
              </h3>
              <p className="text-[10px] text-white/40">
                Current capability status
              </p>

              <div className="space-y-2 text-xs">
                {platformFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="p-2 bg-[#050914] rounded border border-white/5 flex items-center justify-between"
                  >
                    <span className="text-white/80 text-[11px]">
                      {feature.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${feature.statusColor}`}
                    >
                      {feature.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
