import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Advanced3DBlackHole from '@/components/Advanced3DBlackHole';
import { RelativisticCalculator, CONSTANTS } from '@/services/advancedPhysicsSimulator';
import { Zap, Gauge, Info } from 'lucide-react';

export default function BlackHoleSimulatorPage() {
  const [mass, setMass] = useState(10); // Solar masses
  const [spinParameter, setSpinParameter] = useState(0.9); // 0 to 1
  const [showAccretionDisk, setShowAccretionDisk] = useState(true);
  const [showEventHorizon, setShowEventHorizon] = useState(true);

  const blackHoleMass = mass * CONSTANTS.SOLAR_MASS;
  const schwarzschildRadius = RelativisticCalculator.schwarzschildRadius(blackHoleMass);
  const ergosphereRadius = schwarzschildRadius * (1 + Math.sqrt(Math.max(0, 1 - spinParameter * spinParameter)));
  const photonSphereRadius = schwarzschildRadius * 1.5;

  // Calculate physical properties
  const timeDilationAtPhotonSphere = RelativisticCalculator.timeDilationFactor(blackHoleMass, photonSphereRadius);
  const lensingAngle = RelativisticCalculator.lensingDeflectionAngle(blackHoleMass, photonSphereRadius);

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground">
      <Header />

      <main className="max-w-[100rem] mx-auto px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">
            Black Hole Simulator
          </h1>
          <p className="text-xl text-secondary-foreground">
            Explore extreme spacetime curvature with relativistic physics and high-fidelity 3D rendering.
          </p>
        </motion.div>

        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 rounded-lg overflow-hidden border border-aerospace-blue/30 h-[600px]"
        >
          <Advanced3DBlackHole
            mass={mass}
            spinParameter={spinParameter}
            showAccretionDisk={showAccretionDisk}
            showEventHorizon={showEventHorizon}
          />
        </motion.div>

        {/* Controls and Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Controls */}
          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4 flex items-center gap-2">
              <Gauge size={20} />
              Parameters
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-secondary-foreground mb-2 block">
                  Mass: {mass.toFixed(1)} M☉
                </label>
                <Slider
                  value={[mass]}
                  onValueChange={(val) => setMass(val[0])}
                  min={1}
                  max={1000}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm text-secondary-foreground mb-2 block">
                  Spin Parameter: {spinParameter.toFixed(2)}
                </label>
                <Slider
                  value={[spinParameter]}
                  onValueChange={(val) => setSpinParameter(val[0])}
                  min={0}
                  max={0.9999}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAccretionDisk}
                    onChange={(e) => setShowAccretionDisk(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-secondary-foreground">Show Accretion Disk</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEventHorizon}
                    onChange={(e) => setShowEventHorizon(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-secondary-foreground">Show Event Horizon</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Physical Properties */}
          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4 flex items-center gap-2">
              <Info size={20} />
              Physical Properties
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Schwarzschild Radius:</span>
                <span className="text-aerospace-blue font-mono">
                  {(schwarzschildRadius / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Ergosphere Radius:</span>
                <span className="text-aerospace-blue font-mono">
                  {(ergosphereRadius / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Photon Sphere:</span>
                <span className="text-aerospace-blue font-mono">
                  {(photonSphereRadius / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Event Horizon Area:</span>
                <span className="text-aerospace-blue font-mono">
                  {(4 * Math.PI * schwarzschildRadius * schwarzschildRadius / 1e12).toFixed(2)} × 10¹² km²
                </span>
              </div>
            </div>
          </Card>

          {/* Relativistic Effects */}
          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4 flex items-center gap-2">
              <Zap size={20} />
              Relativistic Effects
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Time Dilation (Photon Sphere):</span>
                <span className="text-aerospace-blue font-mono">
                  {timeDilationAtPhotonSphere.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Lensing Angle:</span>
                <span className="text-aerospace-blue font-mono">
                  {(lensingAngle * 206265).toFixed(2)} arcsec
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Escape Velocity (Surface):</span>
                <span className="text-aerospace-blue font-mono">
                  {(CONSTANTS.SPEED_OF_LIGHT * Math.sqrt(schwarzschildRadius / (schwarzschildRadius * 2))).toFixed(0)} m/s
                </span>
              </div>
              <div className="text-xs text-secondary-foreground mt-4">
                At the event horizon, escape velocity equals the speed of light.
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Physics Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4">Schwarzschild Black Holes</h3>
            <p className="text-sm text-secondary-foreground mb-4">
              Non-rotating black holes described by the Schwarzschild metric. The event horizon is a perfect sphere
              where spacetime curvature becomes infinite.
            </p>
            <ul className="text-sm text-secondary-foreground space-y-2">
              <li>• Event horizon: r_s = 2GM/c²</li>
              <li>• Photon sphere: r_p = 1.5 × r_s</li>
              <li>• No escape beyond event horizon</li>
            </ul>
          </Card>

          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4">Kerr Black Holes</h3>
            <p className="text-sm text-secondary-foreground mb-4">
              Rotating black holes with spin parameter a (0 ≤ a ≤ M). The ergosphere allows energy extraction
              via the Penrose process.
            </p>
            <ul className="text-sm text-secondary-foreground space-y-2">
              <li>• Ergosphere: r_e = M + √(M² - a²)</li>
              <li>• Frame-dragging effects</li>
              <li>• Penrose process energy extraction</li>
            </ul>
          </Card>

          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4">Accretion Disks</h3>
            <p className="text-sm text-secondary-foreground mb-4">
              Matter spiraling into black holes forms accretion disks with extreme temperatures and radiation.
            </p>
            <ul className="text-sm text-secondary-foreground space-y-2">
              <li>• Innermost stable circular orbit (ISCO)</li>
              <li>• X-ray and gamma-ray emission</li>
              <li>• Relativistic jets</li>
            </ul>
          </Card>

          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4">Gravitational Lensing</h3>
            <p className="text-sm text-secondary-foreground mb-4">
              Massive black holes bend spacetime, deflecting light paths and creating multiple images of distant objects.
            </p>
            <ul className="text-sm text-secondary-foreground space-y-2">
              <li>• Einstein rings and arcs</li>
              <li>• Strong lensing regime</li>
              <li>• Magnification effects</li>
            </ul>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
