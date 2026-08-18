/**
 * ASTROLAB P0 - GRAVITY SIMULATOR
 * Production-ready N-body gravity simulation
 */

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GravitySimulator from '@/components/GravitySimulator';

export default function AstroLabP0GravityPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <GravitySimulator />
      </main>
      <Footer />
    </div>
  );
}
