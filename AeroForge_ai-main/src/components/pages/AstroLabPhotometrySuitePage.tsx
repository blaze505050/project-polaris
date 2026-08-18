import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Settings, Zap, Database, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfessionalDataPanel from '@/components/ProfessionalDataPanel';
import TelemetryDisplay from '@/components/TelemetryDisplay';
import EquationDisplay from '@/components/EquationDisplay';
import { DataFormatter } from '@/services/dataFormatting';
import { AstronomicalConstants, PhotometricSystems } from '@/services/astronomicalConstants';

export default function AstroLabPhotometrySuitePage() {
  const navigate = useNavigate();
  const [selectedBand, setSelectedBand] = useState('V');
  const [apertureDiameter, setApertureDiameter] = useState(0.5); // meters
  const [exposureTime, setExposureTime] = useState(300); // seconds
  const [targetMagnitude, setTargetMagnitude] = useState(10.5);
  const [skyBrightness, setSkyBrightness] = useState(21.0); // mag/arcsec²

  // Calculate photometric metrics
  const calculatePhotometry = () => {
    const apertureArea = Math.PI * (apertureDiameter / 2) ** 2;
    const collectingPower = apertureArea / (Math.PI * 0.01 ** 2); // relative to 1cm aperture
    const signalPhotons = collectingPower * exposureTime * Math.pow(10, -targetMagnitude / 2.5);
    const skyPhotons = collectingPower * exposureTime * Math.pow(10, -skyBrightness / 2.5) * apertureArea;
    const snr = signalPhotons / Math.sqrt(signalPhotons + skyPhotons + 100); // 100 = read noise

    return {
      apertureArea,
      collectingPower,
      signalPhotons: Math.round(signalPhotons),
      skyPhotons: Math.round(skyPhotons),
      snr: snr.toFixed(2),
      limitingMagnitude: (targetMagnitude - 2.5 * Math.log10(snr)).toFixed(2),
    };
  };

  const photometry = calculatePhotometry();

  const telemetryMetrics = [
    {
      name: 'Aperture Diameter',
      value: apertureDiameter,
      unit: 'm',
      status: 'normal' as const,
      min: 0.1,
      max: 2.0,
      precision: 2,
    },
    {
      name: 'Exposure Time',
      value: exposureTime,
      unit: 's',
      status: 'normal' as const,
      min: 1,
      max: 3600,
      precision: 0,
    },
    {
      name: 'Target Magnitude',
      value: targetMagnitude,
      unit: 'mag',
      status: 'normal' as const,
      precision: 1,
    },
    {
      name: 'Sky Brightness',
      value: skyBrightness,
      unit: 'mag/arcsec²',
      status: 'normal' as const,
      min: 18,
      max: 22,
      precision: 1,
    },
    {
      name: 'Signal-to-Noise Ratio',
      value: photometry.snr,
      unit: '',
      status: parseFloat(photometry.snr) > 10 ? ('normal' as const) : ('warning' as const),
      min: 0,
      max: 100,
      precision: 1,
    },
  ];

  const photometryData = {
    'Aperture Area': `${(photometry.apertureArea * 1e4).toFixed(2)} cm²`,
    'Collecting Power': `${photometry.collectingPower.toFixed(1)}×`,
    'Signal Photons': photometry.signalPhotons,
    'Sky Photons': photometry.skyPhotons,
    'SNR': photometry.snr,
    'Limiting Magnitude': photometry.limitingMagnitude,
  };

  const bandData = {
    'Wavelength': `${PhotometricSystems.JOHNSON_COUSINS.bands[selectedBand as keyof typeof PhotometricSystems.JOHNSON_COUSINS.bands]?.wavelength || 551} nm`,
    'Bandwidth': `${PhotometricSystems.JOHNSON_COUSINS.bands[selectedBand as keyof typeof PhotometricSystems.JOHNSON_COUSINS.bands]?.bandwidth || 88} nm`,
    'System': 'Johnson-Cousins',
    'Epoch': 'J2000.0',
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
              <h1 className="text-4xl font-bold text-[#00F0FF] font-mono">PHOTOMETRY SUITE</h1>
              <p className="text-secondary-foreground font-mono text-sm mt-2">Professional Stellar Photometry & Aperture Analysis</p>
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

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photometric Band Selection */}
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">PHOTOMETRIC BAND</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(PhotometricSystems.JOHNSON_COUSINS.bands).map((band) => (
                  <button
                    key={band}
                    onClick={() => setSelectedBand(band)}
                    className={`py-2 px-3 rounded border font-mono text-sm transition-all ${
                      selectedBand === band
                        ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                        : 'bg-[#0B0E14] border-[#00F0FF]/20 text-secondary-foreground hover:border-[#00F0FF]/50'
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>
            </div>

            {/* Instrument Configuration */}
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">INSTRUMENT CONFIG</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-secondary-foreground">Aperture Diameter (m)</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={apertureDiameter}
                    onChange={(e) => setApertureDiameter(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="text-sm font-mono text-[#00F0FF] mt-1">{apertureDiameter.toFixed(2)} m</div>
                </div>
                <div>
                  <label className="text-xs font-mono text-secondary-foreground">Exposure Time (s)</label>
                  <input
                    type="range"
                    min="1"
                    max="3600"
                    step="10"
                    value={exposureTime}
                    onChange={(e) => setExposureTime(parseInt(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="text-sm font-mono text-[#00F0FF] mt-1">{exposureTime} s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">TARGET PARAMETERS</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-secondary-foreground">Target Magnitude</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={targetMagnitude}
                    onChange={(e) => setTargetMagnitude(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="text-sm font-mono text-[#00F0FF] mt-1">{DataFormatter.magnitude(targetMagnitude)}</div>
                </div>
                <div>
                  <label className="text-xs font-mono text-secondary-foreground">Sky Brightness</label>
                  <input
                    type="range"
                    min="18"
                    max="22"
                    step="0.1"
                    value={skyBrightness}
                    onChange={(e) => setSkyBrightness(parseFloat(e.target.value))}
                    className="w-full mt-1"
                  />
                  <div className="text-sm font-mono text-[#00F0FF] mt-1">{skyBrightness.toFixed(1)} mag/arcsec²</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded p-6">
              <h3 className="text-sm font-bold text-[#00F0FF] font-mono mb-4">CALCULATED METRICS</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-secondary-foreground">Aperture Area:</span>
                  <span className="text-[#00F0FF]">{(photometry.apertureArea * 1e4).toFixed(2)} cm²</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-secondary-foreground">Signal Photons:</span>
                  <span className="text-[#00F0FF]">{photometry.signalPhotons.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-secondary-foreground">Sky Photons:</span>
                  <span className="text-[#00F0FF]">{photometry.skyPhotons.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono border-t border-[#00F0FF]/10 pt-2 mt-2">
                  <span className="text-secondary-foreground">SNR:</span>
                  <span className="text-[#10B981] font-bold">{photometry.snr}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-secondary-foreground">Limiting Magnitude:</span>
                  <span className="text-[#F59E0B]">{DataFormatter.magnitude(parseFloat(photometry.limitingMagnitude))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry Display */}
          <TelemetryDisplay metrics={telemetryMetrics} title="REAL-TIME TELEMETRY" />

          {/* Data Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfessionalDataPanel
              title="PHOTOMETRY RESULTS"
              data={photometryData}
              format="table"
              precision={3}
              copyable
              downloadable
            />
            <ProfessionalDataPanel
              title="BAND CONFIGURATION"
              data={bandData}
              format="table"
              copyable
              downloadable
            />
          </div>

          {/* Fundamental Equations */}
          <div className="space-y-6">
            <EquationDisplay
              title="SIGNAL-TO-NOISE RATIO"
              latex="SNR = \frac{N_s}{\sqrt{N_s + N_{sky} + N_{read}}}"
              description="Signal-to-noise ratio calculation for photometric observations"
              variables={{
                'N_s': 'Signal photons from target',
                'N_sky': 'Sky background photons',
                'N_read': 'Readout noise photons',
              }}
            />

            <EquationDisplay
              title="MAGNITUDE SYSTEM"
              latex="m_1 - m_2 = -2.5 \log_{10}\left(\frac{F_1}{F_2}\right)"
              description="Magnitude difference between two sources based on flux ratio"
              variables={{
                'm': 'Apparent magnitude',
                'F': 'Flux density',
              }}
            />

            <EquationDisplay
              title="LIMITING MAGNITUDE"
              latex="m_{lim} = m_{target} - 2.5 \log_{10}(SNR)"
              description="Faintest magnitude detectable at specified signal-to-noise ratio"
              variables={{
                'm_lim': 'Limiting magnitude',
                'm_target': 'Target magnitude',
                'SNR': 'Signal-to-noise ratio threshold',
              }}
            />
          </div>

          {/* Standards & References */}
          <div className="bg-[#131924]/60 backdrop-blur-md border border-[#10B981]/20 rounded p-6">
            <h3 className="text-sm font-bold text-[#10B981] font-mono mb-4">STANDARDS & REFERENCES</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">Johnson-Cousins System</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-secondary-foreground">Vega Magnitude Scale</span>
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
