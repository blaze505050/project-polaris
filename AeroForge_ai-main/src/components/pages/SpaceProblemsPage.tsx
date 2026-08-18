/**
 * SPACE PROBLEMS PAGE
 * Interactive challenge board for learning astrophysics
 */

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaceProblemsPanel from '@/components/SpaceProblemsPanel';

export default function SpaceProblemsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Space Problems</h1>
          <p className="text-slate-400">
            Solve real astrophysics challenges using physics-accurate calculations.
          </p>
        </motion.div>

        <SpaceProblemsPanel />
      </main>

      <Footer />
    </div>
  );
}
