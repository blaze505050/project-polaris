import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Telescope,
  Globe,
  Flame,
  Zap,
  Radio,
  Rocket,
  Microscope,
  Waves,
  Eye,
  Compass,
  Wind,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeatureStatusBadge from '@/components/ui/FeatureStatusBadge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AstroLabMainPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const labs = [
    {
      id: 'virtual-observatory',
      title: 'Virtual Observatory',
      icon: Telescope,
      category: 'observation',
      description: 'Real-time celestial observation and data analysis. Access live telescope feeds, conduct photometric surveys, and analyze stellar spectra.',
      features: ['Live sky mapping', 'Photometric analysis', 'Spectroscopy tools', 'Object catalog search'],
      color: 'from-blue-600 to-cyan-600',
      difficulty: 'Beginner',
      path: '/astrolab/virtual-observatory',
    },
    {
      id: 'planetary-explorer',
      title: 'Planetary Explorer',
      icon: Globe,
      category: 'planetary',
      description: 'Explore planetary systems, atmospheres, and geology. Study exoplanet characteristics and habitability zones.',
      features: ['Exoplanet database', 'Habitability calculator', 'Atmospheric modeling', 'Orbital parameters'],
      color: 'from-green-600 to-emerald-600',
      difficulty: 'Intermediate',
      path: '/astrolab/exoplanet-habitability',
    },
    {
      id: 'stellar-evolution',
      title: 'Stellar Evolution Lab',
      icon: Flame,
      category: 'stellar',
      description: 'Track stellar lifecycles from birth to death. Visualize HR diagrams and understand stellar physics.',
      features: ['HR diagram', 'Mass-luminosity relations', 'Lifecycle stages', 'Spectral classification'],
      color: 'from-orange-600 to-red-600',
      difficulty: 'Intermediate',
      path: '/astrolab/stellar-evolution',
    },
    {
      id: 'black-hole-simulator',
      title: 'Black Hole Simulator',
      icon: Zap,
      category: 'cosmology',
      description: 'Explore extreme gravity and relativistic physics. Visualize event horizons and accretion disks.',
      features: ['Event horizon visualization', 'Spacetime curvature', 'Accretion disk dynamics', 'Gravitational lensing'],
      color: 'from-purple-600 to-pink-600',
      difficulty: 'Advanced',
      path: '/astrolab/black-hole-simulator',
    },
    {
      id: 'radio-astronomy',
      title: 'Radio Astronomy Suite',
      icon: Radio,
      category: 'observation',
      description: 'Analyze radio signals from space. Study pulsars, quasars, and cosmic microwave background.',
      features: ['Signal processing', 'Pulsar detection', 'CMB analysis', 'Interferometry'],
      color: 'from-indigo-600 to-blue-600',
      difficulty: 'Advanced',
      path: '/astrolab/radio-astronomy',
    },
    {
      id: 'spaceflight-dynamics',
      title: 'Spaceflight Dynamics',
      icon: Rocket,
      category: 'spaceflight',
      description: 'Design and simulate spacecraft trajectories. Plan missions and optimize orbital transfers.',
      features: ['Trajectory design', 'Orbital mechanics', 'Mission planning', 'Delta-v calculations'],
      color: 'from-red-600 to-orange-600',
      difficulty: 'Advanced',
      path: '/astrolab/spaceflight-dynamics',
    },
    {
      id: 'astrobiology-lab',
      title: 'Astrobiology Lab',
      icon: Microscope,
      category: 'life',
      description: 'Study conditions for life in the universe. Analyze biosignatures and habitability factors.',
      features: ['Biosignature detection', 'Extremophile analysis', 'Habitability assessment', 'SETI parameters'],
      color: 'from-lime-600 to-green-600',
      difficulty: 'Intermediate',
      path: '/astrolab/astrobiology-lab',
    },
    {
      id: 'cosmology-explorer',
      title: 'Cosmology Explorer',
      icon: Waves,
      category: 'cosmology',
      description: 'Explore the universe at large scales. Study dark matter, dark energy, and cosmic structure.',
      features: ['Universe expansion', 'Dark matter mapping', 'Galaxy clusters', 'Redshift analysis'],
      color: 'from-violet-600 to-purple-600',
      difficulty: 'Advanced',
      path: '/astrolab/cosmology-explorer',
    },
    {
      id: 'exoplanet-imaging',
      title: 'Exoplanet Imaging',
      icon: Eye,
      category: 'observation',
      description: 'Advanced imaging techniques for detecting and characterizing exoplanets.',
      features: ['Direct imaging', 'Transit photometry', 'Radial velocity', 'Astrometry'],
      color: 'from-cyan-600 to-blue-600',
      difficulty: 'Advanced',
      path: '/astrolab/exoplanet-imaging',
    },
    {
      id: 'celestial-mechanics',
      title: 'Celestial Mechanics',
      icon: Compass,
      category: 'mechanics',
      description: 'Master orbital mechanics and gravitational interactions. Solve N-body problems.',
      features: ['Orbital elements', 'Perturbation analysis', 'Resonances', 'Stability analysis'],
      color: 'from-sky-600 to-cyan-600',
      difficulty: 'Advanced',
      path: '/astrolab/celestial-mechanics',
    },
    {
      id: 'atmospheric-science',
      title: 'Atmospheric Science',
      icon: Wind,
      category: 'planetary',
      description: 'Study planetary atmospheres and climate systems. Model atmospheric dynamics.',
      features: ['Atmospheric composition', 'Climate modeling', 'Weather simulation', 'Radiation transfer'],
      color: 'from-teal-600 to-cyan-600',
      difficulty: 'Intermediate',
      path: '/astrolab/atmospheric-science',
    },
    {
      id: 'quantum-astrophysics',
      title: 'Quantum Astrophysics',
      icon: Lightbulb,
      category: 'physics',
      description: 'Explore quantum effects in astrophysical systems. Study neutron stars and quantum gravity.',
      features: ['Quantum mechanics', 'Neutron star physics', 'Quantum tunneling', 'Hawking radiation'],
      color: 'from-yellow-600 to-orange-600',
      difficulty: 'Advanced',
      path: '/astrolab/quantum-astrophysics',
    },
    {
      id: 'celestial-mechanics',
      title: 'Celestial Mechanics',
      icon: Compass,
      category: 'mechanics',
      description: 'Master orbital mechanics and gravitational interactions. Solve N-body problems.',
      features: ['Orbital elements', 'Perturbation analysis', 'Resonances', 'Stability analysis'],
      color: 'from-sky-600 to-cyan-600',
      difficulty: 'Advanced',
      path: '/astrolab/celestial-mechanics',
    },
    {
      id: 'atmospheric-science',
      title: 'Atmospheric Science',
      icon: Wind,
      category: 'planetary',
      description: 'Study planetary atmospheres and climate systems. Model atmospheric dynamics.',
      features: ['Atmospheric composition', 'Climate modeling', 'Weather simulation', 'Radiation transfer'],
      color: 'from-teal-600 to-cyan-600',
      difficulty: 'Intermediate',
      path: '/astrolab/atmospheric-science',
    },
    {
      id: 'astrolab-academy',
      title: 'AstroLab Academy',
      icon: BookOpen,
      category: 'education',
      description: 'Comprehensive educational pathway. Learn astronomy from fundamentals to research-level topics.',
      features: ['Interactive lessons', 'Guided projects', 'Certification paths', 'Expert resources'],
      color: 'from-amber-600 to-yellow-600',
      difficulty: 'All Levels',
      path: '/astrolab/academy',
    },
    {
      id: 'mission-control',
      title: 'Mission Control Center',
      icon: Rocket,
      category: 'spaceflight',
      description: 'Real-time mission monitoring and control. Manage spacecraft operations and communications.',
      features: ['Telemetry monitoring', 'Command sequencing', 'Timeline management', 'Data analysis'],
      color: 'from-rose-600 to-red-600',
      difficulty: 'Advanced',
      path: '/astrolab/mission-control',
    },
    {
      id: 'planetary-explorer',
      title: 'Planetary Explorer',
      icon: Globe,
      category: 'planetary',
      description: 'Explore planetary systems, atmospheres, and geology. Study exoplanet characteristics and habitability zones.',
      features: ['Exoplanet database', 'Habitability calculator', 'Atmospheric modeling', 'Orbital parameters'],
      color: 'from-green-600 to-emerald-600',
      difficulty: 'Intermediate',
      path: '/astrolab/exoplanet-habitability',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Labs', icon: Telescope },
    { id: 'observation', label: 'Observation', icon: Eye },
    { id: 'planetary', label: 'Planetary', icon: Globe },
    { id: 'stellar', label: 'Stellar', icon: Flame },
    { id: 'cosmology', label: 'Cosmology', icon: Waves },
    { id: 'spaceflight', label: 'Spaceflight', icon: Rocket },
    { id: 'education', label: 'Education', icon: BookOpen },
  ];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch = lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || lab.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <Telescope size={18} className="text-cyan-400" />
              <span className="text-cyan-400 font-semibold text-sm">Space & Orbital Engineering Lab</span>
              <FeatureStatusBadge status="beta" />
            </div>
          </div>

          <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
            ASTROLAB
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Virtual Astronomy & Astrophysics Laboratory
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore the cosmos with 14+ interactive laboratories. From observational astronomy to cutting-edge astrophysics,
            conduct real research with scientifically accurate simulations and professional-grade tools.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 font-semibold flex items-center gap-2">
              Start Learning
              <ArrowRight size={18} />
            </Button>
            <Button className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 font-semibold">
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Search labs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Labs Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {filteredLabs.map((lab) => {
            const Icon = lab.icon;
            return (
              <motion.div key={lab.id} variants={item}>
                <Card className="bg-slate-800/30 border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 h-full flex flex-col group hover:shadow-lg hover:shadow-cyan-500/10">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${lab.color} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
                    </div>
                    <div className="flex items-start justify-between relative z-10">
                      <Icon size={40} className="text-white" />
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                        {lab.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4">{lab.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">{lab.description}</p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                        Features
                      </h4>
                      <ul className="space-y-2">
                        {lab.features.map((feature, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-300">
                            <span className="text-cyan-400 mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={() => navigate(lab.path)}
                      className={`w-full bg-gradient-to-r ${lab.color} hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 mt-auto`}
                    >
                      Launch Lab
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Interactive Labs', value: '14+' },
              { label: 'Simulations', value: '100+' },
              { label: 'Research Tools', value: '50+' },
              { label: 'Users Worldwide', value: '10K+' },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-slate-800/30 border-slate-700 p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-12">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose ASTROLAB?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Research-Grade Accuracy',
                  description: 'All simulations based on peer-reviewed physics and real astronomical data.',
                },
                {
                  title: 'Interactive Learning',
                  description: 'Hands-on experience with complex astrophysical concepts and phenomena.',
                },
                {
                  title: 'Professional Tools',
                  description: 'Industry-standard instruments and analysis techniques used by real astronomers.',
                },
                {
                  title: 'Real Data Integration',
                  description: 'Access to actual observations from major telescopes and space missions.',
                },
                {
                  title: 'Collaborative Environment',
                  description: 'Share findings, collaborate on projects, and contribute to citizen science.',
                },
                {
                  title: 'Continuous Updates',
                  description: 'Regular additions of new discoveries, tools, and educational content.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-cyan-600/20 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">✓</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/50 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore the Universe?</h2>
            <p className="text-lg text-slate-300 mb-8">
              Start with any lab above or follow our guided learning path in the Academy.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 font-semibold flex items-center gap-2">
                Explore Labs
                <ArrowRight size={18} />
              </Button>
              <Button className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 font-semibold">
                View Academy
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
