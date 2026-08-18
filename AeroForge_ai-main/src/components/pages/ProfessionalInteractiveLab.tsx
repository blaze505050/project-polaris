/**
 * Professional Interactive Lab - Industrial Standard
 * Mission-control style interface with advanced physics and telemetry
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractivePhysicsEngine from '@/components/InteractivePhysicsEngine';
import AdvancedTelemetryDashboard from '@/components/AdvancedTelemetryDashboard';
import AdvancedMissionControl from '@/components/AdvancedMissionControl';
import AdvancedDataVisualizationPanel from '@/components/AdvancedDataVisualizationPanel';
import Advanced3DInteractiveViewer from '@/components/Advanced3DInteractiveViewer';
import { Zap, Radio, Cpu, Gauge, Settings, Download, Share2, Lock, Eye, BarChart3, Layers, Maximize2, Minimize2 } from 'lucide-react';

interface LabModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'physics' | 'telemetry' | 'analysis' | 'control';
}

const labModules: LabModule[] = [
  {
    id: 'physics-engine',
    name: 'Interactive Physics Engine',
    description: 'Real-time particle dynamics with collision detection',
    icon: <Zap className="w-5 h-5" />,
    category: 'physics',
  },
  {
    id: 'telemetry-dashboard',
    name: 'Real-Time Telemetry',
    description: 'Live data streaming with advanced visualization',
    icon: <Radio className="w-5 h-5" />,
    category: 'telemetry',
  },
  {
    id: 'mission-control',
    name: 'Mission Control Center',
    description: 'Command center with system monitoring',
    icon: <Cpu className="w-5 h-5" />,
    category: 'control',
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    description: 'Multi-parameter analysis and correlation',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analysis',
  },
  {
    id: 'performance-analysis',
    name: 'Performance Analysis',
    description: 'Multi-parameter optimization and trending',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analysis',
  },
  {
    id: '3d-viewer',
    name: '3D Interactive Viewer',
    description: 'Advanced 3D visualization with real-time controls',
    icon: <Eye className="w-5 h-5" />,
    category: 'analysis',
  },
  {
    id: 'system-control',
    name: 'System Control Panel',
    description: 'Advanced parameter manipulation and control',
    icon: <Gauge className="w-5 h-5" />,
    category: 'control',
  },
];

const ProfessionalInteractiveLab: React.FC = () => {
  const [activeModule, setActiveModule] = useState('physics-engine');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'physics' | 'telemetry' | 'analysis' | 'control'>('all');

  const filteredModules = selectedCategory === 'all' 
    ? labModules 
    : labModules.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-aerospace-dark">
      <Header />

      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[120rem] mx-auto px-4 md:px-[8%] py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Professional Interactive Lab
            </h1>
            <p className="text-lg text-secondary-foreground max-w-2xl">
              Industrial-grade simulation environment with real-time physics manipulation, advanced telemetry streaming, and mission-control style analytics.
            </p>
          </motion.div>

          {/* Module Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'physics', 'telemetry', 'analysis', 'control'].map((cat) => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className={`capitalize ${
                    selectedCategory === cat
                      ? 'bg-aerospace-blue text-primary'
                      : 'border-aerospace-blue/30 hover:bg-aerospace-blue/10'
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredModules.map((module) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className={`p-4 cursor-pointer border transition-all ${
                      activeModule === module.id
                        ? 'bg-aerospace-blue/20 border-aerospace-blue/50'
                        : 'bg-primary/50 border-secondary/30 hover:border-aerospace-blue/30'
                    }`}
                    onClick={() => setActiveModule(module.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${activeModule === module.id ? 'text-aerospace-blue' : 'text-secondary-foreground'}`}>
                        {module.icon}
                      </div>
                      {activeModule === module.id && (
                        <div className="w-2 h-2 rounded-full bg-aerospace-blue animate-pulse" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{module.name}</h3>
                    <p className="text-xs text-secondary-foreground">{module.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-aerospace-dark p-4' : ''}`}>
            <Card className="bg-gradient-to-br from-primary to-primary/80 border-aerospace-blue/30 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-aerospace-blue/20 bg-aerospace-dark/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-aerospace-success animate-pulse" />
                  <span className="text-sm font-mono text-aerospace-blue">LIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-aerospace-blue/10"
                    title="Download data"
                  >
                    <Download className="w-4 h-4 text-secondary-foreground" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-aerospace-blue/10"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4 text-secondary-foreground" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-aerospace-blue/10"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-secondary-foreground" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-secondary-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeModule === 'physics-engine' && (
                    <motion.div
                      key="physics"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <InteractivePhysicsEngine />
                    </motion.div>
                  )}

                  {activeModule === 'telemetry-dashboard' && (
                    <motion.div
                      key="telemetry"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AdvancedTelemetryDashboard />
                    </motion.div>
                  )}

                  {activeModule === 'mission-control' && (
                    <motion.div
                      key="mission"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AdvancedMissionControl />
                    </motion.div>
                  )}

                  {activeModule === 'data-visualization' && (
                    <motion.div
                      key="data-viz"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AdvancedDataVisualizationPanel />
                    </motion.div>
                  )}

                  {activeModule === '3d-viewer' && (
                    <motion.div
                      key="3d-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Advanced3DInteractiveViewer />
                    </motion.div>
                  )}

                  {activeModule === 'performance-analysis' && (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <Card className="bg-primary/50 border-aerospace-blue/20 p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-aerospace-blue" />
                          Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Efficiency', value: '94.2%', trend: '+2.1%' },
                            { label: 'Throughput', value: '12.5K', trend: '+5.3%' },
                            { label: 'Latency', value: '2.3ms', trend: '-0.8ms' },
                            { label: 'Uptime', value: '99.99%', trend: 'Stable' },
                          ].map((metric, idx) => (
                            <div key={idx} className="bg-aerospace-dark/50 p-4 rounded border border-aerospace-blue/20">
                              <div className="text-xs text-secondary-foreground mb-1">{metric.label}</div>
                              <div className="text-2xl font-mono font-bold text-aerospace-blue">{metric.value}</div>
                              <div className="text-xs text-aerospace-success mt-1">{metric.trend}</div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {activeModule === 'system-control' && (
                    <motion.div
                      key="control"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <Card className="bg-primary/50 border-aerospace-blue/20 p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          <Gauge className="w-5 h-5 text-aerospace-accent" />
                          System Control Panel
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { name: 'Power Output', value: 75, unit: '%' },
                            { name: 'Thermal Load', value: 62, unit: '°C' },
                            { name: 'Memory Usage', value: 48, unit: '%' },
                            { name: 'Network Load', value: 31, unit: '%' },
                          ].map((control, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-sm text-secondary-foreground">{control.name}</label>
                                <span className="text-sm font-mono text-aerospace-blue">{control.value}{control.unit}</span>
                              </div>
                              <div className="w-full h-2 bg-aerospace-dark/50 rounded-full overflow-hidden border border-aerospace-blue/20">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-aerospace-blue to-aerospace-accent"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${control.value}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {isFullscreen && (
              <Button
                onClick={() => setIsFullscreen(false)}
                className="fixed top-4 right-4 bg-aerospace-blue hover:bg-aerospace-blue/80"
              >
                Exit Fullscreen
              </Button>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Cpu className="w-6 h-6" />,
                title: 'Real-Time Processing',
                desc: 'Sub-millisecond latency for live data streams',
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: 'Multi-Layer Analysis',
                desc: 'Simultaneous analysis across multiple parameters',
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Enterprise Security',
                desc: 'Military-grade encryption and access control',
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'Advanced Visualization',
                desc: 'High-fidelity 3D rendering and data visualization',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-primary/50 border-secondary/30 p-6 hover:border-aerospace-blue/30 transition-colors">
                  <div className="text-aerospace-blue mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-secondary-foreground">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalInteractiveLab;
