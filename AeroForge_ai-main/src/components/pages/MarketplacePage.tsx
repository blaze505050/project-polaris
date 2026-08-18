import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ShoppingBag,
  Sparkles,
  Download,
  Star,
  CheckCircle2,
  DollarSign,
  Zap,
  Tag,
  Shield,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

interface MarketplaceItem {
  id: string;
  title: string;
  creator: string;
  category: 'Airfoil Section' | 'Orbital Notebook' | 'FEA Beam Spec' | 'Hypersonic Re-entry';
  price: string;
  isFree: boolean;
  downloads: number;
  rating: number;
  description: string;
  tags: string[];
}

export default function MarketplacePage() {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const items: MarketplaceItem[] = [
    {
      id: 'item-naca64',
      title: 'Transonic Supercritical NACA 64A210 Airfoil Mesh',
      creator: 'AeroLab Research Institute',
      category: 'Airfoil Section',
      price: '$19.00',
      isFree: false,
      downloads: 1420,
      rating: 4.9,
      description: 'High-speed supercritical wing section optimized for Mach 0.78 transport aircraft. Includes 2D structured mesh & polar data.',
      tags: ['Transonic', 'Supercritical', 'Airfoil'],
    },
    {
      id: 'item-lunar-orbit',
      title: 'Earth-Moon Halo Orbit Trajectory Model',
      creator: 'Astrodynamics Guild',
      category: 'Orbital Notebook',
      price: 'FREE',
      isFree: true,
      downloads: 3890,
      rating: 5.0,
      description: 'Full CR3BP Earth-Moon L2 halo orbit numerical propagator with stationkeeping delta-V budgets.',
      tags: ['Astrodynamics', 'CR3BP', 'Halo Orbit'],
    },
    {
      id: 'item-composite-beam',
      title: 'Carbon-Epoxy Wing Spar FEA Stiffener',
      creator: 'MechLab Composites Team',
      category: 'FEA Beam Spec',
      price: '$29.00',
      isFree: false,
      downloads: 870,
      rating: 4.8,
      description: 'Euler-Bernoulli anisotropic composite beam deflection and ply failure criterion solver package.',
      tags: ['Composites', 'FEA', 'Structures'],
    },
    {
      id: 'item-reentry-heat',
      title: 'Hypersonic Re-entry Aerothermal Heat Flux Suite',
      creator: 'Dr. V. hypersonic',
      category: 'Hypersonic Re-entry',
      price: '$49.00',
      isFree: false,
      downloads: 620,
      rating: 4.9,
      description: 'Fay-Riddell stagnation heat flux solver with high-temperature equilibrium air properties up to Mach 25.',
      tags: ['Hypersonic', 'Aerothermal', 'Re-entry'],
    },
  ];

  const filteredItems = items.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleAcquireItem = (item: MarketplaceItem) => {
    addToast({
      title: item.isFree ? 'Free Template Loaded' : 'Template Acquisition Initiated',
      description: item.isFree
        ? `Added ${item.title} to your AeroForge workspace.`
        : `Acquiring ${item.title} for ${item.price}. Platform fee: 15%.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-[120rem] w-full mx-auto px-[6%] py-12">
        {/* Banner */}
        <section className="mb-12 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase font-bold">
            <ShoppingBag className="w-4 h-4" />
            <span>AeroForge Creator Research Marketplace</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Publish, Share & Monetize Engineering Research
          </h1>
          <p className="text-white/70 text-base font-sans leading-relaxed">
            Discover verified airfoil sections, orbital notebooks, and composite structural templates built by computational engineers worldwide. Publish your research and earn 85% creator royalties.
          </p>

          {/* Search & Tag Filter */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center items-center">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search airfoils, orbits, materials..."
                className="w-full bg-[#060B18] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Airfoil', 'Astrodynamics', 'Composites', 'Hypersonic'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedTag === tag
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Items Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="bg-[#0A1020] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                    {item.category}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      item.isFree
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {item.price}
                  </span>
                </div>

                <h3 className="font-heading text-sm font-bold text-white line-clamp-2">{item.title}</h3>
                <p className="text-[11px] text-white/40 font-mono">By {item.creator}</p>
                <p className="text-xs text-white/60 line-clamp-3 font-sans leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 space-y-3 border-t border-white/5 mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    {item.downloads} downloads
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {item.rating}
                  </span>
                </div>

                <button
                  onClick={() => handleAcquireItem(item)}
                  className={`w-full py-2.5 font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
                    item.isFree
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                  }`}
                >
                  <span>{item.isFree ? 'Import Template' : `Buy ${item.price}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Pricing & Monetization Tier Section */}
        <section className="bg-[#0A1020] border border-white/10 rounded-2xl p-6 md:p-10 space-y-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Platform Access & Creator Tiers</h2>
            <p className="text-xs text-white/60 font-sans">
              Choose the right access tier for individual researchers, computational labs, and enterprise HPC users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {/* Free */}
            <div className="bg-[#050A16] border border-white/10 rounded-xl p-6 space-y-4">
              <span className="text-xs font-bold text-white/60 uppercase">COMMUNITY TIER</span>
              <div className="text-3xl font-extrabold text-white">$0 <span className="text-xs font-normal text-white/40">/ month</span></div>
              <p className="text-xs text-white/60 font-sans">100% free client-side access to all 54 reduced-order solvers.</p>
              <ul className="space-y-2 text-xs text-white/70 font-sans">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> All 54 Local Solvers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> .aeroforge JSON Export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Public Artifact Links</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-[#050A16] border border-cyan-500/50 rounded-xl p-6 space-y-4 relative shadow-lg shadow-cyan-500/10">
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 uppercase absolute right-4 top-4">
                MOST POPULAR
              </span>
              <span className="text-xs font-bold text-cyan-400 uppercase">PRO RESEARCHER</span>
              <div className="text-3xl font-extrabold text-white">$29 <span className="text-xs font-normal text-white/40">/ month</span></div>
              <p className="text-xs text-white/60 font-sans">FastAPI PyTorch Neural Operator cloud access + Creator Marketplace publishing.</p>
              <ul className="space-y-2 text-xs text-white/70 font-sans">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> 14ms PyTorch FNO Inference</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Publish & Earn on Marketplace</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Cloud Artifact Registry API</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="bg-[#050A16] border border-purple-500/40 rounded-xl p-6 space-y-4">
              <span className="text-xs font-bold text-purple-400 uppercase">ENTERPRISE HPC</span>
              <div className="text-3xl font-extrabold text-white">$199 <span className="text-xs font-normal text-white/40">/ month</span></div>
              <p className="text-xs text-white/60 font-sans">Dedicated RANS OpenFOAM & SU2 HPC cluster gateway adapters.</p>
              <ul className="space-y-2 text-xs text-white/70 font-sans">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Slurm / AWS HPC Gateway</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Custom Solver Adapters</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> AS9100 / ISO Data Thread Audit</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
