import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, TrendingUp, Zap, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAstroLabStore } from '@/stores/astrolabStore';

export default function InvestorDemoPage() {
  const { setMode } = useAstroLabStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [metrics, setMetrics] = useState({
    simulationsRun: 0,
    dataPoints: 0,
    accuracy: 0,
    processingTime: 0,
  });

  useEffect(() => {
    setMode('investor-demo');
  }, [setMode]);

  const demoSteps = [
    {
      title: 'Real-Time Physics Simulation',
      description: 'Watch as AstroLab executes complex N-body orbital mechanics in real-time',
      icon: Zap,
      metrics: { simulationsRun: 1000, dataPoints: 50000, accuracy: 99.8, processingTime: 2.3 },
    },
    {
      title: 'Multi-Objective Optimization',
      description: 'Pareto frontier analysis for spacecraft trajectory design',
      icon: TrendingUp,
      metrics: { simulationsRun: 5000, dataPoints: 250000, accuracy: 99.95, processingTime: 8.7 },
    },
    {
      title: 'Enterprise Integration',
      description: 'Seamless data export and API integration with existing systems',
      icon: Award,
      metrics: { simulationsRun: 10000, dataPoints: 500000, accuracy: 99.99, processingTime: 15.2 },
    },
  ];

  const currentStep = demoSteps[demoStep];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % demoSteps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  useEffect(() => {
    if (isPlaying) {
      const animationInterval = setInterval(() => {
        setMetrics((prev) => ({
          simulationsRun: Math.min(prev.simulationsRun + 100, currentStep.metrics.simulationsRun),
          dataPoints: Math.min(prev.dataPoints + 5000, currentStep.metrics.dataPoints),
          accuracy: Math.min(prev.accuracy + 0.01, currentStep.metrics.accuracy),
          processingTime: Math.min(prev.processingTime + 0.1, currentStep.metrics.processingTime),
        }));
      }, 50);

      return () => clearInterval(animationInterval);
    }
  }, [isPlaying, currentStep]);

  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-16 bg-gradient-to-b from-aerospace-blue/20 to-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="inline-block px-4 py-2 bg-aerospace-blue/20 border border-aerospace-blue/50 rounded-full">
                <span className="font-mono text-sm text-aerospace-blue uppercase tracking-wider">
                  Investor Presentation
                </span>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold">
                AstroLab Enterprise Platform
              </h1>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                Production-grade scientific computing infrastructure for aerospace and research organizations
              </p>
            </motion.div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="w-full py-16 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Demo Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-96 bg-aerospace-dark border border-aerospace-blue/30 rounded-xl overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-aerospace-blue/10 to-aerospace-accent/10" />

                {/* Central Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Icon className="w-24 h-24 text-aerospace-blue/40" />
                  </motion.div>
                </div>

                {/* Orbiting Particles */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-aerospace-blue rounded-full"
                    animate={{
                      x: Math.cos((i * 2 * Math.PI) / 3) * 80,
                      y: Math.sin((i * 2 * Math.PI) / 3) * 80,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: '-4px',
                      marginTop: '-4px',
                    }}
                  />
                ))}

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-aerospace-dark to-transparent">
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    {currentStep.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mt-1">{currentStep.description}</p>
                </div>
              </motion.div>

              {/* Metrics Display */}
              <motion.div
                key={demoStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {[
                    {
                      label: 'Simulations Run',
                      value: metrics.simulationsRun,
                      unit: '',
                      color: 'text-aerospace-blue',
                    },
                    {
                      label: 'Data Points Processed',
                      value: (metrics.dataPoints / 1000).toFixed(0),
                      unit: 'K',
                      color: 'text-aerospace-accent',
                    },
                    {
                      label: 'Accuracy',
                      value: metrics.accuracy.toFixed(2),
                      unit: '%',
                      color: 'text-aerospace-success',
                    },
                    {
                      label: 'Processing Time',
                      value: metrics.processingTime.toFixed(1),
                      unit: 's',
                      color: 'text-aerospace-warning',
                    },
                  ].map((metric, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-aerospace-dark border border-secondary/20 rounded-lg"
                    >
                      <p className="text-xs text-foreground/60 font-mono uppercase tracking-wider mb-2">
                        {metric.label}
                      </p>
                      <p className={`text-3xl font-bold ${metric.color}`}>
                        {metric.value}
                        <span className="text-lg ml-1">{metric.unit}</span>
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 px-4 py-3 bg-aerospace-blue text-white font-mono font-bold rounded-lg hover:bg-aerospace-accent transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play Demo
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setDemoStep(0);
                      setMetrics({ simulationsRun: 0, dataPoints: 0, accuracy: 0, processingTime: 0 });
                    }}
                    className="px-4 py-3 border border-secondary/30 text-foreground font-mono font-bold rounded-lg hover:border-aerospace-blue/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex gap-2">
                  {demoSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDemoStep(idx);
                        setMetrics({ simulationsRun: 0, dataPoints: 0, accuracy: 0, processingTime: 0 });
                      }}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        idx === demoStep
                          ? 'bg-aerospace-blue'
                          : 'bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="w-full py-16 bg-aerospace-dark border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  Enterprise Capabilities
                </h2>
                <p className="text-foreground/70 max-w-2xl">
                  Purpose-built for mission-critical scientific computing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Physics-Accurate Simulations',
                    items: [
                      'Navier-Stokes CFD solver',
                      'N-body orbital mechanics',
                      'Relativistic corrections',
                      'Real-time visualization',
                    ],
                  },
                  {
                    title: 'Data Management',
                    items: [
                      'Multi-format export',
                      'Version control',
                      'Audit trails',
                      'Secure storage',
                    ],
                  },
                  {
                    title: 'Integration & APIs',
                    items: [
                      'RESTful APIs',
                      'Webhook support',
                      'Custom integrations',
                      'Enterprise SSO',
                    ],
                  },
                  {
                    title: 'Scalability',
                    items: [
                      'Parallel processing',
                      'Cloud deployment',
                      'Load balancing',
                      'Auto-scaling',
                    ],
                  },
                  {
                    title: 'Security',
                    items: [
                      'End-to-end encryption',
                      'Role-based access',
                      'Compliance ready',
                      'Regular audits',
                    ],
                  },
                  {
                    title: 'Support',
                    items: [
                      '24/7 technical support',
                      'Dedicated account manager',
                      'Custom training',
                      'SLA guaranteed',
                    ],
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="p-6 bg-primary border border-secondary/20 rounded-lg hover:border-aerospace-blue/50 transition-colors"
                  >
                    <h3 className="font-heading font-bold text-aerospace-blue mb-4">{feature.title}</h3>
                    <ul className="space-y-2">
                      {feature.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="text-aerospace-blue mt-1">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Ready to Transform Your Research?
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Join leading aerospace and research organizations using AstroLab for mission-critical simulations
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="px-8 py-3 bg-aerospace-blue text-white font-mono font-bold rounded-lg hover:bg-aerospace-accent transition-colors">
                  Schedule Demo
                </button>
                <button className="px-8 py-3 border border-aerospace-blue/50 text-aerospace-blue font-mono font-bold rounded-lg hover:bg-aerospace-blue/10 transition-colors">
                  Download Brochure
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
