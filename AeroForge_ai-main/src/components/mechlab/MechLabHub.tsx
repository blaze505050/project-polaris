import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowLeft, Wrench, Activity, Layers, Circle, Gauge, Thermometer, Flame, Droplets, Cog, Zap, BarChart3, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeatureStatusBadge, { FeatureStatus } from '@/components/ui/FeatureStatusBadge';
import ToolShell from '@/components/ui/ToolShell';
import { useAeroForgeStore } from '@/stores/aeroforgeStore';
import {
  computeBeamStress,
  computeMohrCircle,
  MATERIAL_DATABASE,
  computeNormalStress,
  computeShearStress,
  computeStrain,
  computeYoungsModulus,
  computeFactorOfSafety,
  computeShaftTorsion,
  computePowerTorqueRPM,
  computeThermalConduction,
  computeConvectiveHeatTransfer,
  computeThermalRadiation,
  computeHeatExchangerLMTD,
  computeReynoldsNumberPipe,
  computeBernoulliEquation,
  computePipePressureDrop,
  computePumpPower,
  computeNaturalFrequency,
  computeSpringDesign,
  computeGearRatio,
  computeCentrifugalPumpPerformance,
} from '@/services/physicsEngine';

// ─── Tool Registry ──────────────────────────────────────────────────────────

type ToolId =
  | 'stress' | 'strain' | 'youngs-modulus' | 'fos' | 'beam-bending'
  | 'shaft-torsion' | 'power-torque' | 'thermal-conduction' | 'convection' | 'radiation'
  | 'lmtd' | 'reynolds-pipe' | 'bernoulli' | 'pipe-drop' | 'pump-power'
  | 'pump-performance' | 'natural-freq' | 'spring' | 'gear-ratio' | 'materials';

const TOOLS: { id: ToolId; icon: React.ElementType; label: string; status: FeatureStatus; group: string }[] = [
  // Solid Mechanics
  { id: 'stress', icon: Activity, label: 'Stress Calculator', status: 'available', group: 'Solid Mechanics' },
  { id: 'strain', icon: Ruler, label: 'Strain Calculator', status: 'available', group: 'Solid Mechanics' },
  { id: 'youngs-modulus', icon: BarChart3, label: "Young's Modulus", status: 'available', group: 'Solid Mechanics' },
  { id: 'fos', icon: Activity, label: 'Factor of Safety', status: 'available', group: 'Solid Mechanics' },
  { id: 'beam-bending', icon: Layers, label: 'Beam Bending', status: 'available', group: 'Solid Mechanics' },
  { id: 'shaft-torsion', icon: Cog, label: 'Shaft Torsion', status: 'available', group: 'Solid Mechanics' },
  // Power & Motion
  { id: 'power-torque', icon: Zap, label: 'Power/Torque/RPM', status: 'available', group: 'Power & Motion' },
  { id: 'natural-freq', icon: Activity, label: 'Natural Frequency', status: 'available', group: 'Power & Motion' },
  { id: 'spring', icon: Wrench, label: 'Spring Design', status: 'available', group: 'Power & Motion' },
  { id: 'gear-ratio', icon: Cog, label: 'Gear Ratio', status: 'available', group: 'Power & Motion' },
  // Thermal
  { id: 'thermal-conduction', icon: Thermometer, label: 'Thermal Conduction', status: 'available', group: 'Thermal' },
  { id: 'convection', icon: Flame, label: 'Convective Heat Transfer', status: 'available', group: 'Thermal' },
  { id: 'radiation', icon: Flame, label: 'Thermal Radiation', status: 'available', group: 'Thermal' },
  { id: 'lmtd', icon: Thermometer, label: 'Heat Exchanger LMTD', status: 'available', group: 'Thermal' },
  // Fluid Mechanics
  { id: 'reynolds-pipe', icon: Droplets, label: 'Reynolds Number (Pipe)', status: 'available', group: 'Fluid Mechanics' },
  { id: 'bernoulli', icon: Gauge, label: 'Bernoulli Equation', status: 'available', group: 'Fluid Mechanics' },
  { id: 'pipe-drop', icon: Droplets, label: 'Pipe Pressure Drop', status: 'available', group: 'Fluid Mechanics' },
  { id: 'pump-power', icon: Zap, label: 'Pump Power', status: 'available', group: 'Fluid Mechanics' },
  { id: 'pump-performance', icon: Gauge, label: 'Centrifugal Pump', status: 'beta', group: 'Fluid Mechanics' },
  // Materials
  { id: 'materials', icon: Layers, label: 'Material Selection', status: 'available', group: 'Materials' },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function MechLabHub() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ToolId>('stress');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    if (!searchQuery) return TOOLS;
    const q = searchQuery.toLowerCase();
    return TOOLS.filter((t) => t.label.toLowerCase().includes(q) || t.group.toLowerCase().includes(q));
  }, [searchQuery]);

  const groupedTools = useMemo(() => {
    const groups = new Map<string, typeof TOOLS>();
    for (const t of filteredTools) {
      if (!groups.has(t.group)) groups.set(t.group, []);
      groups.get(t.group)!.push(t);
    }
    return groups;
  }, [filteredTools]);

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white flex items-center gap-3">
              MechLab — Mechanical Engineering
              <FeatureStatusBadge status="available" size="md" />
            </h1>
            <p className="text-xs text-white/40 font-mono">20 Working Tools · Solid Mechanics · Thermal · Fluids · Power Systems · Materials</p>
          </div>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0 space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full bg-[#0A1020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 outline-none focus:border-amber-500/40 placeholder:text-white/20"
            />
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff15 transparent' }}>
              {Array.from(groupedTools.entries()).map(([group, tools]) => (
                <div key={group}>
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1.5 px-1">{group}</h3>
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all mb-0.5 text-left ${
                        activeTool === tool.id
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <tool.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tool.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <ToolRenderer toolId={activeTool} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Tool Renderer ──────────────────────────────────────────────────────────

function ToolRenderer({ toolId }: { toolId: ToolId }) {
  switch (toolId) {
    case 'stress': return <StressTool />;
    case 'strain': return <StrainTool />;
    case 'youngs-modulus': return <YoungsModulusTool />;
    case 'fos': return <FOSTool />;
    case 'beam-bending': return <BeamBendingTool />;
    case 'shaft-torsion': return <ShaftTorsionTool />;
    case 'power-torque': return <PowerTorqueTool />;
    case 'thermal-conduction': return <ThermalConductionTool />;
    case 'convection': return <ConvectionTool />;
    case 'radiation': return <RadiationTool />;
    case 'lmtd': return <LMTDTool />;
    case 'reynolds-pipe': return <ReynoldsPipeTool />;
    case 'bernoulli': return <BernoulliTool />;
    case 'pipe-drop': return <PipeDropTool />;
    case 'pump-power': return <PumpPowerTool />;
    case 'pump-performance': return <PumpPerformanceTool />;
    case 'natural-freq': return <NaturalFreqTool />;
    case 'spring': return <SpringTool />;
    case 'gear-ratio': return <GearRatioTool />;
    case 'materials': return <MaterialsTool />;
    default: return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const AMBER = '#F59E0B';

// 1. Stress Calculator
function StressTool() {
  return (
    <ToolShell name="Stress Calculator" description="Calculate normal or shear stress from applied force and cross-sectional area"
      domain="Solid Mechanics · Strength of Materials" accentColor={AMBER}
      inputs={[
        { key: 'force', label: 'Applied Force', unit: 'N', defaultValue: 10000, min: 0 },
        { key: 'area', label: 'Cross-sectional Area', unit: 'm²', defaultValue: 0.001, min: 1e-10, step: 0.0001, helpText: 'Load-bearing area' },
      ]}
      equations={['σ = F / A (normal)', 'τ = V / A (shear)']}
      assumptions={['Uniformly distributed stress', 'Prismatic cross-section', 'Static loading']}
      onCalculate={(v) => {
        const r = computeNormalStress(v.force, v.area);
        if (!r) return null;
        return {
          results: [
            { label: 'Stress', value: r.stressMPa, unit: 'MPa', highlight: true },
            { label: 'Stress', value: r.stress, unit: 'Pa' },
            { label: 'Stress', value: r.stressKsi, unit: 'ksi' },
          ],
        };
      }}
    />
  );
}

// 2. Strain Calculator
function StrainTool() {
  return (
    <ToolShell name="Strain Calculator" description="Calculate engineering strain from deformation and original length"
      domain="Solid Mechanics · Material Testing" accentColor={AMBER}
      inputs={[
        { key: 'deformation', label: 'Deformation (ΔL)', unit: 'm', defaultValue: 0.001, step: 0.0001 },
        { key: 'originalLength', label: 'Original Length (L₀)', unit: 'm', defaultValue: 1.0, min: 0.001 },
      ]}
      equations={['ε = ΔL / L₀']}
      assumptions={['Engineering strain (not true strain)', 'Small deformation assumed', 'Uniaxial loading']}
      onCalculate={(v) => {
        const r = computeStrain(v.deformation, v.originalLength);
        if (!r) return null;
        return {
          results: [
            { label: 'Strain', value: r.strain, unit: '—', highlight: true },
            { label: 'Strain', value: r.strainPercent, unit: '%' },
            { label: 'Microstrain', value: r.strainMicroStrain, unit: 'με' },
          ],
        };
      }}
    />
  );
}

// 3. Young's Modulus
function YoungsModulusTool() {
  return (
    <ToolShell name="Young's Modulus Calculator" description="Calculate elastic modulus from stress and strain"
      domain="Solid Mechanics · Material Properties" accentColor={AMBER}
      inputs={[
        { key: 'stress', label: 'Stress', unit: 'MPa', defaultValue: 200, min: 0 },
        { key: 'strain', label: 'Strain', unit: '—', defaultValue: 0.001, min: 1e-10, step: 0.0001 },
      ]}
      equations={['E = σ / ε']}
      assumptions={['Linear elastic region (Hooke\'s law)', 'Isotropic material', 'Uniaxial stress state']}
      onCalculate={(v) => {
        const r = computeYoungsModulus(v.stress * 1e6, v.strain);
        if (!r) return null;
        return {
          results: [
            { label: "Young's Modulus", value: r.youngsModulusGPa, unit: 'GPa', highlight: true },
            { label: "Young's Modulus", value: r.youngsModulus, unit: 'Pa' },
          ],
        };
      }}
    />
  );
}

// 4. Factor of Safety
function FOSTool() {
  return (
    <ToolShell name="Factor of Safety Calculator" description="Evaluate structural safety margin"
      domain="Structural Engineering · Design" accentColor={AMBER}
      inputs={[
        { key: 'failureStrength', label: 'Failure/Yield Strength', unit: 'MPa', defaultValue: 500, min: 0 },
        { key: 'workingStress', label: 'Working/Applied Stress', unit: 'MPa', defaultValue: 200, min: 0.001 },
      ]}
      equations={['FoS = σ_failure / σ_working']}
      assumptions={['Static loading', 'Single failure mode', 'No fatigue considerations']}
      onCalculate={(v) => {
        const r = computeFactorOfSafety(v.failureStrength * 1e6, v.workingStress * 1e6);
        if (!r) return null;
        return {
          results: [
            { label: 'Factor of Safety', value: r.factorOfSafety, unit: '—', highlight: true },
            { label: 'Assessment', value: r.assessment, unit: '' },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 5. Beam Bending
function BeamBendingTool() {
  return (
    <ToolShell name="Beam Bending Calculator" description="Cantilever beam stress and deflection under tip load"
      domain="Structural Mechanics · Beam Theory" accentColor={AMBER}
      inputs={[
        { key: 'force', label: 'Tip Load', unit: 'N', defaultValue: 1000, min: 0.01 },
        { key: 'length', label: 'Beam Length', unit: 'm', defaultValue: 2, min: 0.01 },
        { key: 'width', label: 'Cross-section Width', unit: 'm', defaultValue: 0.05, min: 0.001 },
        { key: 'height', label: 'Cross-section Height', unit: 'm', defaultValue: 0.1, min: 0.001 },
        { key: 'youngsModulus', label: "Young's Modulus", unit: 'GPa', defaultValue: 200, min: 0.1, helpText: 'Steel ≈ 200 GPa, Aluminum ≈ 70 GPa' },
        { key: 'yieldStrength', label: 'Yield Strength', unit: 'MPa', defaultValue: 250, min: 0.1 },
      ]}
      equations={['σ_max = M·c / I', 'M = F·L', 'I = bh³/12', 'δ_max = FL³ / (3EI)']}
      assumptions={['Cantilever beam (fixed-free)', 'Rectangular cross-section', 'Euler-Bernoulli beam theory', 'Small deflections']}
      onCalculate={(v) => {
        const r = computeBeamStress(v.force, v.length, v.width, v.height, v.youngsModulus * 1e9, v.yieldStrength * 1e6);
        if (!r) return null;
        return {
          results: [
            { label: 'Max Bending Stress', value: r.maxStress / 1e6, unit: 'MPa', highlight: true },
            { label: 'Max Deflection', value: r.maxDeflection * 1000, unit: 'mm' },
            { label: 'Moment of Inertia', value: r.momentOfInertia, unit: 'm⁴' },
            { label: 'Section Modulus', value: r.sectionModulus, unit: 'm³' },
            { label: 'Safety Factor', value: r.safetyFactor, unit: '—' },
          ],
          interpretation: `Max stress ${(r.maxStress / 1e6).toFixed(1)} MPa with safety factor ${r.safetyFactor.toFixed(2)}. ${r.safetyFactor < 1 ? '⚠️ FAILURE PREDICTED' : r.safetyFactor < 1.5 ? '⚠️ Low safety margin' : 'Within safe limits.'}`,
        };
      }}
    />
  );
}

// 6. Shaft Torsion
function ShaftTorsionTool() {
  return (
    <ToolShell name="Shaft Torsion Calculator" description="Calculate shear stress and angle of twist in a solid circular shaft"
      domain="Machine Design · Power Transmission" accentColor={AMBER}
      inputs={[
        { key: 'torque', label: 'Applied Torque', unit: 'N·m', defaultValue: 500, min: 0 },
        { key: 'diameter', label: 'Shaft Diameter', unit: 'm', defaultValue: 0.05, min: 0.001 },
        { key: 'length', label: 'Shaft Length', unit: 'm', defaultValue: 1.0, min: 0.01 },
        { key: 'shearModulus', label: 'Shear Modulus (G)', unit: 'GPa', defaultValue: 80, min: 0.1, helpText: 'Steel ≈ 80 GPa' },
      ]}
      equations={['τ_max = T·r / J', 'J = πd⁴/32 (solid)', 'φ = TL / (GJ)']}
      assumptions={['Solid circular cross-section', 'Homogeneous, isotropic material', 'Small angle of twist', 'No axial load']}
      onCalculate={(v) => {
        const r = computeShaftTorsion(v.torque, v.diameter, v.length, v.shearModulus * 1e9);
        if (!r) return null;
        return {
          results: [
            { label: 'Max Shear Stress', value: r.maxShearStressMPa, unit: 'MPa', highlight: true },
            { label: 'Angle of Twist', value: r.angleOfTwistDeg, unit: '°' },
            { label: 'Polar Moment of Inertia', value: r.polarMomentOfInertia, unit: 'm⁴' },
          ],
        };
      }}
    />
  );
}

// 7. Power/Torque/RPM
function PowerTorqueTool() {
  return (
    <ToolShell name="Power / Torque / RPM Calculator" description="Convert between power, torque, and rotational speed"
      domain="Machine Design · Power Transmission" accentColor={AMBER}
      inputs={[
        { key: 'torque', label: 'Torque', unit: 'N·m', defaultValue: 100, min: 0 },
        { key: 'rpm', label: 'Rotational Speed', unit: 'RPM', defaultValue: 1500, min: 0 },
      ]}
      equations={['P = 2π·N·T / 60']}
      assumptions={['Steady-state rotation', 'No losses (ideal conversion)']}
      onCalculate={(v) => {
        const r = computePowerTorqueRPM(undefined, v.torque, v.rpm);
        if (!r) return null;
        return {
          results: [
            { label: 'Power', value: r.powerKW, unit: 'kW', highlight: true },
            { label: 'Power', value: r.powerHP, unit: 'HP' },
            { label: 'Power', value: r.power, unit: 'W' },
            { label: 'Torque', value: r.torque, unit: 'N·m' },
            { label: 'Speed', value: r.rpm, unit: 'RPM' },
          ],
        };
      }}
    />
  );
}

// 8. Thermal Conduction
function ThermalConductionTool() {
  return (
    <ToolShell name="Thermal Conduction Calculator" description="Calculate heat transfer through a flat wall using Fourier's law"
      domain="Heat Transfer · Thermal Engineering" accentColor={AMBER}
      inputs={[
        { key: 'conductivity', label: 'Thermal Conductivity (k)', unit: 'W/(m·K)', defaultValue: 50, min: 0.001, helpText: 'Steel ≈ 50, Aluminum ≈ 205, Air ≈ 0.026' },
        { key: 'area', label: 'Cross-sectional Area', unit: 'm²', defaultValue: 1.0, min: 0.0001 },
        { key: 'deltaT', label: 'Temperature Difference', unit: 'K', defaultValue: 100 },
        { key: 'thickness', label: 'Wall Thickness', unit: 'm', defaultValue: 0.01, min: 0.0001 },
      ]}
      equations={['Q = k·A·ΔT / Δx', 'R_th = Δx / (k·A)']}
      assumptions={["Fourier's law (steady-state)", 'Flat wall (1D conduction)', 'Uniform properties', 'No internal heat generation']}
      onCalculate={(v) => {
        const r = computeThermalConduction(v.conductivity, v.area, v.deltaT, v.thickness);
        if (!r) return null;
        return {
          results: [
            { label: 'Heat Flow', value: r.heatFlux, unit: 'W', highlight: true },
            { label: 'Heat Flux Density', value: r.heatFluxDensity, unit: 'W/m²' },
            { label: 'Thermal Resistance', value: r.thermalResistance, unit: 'K/W' },
          ],
        };
      }}
    />
  );
}

// 9. Convective Heat Transfer
function ConvectionTool() {
  return (
    <ToolShell name="Convective Heat Transfer Calculator" description="Calculate convective heat transfer using Newton's law of cooling"
      domain="Heat Transfer · Thermal Engineering" accentColor={AMBER}
      inputs={[
        { key: 'h', label: 'Convection Coefficient (h)', unit: 'W/(m²·K)', defaultValue: 25, min: 0.01, helpText: 'Free conv air ≈ 5-25, forced ≈ 25-250, water ≈ 500-10000' },
        { key: 'area', label: 'Surface Area', unit: 'm²', defaultValue: 2.0, min: 0.0001 },
        { key: 'deltaT', label: 'Temperature Difference', unit: 'K', defaultValue: 50 },
      ]}
      equations={['Q = h·A·ΔT']}
      assumptions={['Newton\'s law of cooling', 'Uniform surface temperature', 'Constant h coefficient']}
      onCalculate={(v) => {
        const r = computeConvectiveHeatTransfer(v.h, v.area, v.deltaT);
        if (!r) return null;
        return {
          results: [
            { label: 'Heat Transfer Rate', value: r.heatFlux, unit: 'W', highlight: true },
            { label: 'Heat Transfer Rate', value: r.heatFlux / 1000, unit: 'kW' },
            { label: 'Thermal Resistance', value: r.thermalResistance, unit: 'K/W' },
          ],
        };
      }}
    />
  );
}

// 10. Thermal Radiation
function RadiationTool() {
  return (
    <ToolShell name="Thermal Radiation Calculator" description="Calculate radiative heat transfer using the Stefan-Boltzmann law"
      domain="Heat Transfer · Radiative Transfer" accentColor={AMBER}
      inputs={[
        { key: 'emissivity', label: 'Surface Emissivity (ε)', unit: '—', defaultValue: 0.85, min: 0.01, max: 1, step: 0.01, helpText: 'Black body = 1.0, polished metal ≈ 0.05-0.2' },
        { key: 'area', label: 'Surface Area', unit: 'm²', defaultValue: 1.0, min: 0.0001 },
        { key: 'tempHot', label: 'Surface Temperature', unit: 'K', defaultValue: 500, min: 0, helpText: '°C + 273.15 = K' },
        { key: 'tempCold', label: 'Surroundings Temperature', unit: 'K', defaultValue: 300, min: 0 },
      ]}
      equations={['Q = ε·σ·A·T⁴ (emitted)', 'Q_net = ε·σ·A·(T_h⁴ - T_c⁴)', 'σ = 5.67×10⁻⁸ W/(m²·K⁴)']}
      assumptions={['Gray-body radiation', 'Diffuse surface', 'Small body in large enclosure']}
      onCalculate={(v) => {
        const r = computeThermalRadiation(v.emissivity, v.area, v.tempHot, v.tempCold);
        if (!r) return null;
        return {
          results: [
            { label: 'Net Heat Flux', value: r.netHeatFlux, unit: 'W', highlight: true },
            { label: 'Emitted Power', value: r.emittedPower, unit: 'W' },
            { label: 'Emissive Power', value: r.emissivePower, unit: 'W/m²' },
          ],
        };
      }}
    />
  );
}

// 11. LMTD
function LMTDTool() {
  return (
    <ToolShell name="Heat Exchanger LMTD Calculator" description="Calculate logarithmic mean temperature difference for heat exchanger design"
      domain="Heat Transfer · Heat Exchanger Design" accentColor={AMBER}
      inputs={[
        { key: 'hotIn', label: 'Hot Fluid Inlet', unit: '°C', defaultValue: 150 },
        { key: 'hotOut', label: 'Hot Fluid Outlet', unit: '°C', defaultValue: 90 },
        { key: 'coldIn', label: 'Cold Fluid Inlet', unit: '°C', defaultValue: 30 },
        { key: 'coldOut', label: 'Cold Fluid Outlet', unit: '°C', defaultValue: 70 },
      ]}
      equations={['LMTD = (ΔT₁ - ΔT₂) / ln(ΔT₁/ΔT₂)', 'Counterflow: ΔT₁ = T_h,in - T_c,out', 'Q = UA · LMTD']}
      assumptions={['Counterflow configuration', 'Constant fluid properties', 'No phase change', 'No fouling']}
      onCalculate={(v) => {
        const r = computeHeatExchangerLMTD(v.hotIn, v.hotOut, v.coldIn, v.coldOut, 'counterflow');
        if (!r) return null;
        return {
          results: [
            { label: 'LMTD', value: r.lmtd, unit: '°C (K)', highlight: true },
            { label: 'ΔT₁ (Hot in - Cold out)', value: r.deltaT1, unit: '°C' },
            { label: 'ΔT₂ (Hot out - Cold in)', value: r.deltaT2, unit: '°C' },
            { label: 'Configuration', value: r.configuration, unit: '' },
          ],
        };
      }}
    />
  );
}

// 12. Reynolds Number Pipe
function ReynoldsPipeTool() {
  return (
    <ToolShell name="Reynolds Number Calculator (Pipe)" description="Calculate Reynolds number for internal pipe flow and determine friction factor"
      domain="Fluid Mechanics · Pipe Flow" accentColor={AMBER}
      inputs={[
        { key: 'velocity', label: 'Flow Velocity', unit: 'm/s', defaultValue: 2.0, min: 0.001 },
        { key: 'diameter', label: 'Pipe Diameter', unit: 'm', defaultValue: 0.05, min: 0.001 },
        { key: 'density', label: 'Fluid Density', unit: 'kg/m³', defaultValue: 998, min: 0.01, helpText: 'Water ≈ 998, Air ≈ 1.225' },
        { key: 'viscosity', label: 'Dynamic Viscosity', unit: 'Pa·s', defaultValue: 1.002e-3, min: 1e-8, helpText: 'Water ≈ 1.002×10⁻³, Air ≈ 1.789×10⁻⁵' },
      ]}
      equations={['Re = ρVD / μ', 'Laminar: f = 64/Re', 'Turbulent: Blasius f = 0.316·Re⁻⁰·²⁵']}
      assumptions={['Circular pipe', 'Fully developed flow', 'Laminar < 2300 < Transitional < 4000 < Turbulent']}
      onCalculate={(v) => {
        const r = computeReynoldsNumberPipe(v.velocity, v.diameter, v.density, v.viscosity);
        if (!r) return null;
        return {
          results: [
            { label: 'Reynolds Number', value: r.reynoldsNumber, unit: '—', highlight: true },
            { label: 'Flow Regime', value: r.regime, unit: '' },
            { label: 'Darcy Friction Factor', value: r.frictionFactor, unit: '—' },
          ],
          interpretation: r.description,
        };
      }}
    />
  );
}

// 13. Bernoulli
function BernoulliTool() {
  return (
    <ToolShell name="Bernoulli Equation Analyzer" description="Analyze pressure-velocity-elevation relationships along a streamline"
      domain="Fluid Mechanics · Incompressible Flow" accentColor={AMBER}
      inputs={[
        { key: 'density', label: 'Fluid Density', unit: 'kg/m³', defaultValue: 998 },
        { key: 'P1', label: 'Pressure at Point 1', unit: 'Pa', defaultValue: 200000 },
        { key: 'V1', label: 'Velocity at Point 1', unit: 'm/s', defaultValue: 2.0, min: 0 },
        { key: 'z1', label: 'Elevation at Point 1', unit: 'm', defaultValue: 5 },
        { key: 'V2', label: 'Velocity at Point 2', unit: 'm/s', defaultValue: 5.0, min: 0, helpText: 'Provide to solve for P₂' },
        { key: 'z2', label: 'Elevation at Point 2', unit: 'm', defaultValue: 0 },
      ]}
      equations={['P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂']}
      assumptions={['Steady, incompressible, inviscid flow', 'Along a single streamline', 'No energy added or removed', 'No friction losses']}
      onCalculate={(v) => {
        const r = computeBernoulliEquation(v.density, v.P1, v.V1, v.z1, undefined, v.V2, v.z2);
        if (!r) return null;
        return {
          results: [
            { label: 'Pressure at Point 2', value: r.pressure2 / 1000, unit: 'kPa', highlight: true },
            { label: 'Pressure at Point 2', value: r.pressure2, unit: 'Pa' },
            { label: 'Total Head', value: r.totalHead, unit: 'm' },
            { label: 'Velocity at Point 2', value: r.velocity2, unit: 'm/s' },
          ],
        };
      }}
    />
  );
}

// 14. Pipe Pressure Drop
function PipeDropTool() {
  return (
    <ToolShell name="Pipe Pressure Drop Calculator" description="Calculate friction-based pressure drop using Darcy-Weisbach with Swamee-Jain friction factor"
      domain="Fluid Mechanics · Pipe Systems" accentColor={AMBER}
      inputs={[
        { key: 'velocity', label: 'Flow Velocity', unit: 'm/s', defaultValue: 3.0, min: 0.001 },
        { key: 'diameter', label: 'Pipe Diameter', unit: 'm', defaultValue: 0.1, min: 0.001 },
        { key: 'length', label: 'Pipe Length', unit: 'm', defaultValue: 100, min: 0.01 },
        { key: 'density', label: 'Fluid Density', unit: 'kg/m³', defaultValue: 998 },
        { key: 'viscosity', label: 'Dynamic Viscosity', unit: 'Pa·s', defaultValue: 1.002e-3 },
        { key: 'roughness', label: 'Pipe Roughness', unit: 'm', defaultValue: 0.00015, min: 0, step: 0.00001, helpText: 'Commercial steel ≈ 0.045mm, PVC ≈ 0.0015mm' },
      ]}
      equations={['ΔP = f · (L/D) · (ρV²/2)', 'h_L = ΔP / (ρg)', 'f from Swamee-Jain (explicit Colebrook approximation)']}
      assumptions={['Fully developed flow', 'Circular pipe', 'No minor losses (valves, bends)', 'Steady-state flow']}
      onCalculate={(v) => {
        const r = computePipePressureDrop(v.velocity, v.diameter, v.length, v.density, v.viscosity, v.roughness);
        if (!r) return null;
        return {
          results: [
            { label: 'Pressure Drop', value: r.pressureDropKPa, unit: 'kPa', highlight: true },
            { label: 'Head Loss', value: r.headLoss, unit: 'm' },
            { label: 'Reynolds Number', value: r.reynoldsNumber, unit: '—' },
            { label: 'Friction Factor', value: r.frictionFactor, unit: '—' },
            { label: 'Flow Regime', value: r.flowRegime, unit: '' },
          ],
        };
      }}
    />
  );
}

// 15. Pump Power
function PumpPowerTool() {
  return (
    <ToolShell name="Pump Power Calculator" description="Calculate required pump power from flow rate, head, and efficiency"
      domain="Fluid Mechanics · Pump Systems" accentColor={AMBER}
      inputs={[
        { key: 'flowRate', label: 'Flow Rate', unit: 'm³/s', defaultValue: 0.01, min: 0.00001, step: 0.001, helpText: '1 L/s = 0.001 m³/s' },
        { key: 'head', label: 'Total Head', unit: 'm', defaultValue: 30, min: 0.01 },
        { key: 'density', label: 'Fluid Density', unit: 'kg/m³', defaultValue: 998 },
        { key: 'efficiency', label: 'Pump Efficiency', unit: '—', defaultValue: 0.75, min: 0.01, max: 1, step: 0.01 },
      ]}
      equations={['P = ρgQH / η']}
      assumptions={['Steady-state operation', 'Incompressible fluid', 'Includes only hydraulic power (no motor losses)']}
      onCalculate={(v) => {
        const r = computePumpPower(v.flowRate, v.head, v.density, v.efficiency);
        if (!r) return null;
        return {
          results: [
            { label: 'Required Power', value: r.powerKW, unit: 'kW', highlight: true },
            { label: 'Required Power', value: r.powerHP, unit: 'HP' },
            { label: 'Power', value: r.power, unit: 'W' },
          ],
        };
      }}
    />
  );
}

// 16. Centrifugal Pump Performance
function PumpPerformanceTool() {
  return (
    <ToolShell name="Centrifugal Pump Performance Tool" description="Find operating point from pump and system curves"
      domain="Fluid Mechanics · Pump Systems" status="beta" accentColor={AMBER}
      inputs={[
        { key: 'shutoffHead', label: 'Shutoff Head', unit: 'm', defaultValue: 50, min: 1, helpText: 'Head at zero flow' },
        { key: 'maxFlow', label: 'Max Flow Rate', unit: 'm³/s', defaultValue: 0.05, min: 0.001 },
        { key: 'staticHead', label: 'System Static Head', unit: 'm', defaultValue: 10, min: 0 },
        { key: 'frictionK', label: 'System Friction Coefficient', unit: 's²/m⁵', defaultValue: 5000, min: 0, helpText: 'K where H_friction = K·Q²' },
        { key: 'density', label: 'Fluid Density', unit: 'kg/m³', defaultValue: 998 },
        { key: 'efficiency', label: 'Pump Efficiency', unit: '—', defaultValue: 0.75, min: 0.01, max: 1 },
      ]}
      equations={['H_pump = H₀ - (H₀/Q²_max)·Q²', 'H_system = H_static + K·Q²', 'Operating point: H_pump = H_system']}
      assumptions={['Quadratic pump curve approximation', 'System curve includes static head + friction', 'Constant pump efficiency']}
      onCalculate={(v) => {
        const r = computeCentrifugalPumpPerformance(v.shutoffHead, v.maxFlow, v.staticHead, v.frictionK, v.density, v.efficiency);
        if (!r) return null;
        return {
          results: [
            { label: 'Operating Flow Rate', value: r.operatingFlowRate * 1000, unit: 'L/s', highlight: true },
            { label: 'Operating Head', value: r.operatingHead, unit: 'm' },
            { label: 'Operating Power', value: r.operatingPower / 1000, unit: 'kW' },
          ],
          interpretation: `Operating point: Q = ${(r.operatingFlowRate * 1000).toFixed(2)} L/s at H = ${r.operatingHead.toFixed(1)} m. Power required: ${(r.operatingPower / 1000).toFixed(2)} kW.`,
        };
      }}
    />
  );
}

// 17. Natural Frequency
function NaturalFreqTool() {
  return (
    <ToolShell name="Natural Frequency Calculator" description="Calculate undamped natural frequency of a single degree-of-freedom system"
      domain="Vibrations · Dynamics" accentColor={AMBER}
      inputs={[
        { key: 'stiffness', label: 'Stiffness (k)', unit: 'N/m', defaultValue: 10000, min: 0.01 },
        { key: 'mass', label: 'Mass (m)', unit: 'kg', defaultValue: 5, min: 0.001 },
      ]}
      equations={['ω_n = √(k/m)', 'f_n = ω_n / (2π)', 'T = 1 / f_n']}
      assumptions={['Single degree of freedom (SDOF)', 'No damping', 'Linear spring', 'Point mass']}
      onCalculate={(v) => {
        const r = computeNaturalFrequency(v.stiffness, v.mass);
        if (!r) return null;
        return {
          results: [
            { label: 'Natural Frequency', value: r.naturalFrequencyHz, unit: 'Hz', highlight: true },
            { label: 'Angular Frequency', value: r.naturalFrequencyRad, unit: 'rad/s' },
            { label: 'Period', value: r.period, unit: 's' },
          ],
        };
      }}
    />
  );
}

// 18. Spring Design
function SpringTool() {
  return (
    <ToolShell name="Spring Design Calculator" description="Calculate force, deflection, and stored energy for a linear spring"
      domain="Machine Design · Energy Storage" accentColor={AMBER}
      inputs={[
        { key: 'springConstant', label: 'Spring Constant (k)', unit: 'N/m', defaultValue: 5000, min: 0.01 },
        { key: 'load', label: 'Applied Load (F)', unit: 'N', defaultValue: 100, min: 0 },
        { key: 'mass', label: 'Attached Mass (optional)', unit: 'kg', defaultValue: 2, min: 0, helpText: 'For natural frequency calculation' },
      ]}
      equations={['F = kx', 'E = ½kx²', 'f_n = √(k/m) / (2π)']}
      assumptions={["Hooke's law (linear elastic)", 'No damping or friction', 'Static equilibrium']}
      onCalculate={(v) => {
        const r = computeSpringDesign(v.springConstant, v.load, undefined, v.mass > 0 ? v.mass : undefined);
        if (!r) return null;
        return {
          results: [
            { label: 'Deflection', value: r.deflection * 1000, unit: 'mm', highlight: true },
            { label: 'Force', value: r.force, unit: 'N' },
            { label: 'Potential Energy', value: r.potentialEnergy, unit: 'J' },
            { label: 'Natural Frequency', value: r.naturalFreqHz, unit: 'Hz' },
          ],
        };
      }}
    />
  );
}

// 19. Gear Ratio
function GearRatioTool() {
  return (
    <ToolShell name="Gear Ratio / Speed Calculator" description="Calculate gear ratio, output speed, and torque for a gear pair"
      domain="Machine Design · Power Transmission" accentColor={AMBER}
      inputs={[
        { key: 'inputTeeth', label: 'Input Gear Teeth', unit: '—', defaultValue: 20, min: 1, step: 1 },
        { key: 'outputTeeth', label: 'Output Gear Teeth', unit: '—', defaultValue: 60, min: 1, step: 1 },
        { key: 'inputRPM', label: 'Input Speed', unit: 'RPM', defaultValue: 3000, min: 0 },
        { key: 'inputTorque', label: 'Input Torque', unit: 'N·m', defaultValue: 50, min: 0 },
        { key: 'efficiency', label: 'Mesh Efficiency', unit: '—', defaultValue: 0.97, min: 0.5, max: 1, step: 0.01 },
      ]}
      equations={['GR = N₂/N₁', 'ω₂ = ω₁/GR', 'T₂ = T₁ · GR · η']}
      assumptions={['Ideal gear teeth profile', 'Constant mesh efficiency', 'No backlash effects', 'Single gear stage']}
      onCalculate={(v) => {
        const r = computeGearRatio(v.inputTeeth, v.outputTeeth, v.inputRPM, v.inputTorque, v.efficiency);
        if (!r) return null;
        return {
          results: [
            { label: 'Gear Ratio', value: r.gearRatio, unit: ':1', highlight: true },
            { label: 'Output Speed', value: r.outputRPM, unit: 'RPM' },
            { label: 'Output Torque', value: r.outputTorque, unit: 'N·m' },
            { label: 'Input Power', value: r.inputPower / 1000, unit: 'kW' },
            { label: 'Output Power', value: r.outputPower / 1000, unit: 'kW' },
            { label: 'Type', value: r.speedReduction ? 'Speed Reduction' : 'Speed Increase', unit: '' },
          ],
        };
      }}
    />
  );
}

// 20. Material Selection Tool
function MaterialsTool() {
  const [sortBy, setSortBy] = useState<string>('name');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(MATERIAL_DATABASE.map((m) => m.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filtered = useMemo(() => {
    let data = [...MATERIAL_DATABASE];
    if (filterCategory !== 'all') data = data.filter((m) => m.category === filterCategory);
    data.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'density') return a.density - b.density;
      if (sortBy === 'youngsModulus') return b.youngsModulus - a.youngsModulus;
      if (sortBy === 'yieldStrength') return b.yieldStrength - a.yieldStrength;
      return 0;
    });
    return data;
  }, [sortBy, filterCategory]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Material Selection Tool</h2>
        <p className="text-xs text-white/50">Compare aerospace and structural materials by mechanical and thermal properties</p>
        <p className="text-[10px] text-white/30 font-mono">Materials Science · Structural Design</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filterCategory === cat ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'text-white/40 border-white/5 hover:bg-white/5'
            }`}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-[10px] text-white/30">Sort by:</span>
        {['name', 'density', 'youngsModulus', 'yieldStrength'].map((s) => (
          <button key={s} onClick={() => setSortBy(s)}
            className={`px-2 py-1 rounded text-[10px] font-mono ${sortBy === s ? 'bg-amber-500/10 text-amber-300' : 'text-white/30 hover:text-white/60'}`}>
            {s === 'youngsModulus' ? 'E' : s === 'yieldStrength' ? 'σ_y' : s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-3 text-white/40 font-mono">Material</th>
              <th className="text-right py-2 px-3 text-white/40 font-mono">ρ (kg/m³)</th>
              <th className="text-right py-2 px-3 text-white/40 font-mono">E (GPa)</th>
              <th className="text-right py-2 px-3 text-white/40 font-mono">σ_y (MPa)</th>
              <th className="text-right py-2 px-3 text-white/40 font-mono">σ_u (MPa)</th>
              <th className="text-right py-2 px-3 text-white/40 font-mono">ν</th>
              <th className="text-right py-2 px-3 text-white/40 font-mono">α (10⁻⁶/°C)</th>
              <th className="text-left py-2 px-3 text-white/40 font-mono">Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.name} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-2 px-3 text-white/80 font-medium">{m.name}</td>
                <td className="py-2 px-3 text-right text-white/60 font-mono">{m.density}</td>
                <td className="py-2 px-3 text-right text-white/60 font-mono">{m.youngsModulus}</td>
                <td className="py-2 px-3 text-right text-white/60 font-mono">{m.yieldStrength}</td>
                <td className="py-2 px-3 text-right text-white/60 font-mono">{m.ultimateStrength}</td>
                <td className="py-2 px-3 text-right text-white/60 font-mono">{m.poissonRatio}</td>
                <td className="py-2 px-3 text-right text-white/60 font-mono">{m.thermalExpansion}</td>
                <td className="py-2 px-3 text-white/40">{m.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#0A1020] border border-white/8 rounded-lg p-3">
        <p className="text-[10px] text-amber-400/60 flex items-center gap-1.5">
          <span className="text-amber-400">⚠</span>
          Data source: Standard material handbooks (MIL-HDBK-5, MMPDS). Values are typical — consult manufacturer datasheets for specific alloy/temper/condition.
        </p>
      </div>
    </div>
  );
}
