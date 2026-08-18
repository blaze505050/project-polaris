/**
 * ASTROLAB INVESTOR DEMO
 * Production-ready demonstration of core P0 functionality
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Zap, Rocket, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DEMO_FEATURES = [
  {
    title: 'Orbital Mechanics Engine',
    description: 'Production-grade Kepler orbit calculator with real physics constants',
    icon: Rocket,
    path: '/astrolab/p0/orbital',
    status: '✓ Production Ready',
  },
  {
    title: 'N-Body Gravity Simulator',
    description: 'Multi-body gravitational dynamics with numerical integration',
    icon: Zap,
    path: '/astrolab/p0/gravity',
    status: '✓ Production Ready',
  },
  {
    title: 'Exoplanet Transit Detection',
    description: 'Synthetic light curve generation and transit photometry',
    icon: Brain,
    path: '/astrolab/p0/transit',
    status: '✓ Production Ready',
  },
  {
    title: 'Stellar Evolution',
    description: 'HR Diagram visualization and stellar property calculations',
    icon: Rocket,
    path: '/astrolab/p0/stellar',
    status: '✓ Production Ready',
  },
];

const CAPABILITIES = [
  {
    title: 'Centralized Physics Engine',
    description: 'Single source of truth for all calculations - ensures consistency and accuracy',
    icon: '⚙️',
  },
  {
    title: 'Persistent Experiment Storage',
    description: 'Save and manage experiments in "My Lab" with full data export',
    icon: '💾',
  },
  {
    title: 'Interactive Challenges',
    description: '8 guided Space Problems to engage users and demonstrate capabilities',
    icon: '🎯',
  },
  {
    title: 'Real Physics Constants',
    description: 'All simulations use scientifically accurate values and equations',
    icon: '🔬',
  },
  {
    title: 'Responsive Design',
    description: 'Works seamlessly on desktop, tablet, and mobile devices',
    icon: '📱',
  },
  {
    title: 'Production Grade',
    description: 'Robust error handling, input validation, and performance optimization',
    icon: '✨',
  },
];

export default function AstroLabInvestorDemoPage() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-primary to-background">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold font-heading">ASTROLAB</h1>
              <p className="text-xl text-secondary-foreground">
                Production-Ready Astrophysics Simulation Platform
              </p>
              <p className="text-lg text-accent font-semibold">
                P0 Functionality: 100% Complete & Tested
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link to="/astrolab/p0/orbital">
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5" /> Launch Demo
                </Button>
              </Link>
              <Link to="/space-problems">
                <Button size="lg" variant="outline" className="gap-2">
                  <Rocket className="w-5 h-5" /> Try Challenges
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-heading">Core Simulations</h2>
              <p className="text-secondary-foreground">
                Four production-ready physics engines
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEMO_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link to={feature.path}>
                      <Card className="p-6 h-full hover:border-accent transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-primary rounded group-hover:bg-accent/20 transition-colors">
                            <Icon className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-lg">
                              {feature.title}
                            </h3>
                            <p className="text-xs text-green-400 font-semibold mt-1">
                              {feature.status}
                            </p>
                          </div>
                        </div>
                        <p className="text-secondary-foreground text-sm mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                          Launch <ArrowRight className="w-4 h-4" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Capabilities */}
        <section className="py-20 px-6 bg-primary">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-heading">Platform Capabilities</h2>
              <p className="text-secondary-foreground">
                Enterprise-grade features for scientific computing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAPABILITIES.map((cap, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 space-y-3 border-secondary hover:border-accent transition-colors">
                    <div className="text-3xl">{cap.icon}</div>
                    <h3 className="font-heading font-semibold">{cap.title}</h3>
                    <p className="text-sm text-secondary-foreground">
                      {cap.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold font-heading">Technical Stack</h2>
              <p className="text-secondary-foreground">
                Built on proven, production-ready technologies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <h3 className="font-heading font-semibold text-lg">Physics Engine</h3>
                <ul className="space-y-2 text-sm text-secondary-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Kepler orbit calculations with Newton-Raphson solver</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>N-body gravitational dynamics with Verlet integration</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Transit photometry with light curve simulation</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Stellar evolution models with HR diagram</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 space-y-4">
                <h3 className="font-heading font-semibold text-lg">Data & Storage</h3>
                <ul className="space-y-2 text-sm text-secondary-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Persistent experiment storage with Zustand</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>JSON export for data analysis</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Browser-based local storage</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>Full data validation and error handling</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 bg-gradient-to-r from-accent/20 to-accent-foreground/5">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold font-heading">Ready to Explore?</h2>
            <p className="text-lg text-secondary-foreground">
              Launch the interactive demos and experience production-grade astrophysics simulation
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/astrolab/p0/orbital">
                <Button size="lg" className="gap-2">
                  <Zap className="w-5 h-5" /> Orbital Mechanics
                </Button>
              </Link>
              <Link to="/my-lab">
                <Button size="lg" variant="outline" className="gap-2">
                  <Brain className="w-5 h-5" /> My Lab
                </Button>
              </Link>
              <Link to="/space-problems">
                <Button size="lg" variant="outline" className="gap-2">
                  <Rocket className="w-5 h-5" /> Challenges
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
