import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Orbit, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AstroLabHubPage() {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'orbital-mechanics',
      title: 'Orbital Mechanics Simulator',
      icon: Orbit,
      description: 'Real-time visualization of orbital dynamics and Keplerian mechanics. Simulate satellite orbits, calculate orbital parameters, and understand the physics of celestial motion.',
      features: [
        'Interactive orbit visualization',
        'Real-time calculations',
        'Multiple central bodies (Earth, Sun, Moon)',
        'Orbital element analysis',
      ],
      path: '/astrolab/orbital-mechanics-enhanced',
      color: 'from-blue-600 to-cyan-600',
      applications: [
        'Satellite mission planning',
        'Space debris tracking',
        'Interplanetary trajectory design',
      ],
    },
    {
      id: 'exoplanet-habitability',
      title: 'Exoplanet Habitability Calculator',
      icon: Droplets,
      description: 'Assess the potential for life on distant worlds using advanced astrophysical models. Evaluate habitability zones, atmospheric retention, and biosignature potential.',
      features: [
        'Habitable zone calculation',
        'Equilibrium temperature modeling',
        'Atmospheric retention analysis',
        'Habitability scoring system',
      ],
      path: '/astrolab/exoplanet-habitability',
      color: 'from-green-600 to-emerald-600',
      applications: [
        'Exoplanet characterization',
        'JWST observation planning',
        'Biosignature detection strategy',
      ],
    },
    {
      id: 'stellar-evolution',
      title: 'Stellar Evolution Simulator',
      icon: Flame,
      description: 'Explore the life cycle of stars from birth to death using Hertzsprung-Russell diagram principles. Understand stellar physics and evolution across different masses.',
      features: [
        'HR diagram visualization',
        'Mass-dependent evolution',
        'Stellar lifecycle stages',
        'Physical property tracking',
      ],
      path: '/astrolab/stellar-evolution',
      color: 'from-orange-600 to-red-600',
      applications: [
        'Stellar population studies',
        'Exoplanet host star analysis',
        'Galactic evolution modeling',
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl font-bold text-white mb-6">AstroLab Suite</h1>
          <p className="text-2xl text-slate-300 mb-4">
            Professional-Grade Astrophysical Simulation Tools
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Explore the cosmos with scientifically accurate simulations. From orbital mechanics to stellar evolution, 
            these tools solve real-world astrophysical problems while inspiring the next generation of astronomers and engineers.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.id} variants={item}>
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 h-full flex flex-col group">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${tool.color} p-8 relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent" />
                    </div>
                    <Icon size={48} className="text-white relative z-10 mb-4" />
                    <h3 className="text-2xl font-bold text-white relative z-10">{tool.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-slate-300 mb-6">{tool.description}</p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-300">
                            <span className="text-cyan-400 mt-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Applications */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                        Real-World Applications
                      </h4>
                      <ul className="space-y-2">
                        {tool.applications.map((app, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-400">
                            <span className="text-slate-500">•</span>
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={() => navigate(tool.path)}
                      className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 text-white font-semibold flex items-center justify-center gap-2 mt-auto`}
                    >
                      Launch Tool
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Educational Value Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-12">
            <h2 className="text-3xl font-bold text-white mb-8">Why These Tools Matter</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">For Students</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Hands-on learning of complex astrophysical concepts</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Interactive visualization of abstract physics principles</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Real-world problem-solving experience</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Career exploration in astronomy and space science</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">For Professionals</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Rapid prototyping of mission concepts</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Scientifically accurate calculations and modeling</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Data export for further analysis</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span>Educational outreach and public engagement</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Physics Foundation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <Card className="bg-slate-800/50 border-slate-700 p-12">
            <h2 className="text-3xl font-bold text-white mb-8">Scientific Foundation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Orbital Mechanics</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Based on Kepler's laws and Newton's law of universal gravitation. Accurate for all orbital regimes from LEO to interplanetary trajectories.
                </p>
                <code className="text-xs text-cyan-300 bg-slate-900 p-2 rounded block">
                  T² = (4π²/GM) × a³
                </code>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Habitability Assessment</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Implements Kopparapu et al. habitable zone models with Stefan-Boltzmann radiation calculations and atmospheric retention physics.
                </p>
                <code className="text-xs text-cyan-300 bg-slate-900 p-2 rounded block">
                  T_eq = (L_star × (1-A) / 4σ)^0.25
                </code>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-orange-400 mb-3">Stellar Evolution</h4>
                <p className="text-slate-300 text-sm mb-4">
                  Uses mass-luminosity and mass-radius relations with Hertzsprung-Russell diagram principles for accurate evolutionary tracks.
                </p>
                <code className="text-xs text-cyan-300 bg-slate-900 p-2 rounded block">
                  L ∝ M^3.5, R ∝ M^0.5
                </code>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/50 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore the Universe?</h2>
            <p className="text-lg text-slate-300 mb-8">
              Choose a tool above to begin your journey into astrophysical discovery
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => navigate('/astrolab/orbital-mechanics-enhanced')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 font-semibold"
              >
                Start with Orbital Mechanics
              </Button>
              <Button
                onClick={() => navigate('/astrolab/exoplanet-habitability')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 font-semibold"
              >
                Explore Exoplanets
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
