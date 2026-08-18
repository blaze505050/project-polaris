import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Telescope, Satellite, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AstroLabExplorerPage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const explorerModes = [
    {
      id: 'orbital',
      title: 'Orbital Mechanics',
      description: 'Explore planetary orbits, escape velocity, and Kepler\'s laws',
      icon: Satellite,
      path: '/astrolab/p0/orbital',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'gravity',
      title: 'Gravity Simulator',
      description: 'Visualize gravitational forces and inverse-square law',
      icon: Zap,
      path: '/astrolab/p0/gravity',
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'transit',
      title: 'Exoplanet Transit',
      description: 'Detect exoplanets through transit light curves',
      icon: Telescope,
      path: '/astrolab/p0/transit',
      color: 'from-orange-600 to-red-600',
    },
    {
      id: 'stellar',
      title: 'Stellar Evolution',
      description: 'Map stars on the HR Diagram and explore stellar lifecycles',
      icon: Globe,
      path: '/astrolab/p0/stellar',
      color: 'from-yellow-600 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            ASTROLAB Explorer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Dive into interactive simulations of orbital mechanics, gravity, exoplanet detection, and stellar evolution.
          </p>
        </motion.div>

        {/* Explorer Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {explorerModes.map((mode, idx) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link to={mode.path}>
                  <Card className="h-full bg-slate-800 border-slate-700 hover:border-slate-500 transition-all cursor-pointer group">
                    <div className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {mode.title}
                      </h3>
                      <p className="text-slate-400 mb-4">
                        {mode.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Explore →
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Experiment?</h2>
          <p className="text-slate-400 mb-6">
            Save your simulations, solve space problems, and generate research reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-lab">
              <Button className="bg-blue-600 hover:bg-blue-700">
                My Lab (Saved Experiments)
              </Button>
            </Link>
            <Link to="/space-problems">
              <Button variant="outline" className="border-slate-600">
                Space Problems
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
