import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Microscope, Zap, Target, Code, BarChart3, GraduationCap, Briefcase, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AstroLabDualModeExperiencePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'student' | 'professional'>('student');

  const studentFeatures = [
    {
      icon: BookOpen,
      title: 'Educational Tooltips',
      desc: 'Plain-language explanations of all astronomical concepts',
      details: ['Hover over terms for definitions', 'Links to learning resources', 'Concept connections'],
    },
    {
      icon: Target,
      title: 'Guided Missions',
      desc: 'Step-by-step learning paths with clear objectives',
      details: ['Structured tutorials', 'Progress tracking', 'Achievement badges'],
    },
    {
      icon: Zap,
      title: 'Simplified Controls',
      desc: 'Intuitive interface optimized for learning',
      details: ['Reduced parameter complexity', 'Preset configurations', 'Visual feedback'],
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      desc: 'Charts and graphs to understand data patterns',
      details: ['Interactive plots', 'Real-time updates', 'Export as images'],
    },
  ];

  const professionalFeatures = [
    {
      icon: Code,
      title: 'Raw Telemetry',
      desc: 'Direct access to simulation vectors and raw data',
      details: ['Full precision data', 'Vector components', 'Timestamp accuracy'],
    },
    {
      icon: Microscope,
      title: 'Advanced Tools',
      desc: 'LaTeX equations, custom parameters, and algorithms',
      details: ['Custom equations', 'Parameter sweeps', 'Algorithm selection'],
    },
    {
      icon: Zap,
      title: 'Full Control',
      desc: 'Unrestricted access to all simulation parameters',
      details: ['No limits on ranges', 'Custom initial conditions', 'Advanced options'],
    },
    {
      icon: BarChart3,
      title: 'CSV/JSON Export',
      desc: 'Download datasets for external analysis and research',
      details: ['Multiple formats', 'Batch export', 'Custom fields'],
    },
  ];

  const comparisonData = [
    { feature: 'Satellite Tracking', student: '✓', professional: '✓ Advanced' },
    { feature: 'Photometry Analysis', student: '✓ Basic', professional: '✓ Full' },
    { feature: 'N-body Simulation', student: '✓ Presets', professional: '✓ Custom' },
    { feature: 'Coordinate Transforms', student: '✓', professional: '✓ Extended' },
    { feature: 'Data Export', student: 'PNG/CSV', professional: 'JSON/CSV/HDF5' },
    { feature: 'Parameter Ranges', student: 'Limited', professional: 'Unlimited' },
    { feature: 'API Access', student: '✗', professional: '✓' },
    { feature: 'Batch Processing', student: '✗', professional: '✓' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/astrolab')} className="p-2 hover:bg-[#131924] rounded-lg transition">
              <ArrowLeft size={20} className="text-[#00F0FF]" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">Dual-Mode Experience</h1>
              <p className="text-secondary-foreground text-sm">Switch between Student and Professional modes for tailored workflows</p>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Mode */}
            <motion.button
              onClick={() => setMode('student')}
              whileHover={{ scale: 1.02 }}
              className={`text-left p-8 rounded-lg border-2 transition-all ${
                mode === 'student'
                  ? 'border-[#00F0FF] bg-[#00F0FF]/10'
                  : 'border-[#475569] bg-[#131924]/60 hover:border-[#00F0FF]'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#00F0FF]/20 rounded-lg">
                  <GraduationCap size={24} className="text-[#00F0FF]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Student Mode</h2>
                  <p className="text-secondary-foreground text-sm">Perfect for learning</p>
                </div>
              </div>
              <p className="text-secondary-foreground mb-4">
                Designed for astronomy students and enthusiasts who want to learn through interactive exploration with guided support.
              </p>
              <div className="flex items-center gap-2 text-[#00F0FF] font-mono text-sm">
                <CheckCircle size={16} />
                Recommended for beginners
              </div>
            </motion.button>

            {/* Professional Mode */}
            <motion.button
              onClick={() => setMode('professional')}
              whileHover={{ scale: 1.02 }}
              className={`text-left p-8 rounded-lg border-2 transition-all ${
                mode === 'professional'
                  ? 'border-[#FF007A] bg-[#FF007A]/10'
                  : 'border-[#475569] bg-[#131924]/60 hover:border-[#FF007A]'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#FF007A]/20 rounded-lg">
                  <Briefcase size={24} className="text-[#FF007A]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Professional Mode</h2>
                  <p className="text-secondary-foreground text-sm">For research & development</p>
                </div>
              </div>
              <p className="text-secondary-foreground mb-4">
                Designed for researchers, engineers, and professionals who need full control and advanced analysis capabilities.
              </p>
              <div className="flex items-center gap-2 text-[#FF007A] font-mono text-sm">
                <Award size={16} />
                For advanced users
              </div>
            </motion.button>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">
              {mode === 'student' ? 'Student Features' : 'Professional Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(mode === 'student' ? studentFeatures : professionalFeatures).map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6 hover:border-[#00F0FF] transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#00F0FF]/20 rounded-lg flex-shrink-0">
                        <Icon size={20} className="text-[#00F0FF]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-secondary-foreground mb-3">{feature.desc}</p>
                        <ul className="space-y-1">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="text-xs text-secondary-foreground flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#00F0FF]" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-2xl font-bold text-[#00F0FF] font-mono mb-6">Feature Comparison</h2>
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-[#00F0FF33] bg-[#0B0E14]">
                      <th className="px-6 py-3 text-left text-secondary-foreground">Feature</th>
                      <th className="px-6 py-3 text-center text-[#00F0FF]">Student</th>
                      <th className="px-6 py-3 text-center text-[#FF007A]">Professional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#00F0FF33] hover:bg-[#0B0E14]/50 transition">
                        <td className="px-6 py-3 text-foreground">{row.feature}</td>
                        <td className="px-6 py-3 text-center text-[#00F0FF]">{row.student}</td>
                        <td className="px-6 py-3 text-center text-[#FF007A]">{row.professional}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mode Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Benefits */}
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF33] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#00F0FF] font-mono mb-4 flex items-center gap-2">
                <GraduationCap size={20} />
                Student Mode Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  'Learn astronomy concepts interactively',
                  'Guided tutorials with clear objectives',
                  'Visual explanations of complex phenomena',
                  'Safe environment to experiment',
                  'Progress tracking and achievements',
                  'Community learning resources',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-secondary-foreground text-sm">
                    <CheckCircle size={16} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Benefits */}
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#FF007A33] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[#FF007A] font-mono mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                Professional Mode Benefits
              </h3>
              <ul className="space-y-3">
                {[
                  'Unrestricted parameter control',
                  'Advanced simulation algorithms',
                  'Raw data access and export',
                  'Batch processing capabilities',
                  'API integration support',
                  'Research-grade accuracy',
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-secondary-foreground text-sm">
                    <CheckCircle size={16} className="text-[#FF007A] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#00F0FF]/10 to-[#FF007A]/10 border border-[#00F0FF33] rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Get Started?</h2>
            <p className="text-secondary-foreground mb-6">
              Choose your mode and explore the AstroLab suite. You can switch modes anytime from your profile settings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/astrolab')}
                className="px-6 py-3 bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF] rounded-lg font-mono hover:bg-[#00F0FF]/30 transition"
              >
                Back to AstroLab
              </button>
              <button
                onClick={() => navigate('/astrolab/spatial-globe')}
                className="px-6 py-3 bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A] rounded-lg font-mono hover:bg-[#FF007A]/30 transition"
              >
                Launch First Module
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
