/**
 * ASTROLAB P0 - ORBITAL MECHANICS
 * Production-ready orbital mechanics simulator
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrbitalMechanicsSimulator from '@/components/OrbitalMechanicsSimulator';

export default function AstroLabP0OrbitalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <OrbitalMechanicsSimulator />
      </main>
      <Footer />
    </div>
  );
}
