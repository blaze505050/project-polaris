import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Trophy,
  Zap,
  Flame,
  Share2,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Users,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

interface Challenge {
  id: string;
  title: string;
  category: 'Aerodynamics' | 'Astrodynamics' | 'Structures';
  description: string;
  metric: string;
  targetValue: string;
  difficulty: 'Beginner' | 'Advanced' | 'Grandmaster';
  participantsCount: number;
  daysRemaining: number;
  topScore: string;
  topLeader: string;
  seedParams: Record<string, any>;
  pillarRoute: string;
}

export default function EngineeringChallengesPage() {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const challenges: Challenge[] = [
    {
      id: 'ch-transonic-01',
      title: 'Transonic Airfoil L/D Maximizer',
      category: 'Aerodynamics',
      description: 'Design a 2D section profile optimizing lift-to-drag ratio (L/D) at Mach 0.82 and 4.0° AoA without triggering shock stall.',
      metric: 'L/D Ratio',
      targetValue: '> 18.5',
      difficulty: 'Advanced',
      participantsCount: 342,
      daysRemaining: 4,
      topScore: 'L/D = 19.42',
      topLeader: 'Dr. Elena Rostova (MIT)',
      seedParams: { naca: '2412', mach: 0.82, aoa: 4.0 },
      pillarRoute: '/aerolab',
    },
    {
      id: 'ch-lunar-02',
      title: 'Minimum Delta-V Lunar Transfer Orbit',
      category: 'Astrodynamics',
      description: 'Compute a two-impulse Hohmann/Bi-elliptic transfer trajectory from 300km LEO to 100km LLO minimizing total Delta-V.',
      metric: 'Total Δv (m/s)',
      targetValue: '< 3,920 m/s',
      difficulty: 'Grandmaster',
      participantsCount: 189,
      daysRemaining: 9,
      topScore: '3,908 m/s',
      topLeader: 'K. Tsiolkovsky Lab',
      seedParams: { leoAlt: 300, lloAlt: 100, target: 'Moon' },
      pillarRoute: '/astrolab',
    },
    {
      id: 'ch-beam-03',
      title: 'Lightweight Wing Spar Shear Beam',
      category: 'Structures',
      description: 'Optimize I-beam flange thickness to withstand 45 kN end load under maximum von Mises stress < 220 MPa.',
      metric: 'Mass Efficiency (kN/kg)',
      targetValue: '> 14.2',
      difficulty: 'Beginner',
      participantsCount: 512,
      daysRemaining: 2,
      topScore: '16.8 kN/kg',
      topLeader: 'AeroMech Guild',
      seedParams: { load: 45000, length: 2.5, yield: 220 },
      pillarRoute: '/mechlab',
    },
  ];

  const filteredChallenges =
    selectedCategory === 'All'
      ? challenges
      : challenges.filter((c) => c.category === selectedCategory);

  const handleShareChallenge = (ch: Challenge) => {
    const url = `${window.location.origin}/challenges?ch=${ch.id}`;
    navigator.clipboard.writeText(url);
    addToast({
      title: 'Challenge Link Copied!',
      description: `Share ${ch.title} with your team or community.`,
      type: 'success',
    });
  };

  const handleForkChallenge = (ch: Challenge) => {
    addToast({
      title: `Forking Challenge Parameters`,
      description: `Loading ${ch.title} seed parameters into workspace...`,
      type: 'info',
    });
    navigate(ch.pillarRoute, { state: { challengeParams: ch.seedParams } });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[120rem] w-full mx-auto px-[6%] py-12">
        {/* Banner Section */}
        <section className="mb-12 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Trophy className="w-4 h-4" />
            <span>Weekly Physics Challenges & Global Leaderboard</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Compete, Optimize & Win Aerospace Recognition
          </h1>
          <p className="text-white/70 text-base font-sans leading-relaxed">
            Test your physics solvers, design high-efficiency airfoils or orbital trajectories, compete on live leaderboards, and share your verified public artifacts globally.
          </p>

          {/* Category Filter */}
          <div className="flex justify-center gap-2 pt-4 flex-wrap">
            {['All', 'Aerodynamics', 'Astrodynamics', 'Structures'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Challenges Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {filteredChallenges.map((ch) => (
            <motion.div
              key={ch.id}
              whileHover={{ y: -4 }}
              className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                    {ch.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      ch.difficulty === 'Grandmaster'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : ch.difficulty === 'Advanced'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {ch.difficulty}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white">{ch.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{ch.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="bg-[#050A16] p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-white/40 block">TARGET METRIC</span>
                    <span className="text-cyan-300 font-bold">{ch.targetValue}</span>
                  </div>
                  <div className="bg-[#050A16] p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-white/40 block">TOP LEADER</span>
                    <span className="text-emerald-400 font-bold truncate block">{ch.topLeader}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    {ch.participantsCount} Engineers Entered
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    {ch.daysRemaining} days left
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleForkChallenge(ch)}
                    className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Enter Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShareChallenge(ch)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Global Leaderboard Table */}
        <section className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Global Physics Leaderboard
              </h2>
              <p className="text-xs text-white/50 font-sans">
                Top verified physics scores submitted by engineers and research labs.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              Season 4 Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase text-[10px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Engineer / Institution</th>
                  <th className="py-3 px-4">Challenge</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { rank: 1, name: 'Dr. Elena Rostova', inst: 'MIT AeroAstro', challenge: 'Transonic Airfoil L/D', score: 'L/D = 19.42', hash: 'VERIFIED-0981' },
                  { rank: 2, name: 'K. Tsiolkovsky Lab', inst: 'TUM Space', challenge: 'Minimum Delta-V Lunar', score: '3,908 m/s', hash: 'VERIFIED-0742' },
                  { rank: 3, name: 'AeroMech Guild', inst: 'Imperial College', challenge: 'Lightweight Wing Spar', score: '16.8 kN/kg', hash: 'VERIFIED-0511' },
                  { rank: 4, name: 'Marcus Vance', inst: 'Stanford Aero', challenge: 'Transonic Airfoil L/D', score: 'L/D = 18.91', hash: 'VERIFIED-0412' },
                ].map((row) => (
                  <tr key={row.rank} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-400">#{row.rank}</td>
                    <td className="py-3 px-4">
                      <span className="text-white font-bold block">{row.name}</span>
                      <span className="text-[10px] text-white/40">{row.inst}</span>
                    </td>
                    <td className="py-3 px-4 text-white/70">{row.challenge}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{row.score}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {row.hash}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
