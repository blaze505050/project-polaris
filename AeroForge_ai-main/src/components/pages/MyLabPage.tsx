/**
 * MY LAB PAGE
 * Central hub for viewing and managing saved experiments
 */

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyLabExperimentsList from '@/components/MyLabExperimentsList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function MyLabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Lab</h1>
              <p className="text-slate-400">
                View, manage, and export your saved experiments.
              </p>
            </div>
            <Link to="/astrolab/simulations">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Experiment
              </Button>
            </Link>
          </div>
        </motion.div>

        <MyLabExperimentsList />
      </main>

      <Footer />
    </div>
  );
}
