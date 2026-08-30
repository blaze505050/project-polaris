import React from "react";
import {
  Cpu,
  Hash,
  Layers,
  Box,
  Thermometer,
  Calendar,
  Server,
  FileText,
  Database,
} from "lucide-react";

interface ReproducibilityData {
  solver?: string;
  solverVersion?: string;
  geometryVersion?: string;
  meshVersion?: string;
  meshCells?: string;
  boundaryConditions?: string[];
  material?: string;
  turbulenceModel?: string;
  units?: string;
  date?: string;
  computeEnvironment?: string;
  randomSeed?: string;
  datasetVersion?: string;
}

interface ReproducibilityPanelProps {
  data: ReproducibilityData;
  className?: string;
}

export default function ReproducibilityPanel({ data, className = "" }: ReproducibilityPanelProps) {
  const rows: { label: string; value: string | undefined; icon: React.ElementType }[] = [
    { label: "Solver", value: data.solver, icon: Cpu },
    { label: "Solver Version", value: data.solverVersion, icon: Hash },
    { label: "Geometry Version", value: data.geometryVersion, icon: Box },
    { label: "Mesh Version", value: data.meshVersion, icon: Layers },
    { label: "Mesh Size", value: data.meshCells, icon: Layers },
    { label: "Turbulence Model", value: data.turbulenceModel, icon: Cpu },
    { label: "Material", value: data.material, icon: Thermometer },
    { label: "Units", value: data.units, icon: FileText },
    { label: "Compute Environment", value: data.computeEnvironment, icon: Server },
    { label: "Dataset Version", value: data.datasetVersion, icon: Database },
    { label: "Random Seed", value: data.randomSeed, icon: Hash },
    { label: "Date", value: data.date, icon: Calendar },
  ];

  const activeRows = rows.filter((r) => r.value);

  if (activeRows.length === 0) return null;

  return (
    <div className={`bg-[#080E1C] border border-white/10 rounded-lg p-4 ${className}`}>
      <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        REPRODUCIBILITY RECORD
      </h4>

      <div className="space-y-1.5">
        {activeRows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between py-1.5 px-2 rounded bg-[#050914] border border-white/5 text-[10px]"
            >
              <div className="flex items-center gap-2 text-white/50">
                <Icon className="w-3 h-3 text-cyan-400/60" />
                <span className="font-mono uppercase tracking-wider">{row.label}</span>
              </div>
              <span className="text-white/80 font-mono font-semibold">{row.value}</span>
            </div>
          );
        })}

        {data.boundaryConditions && data.boundaryConditions.length > 0 && (
          <div className="py-1.5 px-2 rounded bg-[#050914] border border-white/5 text-[10px]">
            <div className="flex items-center gap-2 text-white/50 mb-1.5">
              <FileText className="w-3 h-3 text-cyan-400/60" />
              <span className="font-mono uppercase tracking-wider">Boundary Conditions</span>
            </div>
            <div className="pl-5 space-y-0.5">
              {data.boundaryConditions.map((bc, i) => (
                <p key={i} className="text-white/70 font-mono text-[9px]">
                  • {bc}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
