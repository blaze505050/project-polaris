import React, { useState } from "react";
import { Database, Download, History, Save, Check } from "lucide-react";
import { useAeroForgeStore, type SavedExperiment, type Pillar } from "@/stores/aeroforgeStore";

interface ExperimentHistoryLoggerProps {
  moduleName: string;
  pillar?: Pillar;
  currentInputs: Record<string, number | string | boolean>;
  currentOutputs: Record<string, number | string>;
  className?: string;
}

export default function ExperimentHistoryLogger({
  moduleName,
  pillar = "astrolab",
  currentInputs,
  currentOutputs,
  className = "",
}: ExperimentHistoryLoggerProps) {
  const { savedExperiments, saveExperiment, userMode, deleteExperiment } = useAeroForgeStore();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter history for this module
  const history = savedExperiments.filter((exp) => exp.module === moduleName);

  const handleSave = () => {
    saveExperiment({
      name: `${moduleName} Run`,
      pillar,
      module: moduleName,
      parameters: currentInputs,
      results: currentOutputs,
      userMode,
      notes: "Automated workstation experiment log",
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportCSV = () => {
    const dataToExport = history.length
      ? history
      : [
          {
            id: `EXP-${Date.now().toString().slice(-6)}`,
            timestamp: Date.now(),
            module: moduleName,
            parameters: currentInputs,
            results: currentOutputs,
          },
        ];

    const allKeys = new Set<string>();
    dataToExport.forEach((exp) => {
      Object.keys(exp.parameters || {}).forEach((k) => allKeys.add(`param_${k}`));
      Object.keys(exp.results || {}).forEach((k) => allKeys.add(`result_${k}`));
    });

    const header = ["Experiment_ID", "Timestamp", "Module", ...Array.from(allKeys)].join(",");
    const rows = dataToExport.map((exp) => {
      const vals = Array.from(allKeys).map((k) => {
        if (k.startsWith("param_")) {
          const val = (exp.parameters || {})[k.replace("param_", "")];
          return typeof val === "object" ? JSON.stringify(val) : val;
        } else {
          const val = (exp.results || {})[k.replace("result_", "")];
          return typeof val === "object" ? JSON.stringify(val) : val;
        }
      });
      return [exp.id, new Date(exp.timestamp).toISOString(), exp.module, ...vals].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${moduleName.toLowerCase().replace(/\s+/g, "_")}_experiment_data.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataToExport = history.length
      ? history
      : [
          {
            id: `EXP-${Date.now().toString().slice(-6)}`,
            timestamp: Date.now(),
            module: moduleName,
            parameters: currentInputs,
            results: currentOutputs,
          },
        ];

    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute(
      "download",
      `${moduleName.toLowerCase().replace(/\s+/g, "_")}_experiment_data.json`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`rounded-xl border border-white/10 bg-[#080d1a] p-4 text-xs font-mono text-white/80 ${className}`}
    >
      <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2 text-amber-400">
          <History className="w-4 h-4" />
          <span className="font-semibold uppercase">Experiment History & Data Export</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors"
          >
            {savedSuccess ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {savedSuccess ? "SAVED!" : "LOG EXPERIMENT"}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
            title="Export CSV for Pandas/NumPy"
          >
            <Download className="w-3 h-3" /> CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition-colors"
            title="Export JSON"
          >
            <Database className="w-3 h-3" /> JSON
          </button>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {history
            .slice(-5)
            .reverse()
            .map((exp) => (
              <div
                key={exp.id}
                className="p-2 rounded bg-black/30 border border-white/5 flex items-center justify-between text-[11px]"
              >
                <div>
                  <span className="font-bold text-amber-400">{exp.id}</span>
                  <span className="text-white/40 ml-2">
                    {new Date(exp.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-white/60 truncate max-w-xs">
                  Params: {Object.keys(exp.parameters || {}).length} | Results:{" "}
                  {Object.keys(exp.results || {}).length}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-white/30 text-[11px] italic">
          No saved experiment runs for this session. Click "Log Experiment" to save your current
          inputs and outputs.
        </p>
      )}
    </div>
  );
}
