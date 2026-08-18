/**
 * ASTROLAB P0 - STELLAR EVOLUTION
 * Production-ready stellar evolution simulator
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StellarEvolutionSimulator from '@/components/StellarEvolutionSimulator';

export default function AstroLabP0StellarPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <StellarEvolutionSimulator />
      </main>
      <Footer />
    </div>
  );
}
