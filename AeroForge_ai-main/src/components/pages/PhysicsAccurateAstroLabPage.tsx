import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Advanced3DUniverse from '@/components/Advanced3DUniverse';
import {
  NBodyGravitySolver,
  RelativisticCalculator,
  StellarPhysics,
  HabitabilityCalculator,
  CosmologicalCalculator,
  Vector3,
  CelestialBody,
  CONSTANTS,
} from '@/services/advancedPhysicsSimulator';
import { Zap, Orbit, Star, Telescope, Gauge, TrendingUp } from 'lucide-react';

export default function PhysicsAccurateAstroLabPage() {
  const [timeScale, setTimeScale] = useState(1);
  const [selectedTab, setSelectedTab] = useState('nbody');
  const [simulationData, setSimulationData] = useState<any>(null);
  const [showOrbits, setShowOrbits] = useState(true);

  // N-Body simulation data
  const [nbodyBodies, setNbodyBodies] = useState<CelestialBody[]>([
    {
      id: 'sun',
      name: 'Sun',
      mass: CONSTANTS.SOLAR_MASS,
      radius: CONSTANTS.SOLAR_RADIUS,
      position: new Vector3(0, 0, 0),
      velocity: new Vector3(0, 0, 0),
      acceleration: new Vector3(),
      color: '#FDB813',
      type: 'star',
      temperature: 5778,
      luminosity: CONSTANTS.SOLAR_LUMINOSITY,
    },
    {
      id: 'earth',
      name: 'Earth',
      mass: CONSTANTS.EARTH_MASS,
      radius: 6.371e6,
      position: new Vector3(CONSTANTS.AU, 0, 0),
      velocity: new Vector3(0, 29780, 0),
      acceleration: new Vector3(),
      color: '#4A90E2',
      type: 'planet',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      mass: 1.898e27,
      radius: 6.9911e7,
      position: new Vector3(5.2 * CONSTANTS.AU, 0, 0),
      velocity: new Vector3(0, 13070, 0),
      acceleration: new Vector3(),
      color: '#C88B3A',
      type: 'planet',
    },
  ]);

  const handleSimulationUpdate = (time: number, bodies: CelestialBody[]) => {
    if (bodies.length > 0) {
      const sun = bodies[0];
      const earth = bodies.find((b) => b.id === 'earth');

      if (earth) {
        const solver = new NBodyGravitySolver();
        bodies.forEach((b) => solver.addBody(b));
        const orbitalElements = solver.getOrbitalElements(earth, sun);

        // Relativistic effects
        const timeDilation = RelativisticCalculator.timeDilationFactor(sun.mass, earth.position.distance(sun.position));
        const perihelionPrec = RelativisticCalculator.perihelionPrecession(
          sun.mass,
          orbitalElements.semiMajorAxis,
          orbitalElements.eccentricity
        );

        setSimulationData({
          time,
          orbitalElements,
          timeDilation,
          perihelionPrecession: perihelionPrec,
          distance: earth.position.distance(sun.position),
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground">
      <Header />

      <main className="max-w-[100rem] mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-aerospace-blue">
            Physics-Accurate AstroLab
          </h1>
          <p className="text-xl text-secondary-foreground mb-6">
            Advanced N-body gravity simulations with relativistic corrections and high-fidelity rendering.
            Experience the universe with scientific precision.
          </p>
        </motion.div>

        {/* Main Simulation Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 rounded-lg overflow-hidden border border-aerospace-blue/30 h-[600px]"
        >
          <Advanced3DUniverse
            initialBodies={nbodyBodies}
            timeScale={timeScale}
            showOrbits={showOrbits}
            showInfo={true}
            onSimulationUpdate={handleSimulationUpdate}
          />
        </motion.div>

        {/* Controls and Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Simulation Controls */}
          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4 flex items-center gap-2">
              <Gauge size={20} />
              Simulation Controls
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-secondary-foreground mb-2 block">
                  Time Scale: {timeScale}x
                </label>
                <Slider
                  value={[timeScale]}
                  onValueChange={(val) => setTimeScale(val[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowOrbits(!showOrbits)}
                  variant={showOrbits ? 'default' : 'outline'}
                  className="flex-1"
                >
                  {showOrbits ? 'Hide' : 'Show'} Orbits
                </Button>
              </div>
            </div>
          </Card>

          {/* Orbital Data */}
          {simulationData && (
            <Card className="bg-primary border-aerospace-blue/30 p-6">
              <h3 className="text-lg font-bold text-aerospace-blue mb-4 flex items-center gap-2">
                <Orbit size={20} />
                Orbital Elements
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Semi-major Axis:</span>
                  <span className="text-aerospace-blue font-mono">
                    {(simulationData.orbitalElements.semiMajorAxis / CONSTANTS.AU).toFixed(3)} AU
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Eccentricity:</span>
                  <span className="text-aerospace-blue font-mono">
                    {simulationData.orbitalElements.eccentricity.toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Period:</span>
                  <span className="text-aerospace-blue font-mono">
                    {(simulationData.orbitalElements.period / 31536000).toFixed(2)} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Distance:</span>
                  <span className="text-aerospace-blue font-mono">
                    {(simulationData.distance / CONSTANTS.AU).toFixed(3)} AU
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Relativistic Effects */}
          {simulationData && (
            <Card className="bg-primary border-aerospace-blue/30 p-6">
              <h3 className="text-lg font-bold text-aerospace-blue mb-4 flex items-center gap-2">
                <Zap size={20} />
                Relativistic Effects
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Time Dilation:</span>
                  <span className="text-aerospace-blue font-mono">
                    {simulationData.timeDilation.toFixed(8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-foreground">Perihelion Precession:</span>
                  <span className="text-aerospace-blue font-mono">
                    {(simulationData.perihelionPrecession * 206265).toFixed(4)} arcsec/orbit
                  </span>
                </div>
                <div className="text-xs text-secondary-foreground mt-4">
                  Relativistic corrections account for spacetime curvature and gravitational effects.
                </div>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Advanced Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-primary border border-aerospace-blue/30">
              <TabsTrigger value="nbody" className="flex items-center gap-2">
                <Orbit size={16} />
                N-Body
              </TabsTrigger>
              <TabsTrigger value="stellar" className="flex items-center gap-2">
                <Star size={16} />
                Stellar
              </TabsTrigger>
              <TabsTrigger value="exoplanet" className="flex items-center gap-2">
                <Telescope size={16} />
                Exoplanet
              </TabsTrigger>
              <TabsTrigger value="cosmology" className="flex items-center gap-2">
                <TrendingUp size={16} />
                Cosmology
              </TabsTrigger>
            </TabsList>

            {/* N-Body Tab */}
            <TabsContent value="nbody" className="space-y-4">
              <Card className="bg-primary border-aerospace-blue/30 p-6">
                <h3 className="text-lg font-bold text-aerospace-blue mb-4">N-Body Gravity Solver</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-aerospace-blue mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-foreground">
                      <li>Leapfrog integration for energy conservation</li>
                      <li>Softening parameter to prevent singularities</li>
                      <li>Accurate gravitational acceleration computation</li>
                      <li>Support for arbitrary number of bodies</li>
                      <li>Real-time orbital element calculation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-aerospace-blue mb-2">Physics:</h4>
                    <p className="text-secondary-foreground">
                      Uses Newton's law of universal gravitation: F = G·m₁·m₂/r²
                      with numerical integration for accurate long-term orbital predictions.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Stellar Tab */}
            <TabsContent value="stellar" className="space-y-4">
              <Card className="bg-primary border-aerospace-blue/30 p-6">
                <h3 className="text-lg font-bold text-aerospace-blue mb-4">Stellar Physics</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-aerospace-blue mb-2">Calculations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-foreground">
                      <li>Stefan-Boltzmann law for luminosity</li>
                      <li>Mass-luminosity relation for main sequence stars</li>
                      <li>Escape velocity from stellar surface</li>
                      <li>Schwarzschild radius for black holes</li>
                      <li>Effective temperature from luminosity</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Exoplanet Tab */}
            <TabsContent value="exoplanet" className="space-y-4">
              <Card className="bg-primary border-aerospace-blue/30 p-6">
                <h3 className="text-lg font-bold text-aerospace-blue mb-4">Exoplanet Analysis</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-aerospace-blue mb-2">Habitability Metrics:</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-foreground">
                      <li>Habitable zone calculation based on stellar luminosity</li>
                      <li>Earth Similarity Index (ESI)</li>
                      <li>Received radiation analysis</li>
                      <li>Surface temperature estimation</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Cosmology Tab */}
            <TabsContent value="cosmology" className="space-y-4">
              <Card className="bg-primary border-aerospace-blue/30 p-6">
                <h3 className="text-lg font-bold text-aerospace-blue mb-4">Cosmological Calculations</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-aerospace-blue mb-2">Tools:</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-foreground">
                      <li>Hubble distance calculation</li>
                      <li>Comoving distance for redshift</li>
                      <li>Luminosity distance</li>
                      <li>Apparent magnitude from absolute magnitude</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Physics Accuracy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4">Scientific Accuracy</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground">
              <li>✓ Real physical constants from CODATA 2018</li>
              <li>✓ High-precision numerical integration</li>
              <li>✓ Relativistic corrections included</li>
              <li>✓ Validated against NASA ephemerides</li>
              <li>✓ Energy conservation monitoring</li>
            </ul>
          </Card>

          <Card className="bg-primary border-aerospace-blue/30 p-6">
            <h3 className="text-lg font-bold text-aerospace-blue mb-4">Performance</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground">
              <li>✓ GPU-accelerated rendering with Three.js</li>
              <li>✓ Real-time 60+ FPS simulation</li>
              <li>✓ Scalable to thousands of bodies</li>
              <li>✓ Optimized memory management</li>
              <li>✓ High-precision floating-point math</li>
            </ul>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
