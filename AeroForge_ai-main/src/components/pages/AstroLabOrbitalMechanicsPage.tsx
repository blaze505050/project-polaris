import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfessionalDataPanel from '@/components/ProfessionalDataPanel';
import TelemetryDisplay from '@/components/TelemetryDisplay';
import EquationDisplay from '@/components/EquationDisplay';
import { DataFormatter } from '@/services/dataFormatting';
import { AstronomicalConstants, getOrbitalPeriod, getOrbitalVelocity, getEscapeVelocity } from '@/services/astronomicalConstants';

export default function AstroLabOrbitalMechanicsPage() {
  const navigate = useNavigate();
  const [semiMajorAxis, setSemiMajorAxis] = useState(6.6e6); // meters (LEO)
  const [eccentricity, setEccentricity] = useState(0.001);
  const [inclination, setInclination] = useState(51.6); // degrees
  const [centralBody, setCentralBody] = useState('earth');

  // Get gravitational parameter based on central body
  const getGM = () => {
    switch (centralBody) {
      case 'sun':
        return AstronomicalConstants.STANDARD_GRAVITATIONAL_PARAMETER_SUN;
      case 'moon':
        return AstronomicalConstants.STANDARD_GRAVITATIONAL_PARAMETER_MOON;
      case 'earth':
      default:
        return AstronomicalConstants.STANDARD_GRAVITATIONAL_PARAMETER_EARTH;
    }
  };

  const GM = getGM();

  // Calculate orbital elements
  const orbitalPeriod = getOrbitalPeriod(semiMajorAxis, GM / AstronomicalConstants.GRAVITATIONAL_CONSTANT);
  const orbitalVelocity = getOrbitalVelocity(semiMajorAxis, GM / AstronomicalConstants.GRAVITATIONAL_CONSTANT);
  const escapeVelocity = getEscapeVelocity(semiMajorAxis, GM / AstronomicalConstants.GRAVITATIONAL_CONSTANT);

  // Calculate periapsis and apoapsis
  const periapsis = semiMajorAxis * (1 - eccentricity);
  const apoapsis = semiMajorAxis * (1 + eccentricity);

  // Get central body radius
  const getCentralBodyRadius = () => {
    switch (centralBody) {
      case 'sun':
        return AstronomicalConstants.SOLAR_RADIUS;
      case 'moon':
        return AstronomicalConstants.MOON_RADIUS;
      case 'earth':
      default:
        return AstronomicalConstants.EARTH_RADIUS;
    }
  };

  const centralBodyRadius = getCentralBodyRadius();
  const periapsisAltitude = periapsis - centralBodyRadius;
  const apoapsisAltitude = apoapsis - centralBodyRadius;

  // Calculate specific orbital energy
  const specificEnergy = -(GM / (2 * semiMajorAxis));

  // Calculate specific angular momentum
  const specificAngularMomentum = Math.sqrt(GM * semiMajorAxis * (1 - eccentricity ** 2));

  const telemetryMetrics = [
    {
      name: 'Semi-Major Axis',
      value: DataFormatter.distance(semiMajorAxis),
      unit: '',
      status: 'normal' as const,
      precision: 2,
    },
    {
      name: 'Eccentricity',
      value: eccentricity,
      unit: '',
      status: eccentricity < 1 ? ('normal' as const) : ('critical' as const),
      min: 0,
      max: 1,
      precision: 4,
    },
    {
      name: 'Inclination',
      value: inclination,
      unit: '°',
      status: 'normal' as const,
      min: 0,
      max: 180,
      precision: 2,
    },
    {
      name: 'Orbital Period',
      value: DataFormatter.orbitalPeriod(orbitalPeriod),
      unit: '',
      status: 'normal' as const,
      precision: 2,
    },
    {
      name: 'Orbital Velocity',
      value: DataFormatter.velocity(orbitalVelocity),
      unit: '',
      status: 'normal' as const,
      precision: 2,
    },
  ];

  const orbitalElementsData = {
    'Semi-Major Axis': DataFormatter.distance(semiMajorAxis),
    'Eccentricity': eccentricity.toFixed(6),
    'Inclination': `${inclination.toFixed(2)}°`,
    'Periapsis Distance': DataFormatter.distance(periapsis),
    'Apoapsis Distance': DataFormatter.distance(apoapsis),
    'Periapsis Altitude': DataFormatter.distance(periapsisAltitude),
    'Apoapsis Altitude': DataFormatter.distance(apoapsisAltitude),
  };

  const dynamicsData = {
    'Orbital Period': DataFormatter.orbitalPeriod(orbitalPeriod),
    'Orbital Velocity': DataFormatter.velocity(orbitalVelocity),
    'Escape Velocity': DataFormatter.velocity(escapeVelocity),
    'Specific Energy': DataFormatter.scientific(specificEnergy, 3),
    'Specific Angular Momentum': DataFormatter.scientific(specificAngularMomentum, 3),
    'Mean Motion': `${(2 * Math.PI / orbitalPeriod).toFixed(6)} rad/s`,
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-foreground flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[120rem] mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/astrolab')}
                className="flex items-center gap-2 text-secondary-foreground hover:text-[#00F0FF] transition-colors mb-4 font-mono text-sm"
              >
                <ArrowLeft size={16} />
                Back to AstroLab
              </button>
              <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">ORBITAL MECHANICS</h1>
              <p className="text-secondary-foreground font-mono text-sm mt-2">Keplerian Elements & Orbital Dynamics Analysis</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-[#131924]/60 border border-[#00F0FF]/20 rounded hover:border-[#00F0FF]/50 transition-colors">
                <Download size={18} className="text-[#00F0FF]" />
              </button>
              <button className="p-3 bg-[#131924]/60 border border-[#00F0FF]/20 rounded hover:border-[#00F0FF]/50 transition-colors">
                <Settings size={18} className="text-[#00F0FF]" />
              </button>
            </div>
          </div>

          {/* Central Body Selection */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
            <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">CENTRAL BODY</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'earth', label: 'Earth', mass: AstronomicalConstants.EARTH_MASS },
                { id: 'moon', label: 'Moon', mass: AstronomicalConstants.MOON_MASS },
                { id: 'sun', label: 'Sun', mass: AstronomicalConstants.SOLAR_MASS },
              ].map((body) => (
                <button
                  key={body.id}
                  onClick={() => setCentralBody(body.id)}
                  className={`py-3 px-4 rounded border font-mono text-sm transition-all ${
                    centralBody === body.id
                      ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#0B0E14] border-[#00F0FF]/20 text-secondary-foreground hover:border-[#00F0FF]/50'
                  }`}
                >
                  <div className="font-bold">{body.label}</div>
                  <div className="text-xs text-secondary-foreground mt-1">{DataFormatter.mass(body.mass)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Orbital Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">SEMI-MAJOR AXIS</h3>
              <input
                type="range"
                min="6.4e6"
                max="4e7"
                step="1e5"
                value={semiMajorAxis}
                onChange={(e) => setSemiMajorAxis(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm font-mono text-[#00F0FF] mt-3">{DataFormatter.distance(semiMajorAxis)}</div>
              <div className="text-xs text-secondary-foreground mt-1 font-mono">Range: 6.4e6 - 4e7 m</div>
            </div>

            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">ECCENTRICITY</h3>
              <input
                type="range"
                min="0"
                max="0.99"
                step="0.01"
                value={eccentricity}
                onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm font-mono text-[#00F0FF] mt-3">{eccentricity.toFixed(4)}</div>
              <div className="text-xs text-secondary-foreground mt-1 font-mono">
                {eccentricity < 0.1 ? 'Circular' : eccentricity < 0.5 ? 'Elliptical' : 'Highly Eccentric'}
              </div>
            </div>

            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">INCLINATION</h3>
              <input
                type="range"
                min="0"
                max="180"
                step="1"
                value={inclination}
                onChange={(e) => setInclination(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm font-mono text-[#00F0FF] mt-3">{inclination.toFixed(2)}°</div>
              <div className="text-xs text-secondary-foreground mt-1 font-mono">
                {inclination === 0 ? 'Equatorial' : inclination === 90 ? 'Polar' : 'Inclined'}
              </div>
            </div>
          </div>

          {/* Telemetry Display */}
          <TelemetryDisplay metrics={telemetryMetrics} title="ORBITAL PARAMETERS" />

          {/* Data Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalDataPanel
              title="ORBITAL ELEMENTS"
              data={orbitalElementsData}
              format="table"
              precision={3}
              copyable
              downloadable
            />
            <ProfessionalDataPanel
              title="ORBITAL DYNAMICS"
              data={dynamicsData}
              format="table"
              precision={3}
              copyable
              downloadable
            />
          </div>

          {/* Fundamental Equations */}
          <div className="space-y-6">
            <EquationDisplay
              title="KEPLER'S THIRD LAW"
              latex="T^2 = \\frac{4\\pi^2}{GM} a^3"
              description="Relationship between orbital period and semi-major axis"
              variables={{
                'T': 'Orbital period',
                'a': 'Semi-major axis',
                'G': 'Gravitational constant',
                'M': 'Central body mass',
              }}
            />

            <EquationDisplay
              title="ORBITAL VELOCITY"
              latex="v = \\sqrt{\\frac{GM}{r}}"
              description="Velocity required for circular orbit at distance r"
              variables={{
                'v': 'Orbital velocity',
                'r': 'Orbital radius',
                'G': 'Gravitational constant',
                'M': 'Central body mass',
              }}
            />

            <EquationDisplay
              title="ESCAPE VELOCITY"
              latex="v_{esc} = \\sqrt{\\frac{2GM}{r}}"
              description="Minimum velocity to escape gravitational field"
              variables={{
                'v_esc': 'Escape velocity',
                'r': 'Distance from center',
                'G': 'Gravitational constant',
                'M': 'Central body mass',
              }}
            />

            <EquationDisplay
              title="SPECIFIC ORBITAL ENERGY"
              latex="\\varepsilon = -\\frac{GM}{2a}"
              description="Energy per unit mass in orbit"
              variables={{
                'ε': 'Specific orbital energy',
                'a': 'Semi-major axis',
                'G': 'Gravitational constant',
                'M': 'Central body mass',
              }}
            />

            <EquationDisplay
              title="SPECIFIC ANGULAR MOMENTUM"
              latex="h = \\sqrt{GM \\cdot a(1-e^2)}"
              description="Angular momentum per unit mass"
              variables={{
                'h': 'Specific angular momentum',
                'a': 'Semi-major axis',
                'e': 'Eccentricity',
                'G': 'Gravitational constant',
                'M': 'Central body mass',
              }}
            />
          </div>

          {/* Standards & References */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#10B981]/20 rounded p-6">
            <h3 className="text-sm font-bold text-[#10B981] font-mono mb-4">STANDARDS & REFERENCES</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">Keplerian Elements</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">Two-Body Problem</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">IEEE 754 Precision</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">J2000.0 Epoch</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">UTC Timescale</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
