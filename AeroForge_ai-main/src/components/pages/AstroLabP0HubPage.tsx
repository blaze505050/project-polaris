/**
 * ASTROLAB P0 HUB
 * Central navigation for all P0 production-ready features
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Zap, Brain, Microscope, Target, Save, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SECTIONS = [
  {
    title: 'Core Simulations',
    description: 'Production-ready physics engines',
    items: [
      {
        name: 'Orbital Mechanics',
        desc: 'Kepler orbit calculator',
        icon: Rocket,
        path: '/astrolab/p0/orbital',
      },
      {
        name: 'Gravity Simulator',
        desc: 'N-body dynamics',
        icon: Zap,
        path: '/astrolab/p0/gravity',
      },
      {
        name: 'Transit Detection',
        desc: 'Exoplanet light curves',
        icon: Brain,
        path: '/astrolab/p0/transit',
      },
      {
        name: 'Stellar Evolution',
        desc: 'HR diagram explorer',
        icon: Microscope,
        path: '/astrolab/p0/stellar',
      },
    ],
  },
  {
    title: 'Learning & Challenges',
    description: 'Interactive problem-solving',
    items: [
      {
        name: 'Space Problems',
        desc: '8 guided challenges',
        icon: Target,
        path: '/space-problems',
      },
      {
        name: 'My Lab',
        desc: 'Experiment management',
        icon: Save,
        path: '/my-lab',
      },
    ],
  },
  {
    title: 'Investor Demo',
    description: 'Complete platform showcase',
    items: [
      {
        name: 'Full Demo',
        desc: 'All features & capabilities',
        icon: Users,
        path: '/astrolab/investor-demo',
      },
    ],
  },
];

export default function AstroLabP0HubPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-6 bg-gradient-to-b from-primary to-background">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h1 className="text-4xl font-bold font-heading">ASTROLAB P0</h1>
              <p className="text-lg text-secondary-foreground">
                Production-Ready Astrophysics Platform
              </p>
              <div className="flex justify-center gap-2 flex-wrap pt-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                  ✓ 100% Complete
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                  ✓ Tested
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                  ✓ Production Ready
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Grid */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="space-y-16">
            {SECTIONS.map((section, sIdx) => (
              <motion.div
                key={sIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.1 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold font-heading">{section.title}</h2>
                  <p className="text-secondary-foreground">{section.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.items.map((item, iIdx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={iIdx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (sIdx * 0.1) + (iIdx * 0.05) }}
                      >
                        <Link to={item.path}>
                          <Card className="p-6 h-full hover:border-accent hover:bg-primary/50 transition-all cursor-pointer group">
                            <div className="flex flex-col h-full gap-4">
                              <div className="p-3 bg-primary rounded w-fit group-hover:bg-accent/20 transition-colors">
                                <Icon className="w-6 h-6 text-accent" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-heading font-semibold mb-1">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-secondary-foreground">
                                  {item.desc}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-accent text-sm font-semibold group-hover:gap-2 transition-all">
                                Launch <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-16 px-6 bg-primary">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-heading">What's Included</h2>
              <p className="text-secondary-foreground">Complete P0 feature set</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '✓ Centralized Physics Engine',
                '✓ 4 Production Simulations',
                '✓ Persistent Experiment Storage',
                '✓ 8 Interactive Challenges',
                '✓ Real Physics Constants',
                '✓ Full Data Export',
                '✓ Responsive Design',
                '✓ Error Handling & Validation',
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded border border-secondary hover:border-accent transition-colors"
                >
                  <span className="text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <Card className="p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading">Quick Start</h2>
              <p className="text-secondary-foreground">
                Get started in 3 steps
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  num: '1',
                  title: 'Choose a Simulation',
                  desc: 'Pick from Orbital Mechanics, Gravity, Transit, or Stellar Evolution',
                },
                {
                  num: '2',
                  title: 'Adjust Parameters',
                  desc: 'Use interactive sliders to modify physical parameters in real-time',
                },
                {
                  num: '3',
                  title: 'Save & Analyze',
                  desc: 'Save experiments to My Lab and export data for further analysis',
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">{step.title}</h3>
                    <p className="text-secondary-foreground text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 border-t border-secondary">
              <Link to="/astrolab/p0/orbital">
                <Button className="w-full gap-2">
                  <Rocket className="w-5 h-5" /> Launch First Simulation
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
