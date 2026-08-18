import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Droplets, Thermometer, Wind, Zap, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AstronomicalConstants } from '@/services/astronomicalConstants';

interface HabitabilityResult {
  habitabilityIndex: number;
  inHabitableZone: boolean;
  equilibriumTemp: number;
  greenhouseEffect: number;
  waterPresence: number;
  atmosphericRetention: number;
  magneticProtection: number;
  overallScore: number;
  assessment: string;
  recommendations: string[];
}

export default function AstroLabExoplanetHabitabilityPage() {
  const navigate = useNavigate();
  
  // Star parameters
  const [starMass, setStarMass] = useState(1.0); // Solar masses
  const [starLuminosity, setStarLuminosity] = useState(1.0); // Solar luminosities
  const [starTemperature, setStarTemperature] = useState(5778); // Kelvin
  
  // Planet parameters
  const [planetMass, setPlanetMass] = useState(1.0); // Earth masses
  const [planetRadius, setPlanetRadius] = useState(1.0); // Earth radii
  const [orbitalDistance, setOrbitalDistance] = useState(1.0); // AU
  const [eccentricity, setEccentricity] = useState(0.0167);
  const [axialTilt, setAxialTilt] = useState(23.44); // degrees
  const [atmosphericComposition, setAtmosphericComposition] = useState('earth-like'); // earth-like, venus-like, mars-like

  // Calculate habitability metrics
  const habitability = useMemo(() => {
    const result: HabitabilityResult = {
      habitabilityIndex: 0,
      inHabitableZone: false,
      equilibriumTemp: 0,
      greenhouseEffect: 0,
      waterPresence: 0,
      atmosphericRetention: 0,
      magneticProtection: 0,
      overallScore: 0,
      assessment: '',
      recommendations: [],
    };

    // 1. Habitable Zone Calculation (Kopparapu et al. 2013)
    const starLumW = starLuminosity * AstronomicalConstants.SOLAR_LUMINOSITY;
    const starTempK = starTemperature;
    
    // Recent Venus limit (inner edge)
    const recentVenusLimit = 0.95 * Math.sqrt(starLumW / AstronomicalConstants.SOLAR_LUMINOSITY);
    
    // Early Mars limit (outer edge)
    const earlyMarsLimit = 1.37 * Math.sqrt(starLumW / AstronomicalConstants.SOLAR_LUMINOSITY);
    
    result.inHabitableZone = orbitalDistance >= recentVenusLimit && orbitalDistance <= earlyMarsLimit;

    // 2. Equilibrium Temperature (Stefan-Boltzmann)
    const albedo = atmosphericComposition === 'venus-like' ? 0.7 : atmosphericComposition === 'mars-like' ? 0.25 : 0.3;
    const solarFlux = (starLuminosity * AstronomicalConstants.SOLAR_CONSTANT) / (orbitalDistance * orbitalDistance);
    const equilibriumTempK = Math.pow((solarFlux * (1 - albedo)) / (4 * 5.67e-8), 0.25);
    result.equilibriumTemp = equilibriumTempK - 273.15; // Convert to Celsius

    // 3. Greenhouse Effect Factor
    let greenhouseFactor = 1.0;
    if (atmosphericComposition === 'earth-like') {
      greenhouseFactor = 1.33; // Earth's greenhouse effect
    } else if (atmosphericComposition === 'venus-like') {
      greenhouseFactor = 1.9; // Venus-like runaway greenhouse
    } else if (atmosphericComposition === 'mars-like') {
      greenhouseFactor = 1.05; // Mars-like thin atmosphere
    }
    result.greenhouseEffect = equilibriumTempK * greenhouseFactor - 273.15;

    // 4. Water Presence Probability
    let waterScore = 0.5; // Base score
    
    // Distance from habitable zone center
    const zoneCenter = (recentVenusLimit + earlyMarsLimit) / 2;
    const zoneWidth = earlyMarsLimit - recentVenusLimit;
    const distanceFromCenter = Math.abs(orbitalDistance - zoneCenter) / (zoneWidth / 2);
    waterScore += (1 - Math.min(distanceFromCenter, 1)) * 0.3;
    
    // Atmospheric composition
    if (atmosphericComposition === 'earth-like') {
      waterScore += 0.15;
    } else if (atmosphericComposition === 'venus-like') {
      waterScore -= 0.2; // Runaway greenhouse
    }
    
    // Eccentricity (high eccentricity destabilizes climate)
    waterScore -= eccentricity * 0.1;
    
    result.waterPresence = Math.max(0, Math.min(1, waterScore));

    // 5. Atmospheric Retention (escape velocity vs thermal velocity)
    const planetMassKg = planetMass * AstronomicalConstants.EARTH_MASS;
    const planetRadiusM = planetRadius * AstronomicalConstants.EARTH_RADIUS;
    const escapeVelocity = Math.sqrt(2 * AstronomicalConstants.GRAVITATIONAL_CONSTANT * planetMassKg / planetRadiusM);
    
    // Thermal velocity at exobase (simplified)
    const exobaseTemp = result.equilibriumTemp + 100; // Rough estimate
    const thermalVelocity = Math.sqrt(3 * AstronomicalConstants.BOLTZMANN_CONSTANT * exobaseTemp / (2e-26)); // H atom mass
    
    const retentionRatio = escapeVelocity / thermalVelocity;
    result.atmosphericRetention = Math.min(1, Math.max(0, (retentionRatio - 5) / 10)); // Normalized

    // 6. Magnetic Protection (proxy based on mass and rotation)
    const magneticScore = Math.min(1, (planetMass / 1.0) * 0.7); // Mass-based estimate
    const tiltPenalty = Math.abs(axialTilt - 23.44) / 90; // Deviation from Earth-like
    result.magneticProtection = Math.max(0, magneticScore - tiltPenalty * 0.2);

    // 7. Overall Habitability Index (weighted average)
    const weights = {
      zone: 0.25,
      water: 0.25,
      atmosphere: 0.2,
      magnetic: 0.15,
      temperature: 0.15,
    };

    const tempScore = Math.max(0, 1 - Math.abs(result.equilibriumTemp - 15) / 100); // Optimal ~15°C
    
    result.overallScore = 
      (result.inHabitableZone ? 1 : 0.3) * weights.zone +
      result.waterPresence * weights.water +
      result.atmosphericRetention * weights.atmosphere +
      result.magneticProtection * weights.magnetic +
      tempScore * weights.temperature;

    // Assessment
    if (result.overallScore >= 0.8) {
      result.assessment = 'Highly Habitable - Excellent candidate for life';
      result.recommendations = [
        'Priority target for biosignature detection',
        'Consider for future exoplanet missions',
        'Favorable conditions for Earth-like life',
      ];
    } else if (result.overallScore >= 0.6) {
      result.assessment = 'Potentially Habitable - Moderate conditions';
      result.recommendations = [
        'Further atmospheric analysis needed',
        'Monitor for seasonal climate variations',
        'Assess for extremophile life potential',
      ];
    } else if (result.overallScore >= 0.4) {
      result.assessment = 'Marginal Habitability - Challenging conditions';
      result.recommendations = [
        'Extreme environment - limited life potential',
        'Focus on subsurface habitability',
        'Study for abiotic chemistry insights',
      ];
    } else {
      result.assessment = 'Uninhabitable - Hostile conditions';
      result.recommendations = [
        'Conditions unsuitable for known life',
        'Study for planetary evolution insights',
        'Consider for resource assessment',
      ];
    }

    return result;
  }, [starMass, starLuminosity, starTemperature, planetMass, planetRadius, orbitalDistance, eccentricity, axialTilt, atmosphericComposition]);

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      star: { mass: starMass, luminosity: starLuminosity, temperature: starTemperature },
      planet: { mass: planetMass, radius: planetRadius, orbitalDistance, eccentricity, axialTilt },
      results: habitability,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exoplanet-habitability-${Date.now()}.json`;
    a.click();
  };

  const scoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    if (score >= 0.4) return 'text-orange-400';
    return 'text-red-400';
  };

  const scoreBarColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    if (score >= 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/astrolab/orbital-mechanics')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to AstroLab
          </button>
          
          <h1 className="text-5xl font-bold text-white mb-4">Exoplanet Habitability Calculator</h1>
          <p className="text-xl text-slate-300">
            Assess the potential for life on distant worlds using advanced astrophysical models
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" />
                System Parameters
              </h2>

              {/* Star Parameters */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wider">Star</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Mass (Solar Masses)</label>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={starMass}
                      onChange={(e) => setStarMass(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{starMass.toFixed(1)} M☉</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Luminosity (Solar Luminosities)</label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={starLuminosity}
                      onChange={(e) => setStarLuminosity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{starLuminosity.toFixed(1)} L☉</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Temperature (K)</label>
                    <input
                      type="range"
                      min="3000"
                      max="10000"
                      step="100"
                      value={starTemperature}
                      onChange={(e) => setStarTemperature(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{starTemperature.toFixed(0)} K</div>
                  </div>
                </div>
              </div>

              {/* Planet Parameters */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wider">Planet</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Mass (Earth Masses)</label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={planetMass}
                      onChange={(e) => setPlanetMass(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{planetMass.toFixed(1)} M⊕</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Radius (Earth Radii)</label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={planetRadius}
                      onChange={(e) => setPlanetRadius(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{planetRadius.toFixed(1)} R⊕</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Orbital Distance (AU)</label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.05"
                      value={orbitalDistance}
                      onChange={(e) => setOrbitalDistance(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{orbitalDistance.toFixed(2)} AU</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Eccentricity</label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.01"
                      value={eccentricity}
                      onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{eccentricity.toFixed(3)}</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Axial Tilt (°)</label>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="1"
                      value={axialTilt}
                      onChange={(e) => setAxialTilt(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right text-sm text-cyan-300 font-mono">{axialTilt.toFixed(1)}°</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Atmosphere Type</label>
                    <select
                      value={atmosphericComposition}
                      onChange={(e) => setAtmosphericComposition(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="earth-like">Earth-like</option>
                      <option value="venus-like">Venus-like</option>
                      <option value="mars-like">Mars-like</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleExport}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Export Results
              </Button>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Overall Score */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Habitability Index</h3>
                  <div className={`text-5xl font-bold ${scoreColor(habitability.overallScore)}`}>
                    {(habitability.overallScore * 100).toFixed(1)}%
                  </div>
                </div>
                <div className={`text-3xl ${habitability.inHabitableZone ? 'text-green-400' : 'text-red-400'}`}>
                  {habitability.inHabitableZone ? '✓' : '✗'}
                </div>
              </div>
              
              <p className="text-lg text-white mb-4">{habitability.assessment}</p>
              
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${habitability.overallScore * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${scoreBarColor(habitability.overallScore)}`}
                />
              </div>
            </Card>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Thermometer size={18} className="text-orange-400" />
                  <h4 className="text-sm font-semibold text-slate-300">Equilibrium Temp</h4>
                </div>
                <div className="text-2xl font-bold text-white">{habitability.equilibriumTemp.toFixed(1)}°C</div>
                <div className="text-xs text-slate-400 mt-2">Greenhouse: {habitability.greenhouseEffect.toFixed(1)}°C</div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets size={18} className="text-blue-400" />
                  <h4 className="text-sm font-semibold text-slate-300">Water Presence</h4>
                </div>
                <div className="text-2xl font-bold text-white">{(habitability.waterPresence * 100).toFixed(0)}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${habitability.waterPresence * 100}%` }}
                  />
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wind size={18} className="text-cyan-400" />
                  <h4 className="text-sm font-semibold text-slate-300">Atmospheric Retention</h4>
                </div>
                <div className="text-2xl font-bold text-white">{(habitability.atmosphericRetention * 100).toFixed(0)}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500"
                    style={{ width: `${habitability.atmosphericRetention * 100}%` }}
                  />
                </div>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={18} className="text-yellow-400" />
                  <h4 className="text-sm font-semibold text-slate-300">Magnetic Protection</h4>
                </div>
                <div className="text-2xl font-bold text-white">{(habitability.magneticProtection * 100).toFixed(0)}%</div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${habitability.magneticProtection * 100}%` }}
                  />
                </div>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={18} />
                Assessment & Recommendations
              </h4>
              <ul className="space-y-3">
                {habitability.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-300">
                    <span className="text-cyan-400 font-bold mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
