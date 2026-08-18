/**
 * ASTROLAB P0 - TRANSIT SIMULATOR
 * Production-ready exoplanet transit detection simulator
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransitSimulator from '@/components/TransitSimulator';

export default function AstroLabP0TransitPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <TransitSimulator />
      </main>
      <Footer />
    </div>
  );
}
