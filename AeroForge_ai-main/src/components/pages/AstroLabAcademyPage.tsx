import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Zap, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AstroLabAcademyPage() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState(null);

  const learningPaths = [
    {
      id: 'beginner',
      title: 'Astronomy Fundamentals',
      level: 'Beginner',
      duration: '4 weeks',
      modules: [
        { name: 'Celestial Sphere', completed: true },
        { name: 'Constellations & Stars', completed: true },
        { name: 'Solar System', completed: false },
        { name: 'Observational Techniques', completed: false },
      ],
      progress: 50,
      description: 'Start your astronomy journey with fundamental concepts and observational skills.',
    },
    {
      id: 'intermediate',
      title: 'Astrophysics Essentials',
      level: 'Intermediate',
      duration: '8 weeks',
      modules: [
        { name: 'Stellar Physics', completed: false },
        { name: 'Galaxies & Cosmology', completed: false },
        { name: 'Black Holes', completed: false },
        { name: 'Exoplanets', completed: false },
      ],
      progress: 0,
      description: 'Dive into astrophysical concepts and explore the universe at scale.',
    },
    {
      id: 'advanced',
      title: 'Research Methods',
      level: 'Advanced',
      duration: '12 weeks',
      modules: [
        { name: 'Data Analysis', completed: false },
        { name: 'Simulation Techniques', completed: false },
        { name: 'Research Project', completed: false },
        { name: 'Publication Preparation', completed: false },
      ],
      progress: 0,
      description: 'Master research-level techniques and conduct your own astrophysical studies.',
    },
  ];

  const certifications = [
    {
      id: 'observer',
      title: 'Certified Observer',
      description: 'Master observational astronomy techniques',
      requirements: 'Complete Astronomy Fundamentals path',
      locked: false,
    },
    {
      id: 'astrophysicist',
      title: 'Astrophysics Specialist',
      description: 'Advanced understanding of stellar and galactic physics',
      requirements: 'Complete Astrophysics Essentials path',
      locked: true,
    },
    {
      id: 'researcher',
      title: 'Research Fellow',
      description: 'Conduct independent astrophysical research',
      requirements: 'Complete Research Methods path',
      locked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-amber-400" size={32} />
            <h1 className="text-5xl font-bold text-white">AstroLab Academy</h1>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl">
            Comprehensive educational pathway from fundamentals to research-level astronomy.
            Learn at your own pace with interactive lessons, guided projects, and expert resources.
          </p>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <motion.div
                key={path.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="bg-slate-800/50 border-slate-700 p-6 h-full flex flex-col cursor-pointer hover:border-amber-500/50 transition-all"
                  onClick={() => setSelectedPath(path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{path.title}</h3>
                      <div className="text-xs text-amber-400 font-semibold mt-1">{path.level}</div>
                    </div>
                    <div className="text-xs text-slate-400">{path.duration}</div>
                  </div>

                  <p className="text-sm text-slate-300 mb-6">{path.description}</p>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-slate-400">Progress</span>
                      <span className="text-xs font-semibold text-amber-400">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-600 to-yellow-600 h-2 rounded-full"
                        style={{ width: `${path.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="mb-6 flex-1">
                    <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                      Modules
                    </h4>
                    <div className="space-y-2">
                      {path.modules.map((module, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-4 h-4 rounded border ${
                              module.completed
                                ? 'bg-green-600 border-green-500'
                                : 'border-slate-600'
                            }`}
                          />
                          <span className={module.completed ? 'text-slate-300 line-through' : 'text-slate-300'}>
                            {module.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center justify-center gap-2">
                    Continue Learning
                    <ArrowRight size={16} />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <Card
                key={cert.id}
                className={`p-6 h-full flex flex-col ${
                  cert.locked
                    ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                  </div>
                  {cert.locked ? (
                    <Lock size={20} className="text-slate-500" />
                  ) : (
                    <Award size={20} className="text-amber-400" />
                  )}
                </div>

                <p className="text-sm text-slate-300 mb-6">{cert.description}</p>

                <div className="mb-6 flex-1">
                  <div className="text-xs text-slate-400 mb-2">Requirements:</div>
                  <div className="text-sm text-slate-300">{cert.requirements}</div>
                </div>

                <Button
                  disabled={cert.locked}
                  className={`w-full font-semibold flex items-center justify-center gap-2 ${
                    cert.locked
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {cert.locked ? (
                    <>
                      <Lock size={16} />
                      Locked
                    </>
                  ) : (
                    <>
                      <Award size={16} />
                      Earn Certificate
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Interactive Lessons',
                  description: 'Engage with multimedia content covering all aspects of astronomy and astrophysics.',
                },
                {
                  title: 'Guided Projects',
                  description: 'Work through real-world projects with step-by-step guidance from experts.',
                },
                {
                  title: 'Expert Mentorship',
                  description: 'Connect with experienced astronomers and astrophysicists for guidance.',
                },
                {
                  title: 'Research Papers',
                  description: 'Access curated collections of peer-reviewed research papers and articles.',
                },
                {
                  title: 'Lab Simulations',
                  description: 'Practice with all 14+ ASTROLAB labs integrated into your learning path.',
                },
                {
                  title: 'Community Forum',
                  description: 'Collaborate with other learners and share discoveries and insights.',
                },
              ].map((resource, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-600/20 border border-amber-500/30">
                      <Zap size={18} className="text-amber-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{resource.title}</h3>
                    <p className="text-slate-400 text-sm">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
