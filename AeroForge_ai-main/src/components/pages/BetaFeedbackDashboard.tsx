import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Bug,
  MessageSquare,
  Sparkles,
  Users,
  Target,
  FolderCheck,
  TrendingUp,
  Filter,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFeedbackStore, FeedbackCategory } from '@/services/feedbackStore';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import { useProjectStore } from '@/stores/projectStore';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function BetaFeedbackDashboard() {
  usePageMeta('Beta Feedback Dashboard', 'Internal product telemetry, feedback reports, and North Star activation metric tracking.');

  const { feedbackItems } = useFeedbackStore();
  const { savedExperiments } = useAeroForgeStore();
  const { projects } = useProjectStore();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // North Star Counter: Completed Engineering Investigations
  const completedInvestigations = savedExperiments.length;
  const activeProjectsCount = projects.length;

  const filteredFeedback = categoryFilter === 'all'
    ? feedbackItems
    : feedbackItems.filter((f) => f.category === categoryFilter);

  const categoryCounts = {
    bug: feedbackItems.filter((f) => f.category === 'bug').length,
    wrong_result: feedbackItems.filter((f) => f.category === 'wrong_result').length,
    confusing_ux: feedbackItems.filter((f) => f.category === 'confusing_ux').length,
    missing_feature: feedbackItems.filter((f) => f.category === 'missing_feature').length,
    scientific_concern: feedbackItems.filter((f) => f.category === 'scientific_concern').length,
    general: feedbackItems.filter((f) => f.category === 'general').length,
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex flex-col font-mono">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full space-y-8">
        {/* Header Title */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                INTERNAL BETA TELEMETRY
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">LIVE METRICS</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Beta Telemetry & Product Dashboard
            </h1>
            <p className="text-xs text-white/50 font-sans mt-1">
              Internal analytics tracking North Star engineering activation, tool utilization, and user feedback logs.
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0A1020] border border-cyan-500/30 p-5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="text-[10px] uppercase font-bold">NORTH STAR METRIC</span>
              <Target className="w-4 h-4" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">{completedInvestigations}</p>
            <p className="text-[10px] text-white/50 font-sans">Completed Engineering Investigations</p>
          </div>

          <div className="bg-[#0A1020] border border-white/10 p-5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[10px] uppercase font-bold">PROJECTS CREATED</span>
              <FolderCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">{activeProjectsCount}</p>
            <p className="text-[10px] text-white/50 font-sans">Active Engineering Workspaces</p>
          </div>

          <div className="bg-[#0A1020] border border-white/10 p-5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-[10px] uppercase font-bold">FEEDBACK REPORTS</span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">{feedbackItems.length}</p>
            <p className="text-[10px] text-white/50 font-sans">Total Beta Submissions</p>
          </div>

          <div className="bg-[#0A1020] border border-white/10 p-5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-[10px] uppercase font-bold">REPORTED ISSUES</span>
              <Bug className="w-4 h-4" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">{categoryCounts.bug + categoryCounts.wrong_result}</p>
            <p className="text-[10px] text-white/50 font-sans">Bugs / Wrong Physics Items</p>
          </div>
        </div>

        {/* Category breakdown pills */}
        <div className="bg-[#0A1020] border border-white/10 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Feedback Categories</h3>
            <span className="text-xs text-white/40">Filter View</span>
          </div>

          <div className="flex gap-2 flex-wrap text-xs">
            {['all', 'bug', 'wrong_result', 'confusing_ux', 'missing_feature', 'scientific_concern', 'general'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg border font-mono transition-all ${
                  categoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                    : 'bg-white/5 text-white/50 border-white/10 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Feedback' : cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Log Table */}
        <div className="bg-[#0A1020] border border-white/10 rounded-xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Beta Feedback Submissions</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Message</th>
                  <th className="py-2.5 px-3">Page / Tool</th>
                  <th className="py-2.5 px-3">App Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredFeedback.map((fb) => (
                  <tr key={fb.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-white/50 text-[11px]">
                      {new Date(fb.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] uppercase font-bold">
                        {fb.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white max-w-md font-sans leading-relaxed">
                      {fb.message}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 text-[11px]">
                      {fb.diagnostics.pageUrl}
                    </td>
                    <td className="py-3 px-3 text-white/40 text-[11px]">
                      {fb.diagnostics.appVersion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
