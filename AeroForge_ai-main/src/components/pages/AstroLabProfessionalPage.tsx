import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AstroLabModeSelector from '@/components/AstroLabModeSelector';
import MyLabWorkspace from '@/components/MyLabWorkspace';
import SpaceChallengesBoard from '@/components/SpaceChallengesBoard';
import ExperimentReportGenerator from '@/components/ExperimentReportGenerator';
import QualityAssuranceDashboard from '@/components/QualityAssuranceDashboard';

export default function AstroLabProfessionalPage() {
  const [activeTab, setActiveTab] = useState('modes');

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-12 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-aerospace-blue">
                AstroLab Professional Suite
              </h1>
              <p className="text-lg text-foreground/80 max-w-2xl">
                Enterprise-grade astronomical research platform with multi-depth modes, real-time simulations,
                and professional reporting capabilities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="w-full py-12 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 bg-primary border border-secondary/20">
                <TabsTrigger value="modes" className="font-mono text-sm">
                  Lab Modes
                </TabsTrigger>
                <TabsTrigger value="workspace" className="font-mono text-sm">
                  My Lab
                </TabsTrigger>
                <TabsTrigger value="challenges" className="font-mono text-sm">
                  Challenges
                </TabsTrigger>
                <TabsTrigger value="reports" className="font-mono text-sm">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="qa" className="font-mono text-sm">
                  QA
                </TabsTrigger>
              </TabsList>

              {/* Lab Modes Tab */}
              <TabsContent value="modes" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AstroLabModeSelector />
                </motion.div>

                {/* Mode Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
                >
                  {[
                    {
                      title: 'Real-Time Physics Engine',
                      desc: 'Accurate N-body simulations with relativistic corrections',
                      icon: '⚛️',
                    },
                    {
                      title: 'Data Export & Analysis',
                      desc: 'Export results in multiple formats for further analysis',
                      icon: '📊',
                    },
                    {
                      title: 'Collaborative Tools',
                      desc: 'Share experiments and collaborate with team members',
                      icon: '👥',
                    },
                    {
                      title: 'Uncertainty Quantification',
                      desc: 'Full error propagation and confidence intervals',
                      icon: '📈',
                    },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="p-4 bg-primary border border-secondary/20 rounded-lg hover:border-aerospace-blue/50 transition-colors"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <h3 className="font-heading font-bold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-foreground/70">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* My Lab Tab */}
              <TabsContent value="workspace" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <MyLabWorkspace />
                </motion.div>
              </TabsContent>

              {/* Challenges Tab */}
              <TabsContent value="challenges" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SpaceChallengesBoard />
                </motion.div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ExperimentReportGenerator />
                </motion.div>
              </TabsContent>

              {/* QA Tab */}
              <TabsContent value="qa" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <QualityAssuranceDashboard />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Quality Assurance Section */}
        <section className="w-full py-12 bg-primary border-t border-secondary/20">
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
                  Production-Grade Quality Assurance
                </h2>
                <p className="text-foreground/70 max-w-2xl">
                  Every tool in AstroLab meets rigorous scientific standards with full uncertainty quantification,
                  equation validation, and unit consistency checks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Physics Accuracy',
                    items: [
                      'Validated against peer-reviewed data',
                      'Full relativistic corrections',
                      'Uncertainty propagation',
                      'Unit consistency checks',
                    ],
                  },
                  {
                    title: 'Data Integrity',
                    items: [
                      'Real-time validation',
                      'Automatic error detection',
                      'Data versioning',
                      'Audit trails',
                    ],
                  },
                  {
                    title: 'User Experience',
                    items: [
                      'Intuitive interfaces',
                      'Real-time feedback',
                      'Comprehensive help',
                      'Professional UI/UX',
                    ],
                  },
                ].map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-aerospace-dark border border-aerospace-blue/20 rounded-lg"
                  >
                    <h3 className="font-heading font-bold text-aerospace-blue mb-4">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
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
      </main>

      <Footer />
    </div>
  );
}
