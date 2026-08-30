import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Save,
  FileText,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Info,
  Copy,
} from "lucide-react";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import { useToastStore } from "@/stores/toastStore";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ToolInput {
  key: string;
  label: string;
  unit: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  group?: string;
}

export interface ToolResult {
  label: string;
  value: string | number;
  unit: string;
  highlight?: boolean;
}

interface ToolShellProps {
  name: string;
  description: string;
  domain: string;
  status?: "available" | "beta" | "experimental";
  inputs: ToolInput[];
  equations: string[];
  assumptions: string[];
  references?: string[];
  onCalculate: (values: Record<string, number>) => {
    results: ToolResult[];
    interpretation?: string;
    chartData?: any;
  } | null;
  renderVisualization?: (results: ToolResult[], chartData: any) => React.ReactNode;
  accentColor?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatForExport(
  name: string,
  inputs: Record<string, number>,
  inputDefs: ToolInput[],
  results: ToolResult[],
) {
  const timestamp = new Date().toISOString();
  const inputRows = Object.entries(inputs).map(([k, v]) => {
    const def = inputDefs.find((d) => d.key === k);
    return `${def?.label || k},${v},${def?.unit || ""}`;
  });
  const resultRows = results.map((r) => `${r.label},${r.value},${r.unit}`);

  return {
    csv: [
      `# AeroForge Tool Result — ${name}`,
      `# Timestamp: ${timestamp}`,
      `# WARNING: Simplified model. Not for production use.`,
      "",
      "Parameter,Value,Unit",
      "--- INPUTS ---,,",
      ...inputRows,
      "--- RESULTS ---,,",
      ...resultRows,
    ].join("\n"),
    json: JSON.stringify(
      {
        tool: name,
        timestamp,
        disclaimer:
          "Simplified model for conceptual analysis only. Not certified for production use.",
        inputs: Object.fromEntries(
          Object.entries(inputs).map(([k, v]) => {
            const def = inputDefs.find((d) => d.key === k);
            return [k, { value: v, unit: def?.unit || "" }];
          }),
        ),
        results: Object.fromEntries(
          results.map((r) => [r.label, { value: r.value, unit: r.unit }]),
        ),
      },
      null,
      2,
    ),
  };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ToolShell({
  name,
  description,
  domain,
  status = "available",
  inputs,
  equations,
  assumptions,
  references,
  onCalculate,
  renderVisualization,
  accentColor = "#0EA5E9",
}: ToolShellProps) {
  const { addToast } = useToastStore();
  const { saveExperiment } = useAeroForgeStore();

  // Input state
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(inputs.map((inp) => [inp.key, inp.defaultValue])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Results state
  const [results, setResults] = useState<ToolResult[] | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");
  const [chartData, setChartData] = useState<any>(null);
  const [calcState, setCalcState] = useState<"idle" | "loading" | "success" | "error">("idle");

  // UI state
  const [showMethod, setShowMethod] = useState(false);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleInputChange = useCallback(
    (key: string, raw: string) => {
      const num = parseFloat(raw);
      const def = inputs.find((i) => i.key === key);
      const newErrors = { ...errors };

      if (isNaN(num)) {
        newErrors[key] = `Invalid number`;
      } else if (def?.min !== undefined && num < def.min) {
        newErrors[key] = `Min: ${def.min} ${def.unit}`;
      } else if (def?.max !== undefined && num > def.max) {
        newErrors[key] = `Max: ${def.max} ${def.unit}`;
      } else {
        delete newErrors[key];
      }

      setErrors(newErrors);
      setValues((prev) => ({ ...prev, [key]: isNaN(num) ? prev[key] : num }));
    },
    [inputs, errors],
  );

  const handleCalculate = useCallback(() => {
    // Validate all inputs
    const newErrors: Record<string, string> = {};
    for (const inp of inputs) {
      const v = values[inp.key];
      if (v === undefined || v === null || isNaN(v)) {
        newErrors[inp.key] = "Required";
      } else if (inp.min !== undefined && v < inp.min) {
        newErrors[inp.key] = `Min: ${inp.min} ${inp.unit}`;
      } else if (inp.max !== undefined && v > inp.max) {
        newErrors[inp.key] = `Max: ${inp.max} ${inp.unit}`;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setCalcState("error");
      return;
    }

    setCalcState("loading");
    // Simulate brief calculation time for UX
    setTimeout(() => {
      try {
        const output = onCalculate(values);
        if (!output) {
          setCalcState("error");
          setResults(null);
          setInterpretation(
            "Calculation returned no results. Check inputs are within valid ranges.",
          );
          return;
        }
        setResults(output.results);
        setInterpretation(output.interpretation || "");
        setChartData(output.chartData || null);
        setCalcState("success");
      } catch (err: any) {
        setCalcState("error");
        setInterpretation(`Calculation error: ${err.message}`);
      }
    }, 150);
  }, [values, inputs, onCalculate]);

  const handleReset = useCallback(() => {
    setValues(Object.fromEntries(inputs.map((inp) => [inp.key, inp.defaultValue])));
    setErrors({});
    setResults(null);
    setInterpretation("");
    setChartData(null);
    setCalcState("idle");
  }, [inputs]);

  const handleExport = useCallback(
    (format: "csv" | "json") => {
      if (!results) return;
      const data = formatForExport(name, values, inputs, results);
      const content = format === "csv" ? data.csv : data.json;
      const blob = new Blob([content], {
        type: format === "csv" ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aeroforge_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({ type: "success", title: `Exported as ${format.toUpperCase()}` });
    },
    [results, name, values, inputs, addToast],
  );

  const handleSaveToProject = useCallback(() => {
    if (!results) return;
    saveExperiment({
      name: `${name} Analysis`,
      pillar: "aerolab",
      module: name,
      parameters: values,
      results: Object.fromEntries(results.map((r) => [r.label, `${r.value} ${r.unit}`])),
      userMode: "professional",
      notes: interpretation,
    });
    addToast({ type: "success", title: "Saved to experiments" });
  }, [results, name, values, interpretation, saveExperiment, addToast]);

  const handleCopyResults = useCallback(() => {
    if (!results) return;
    const text = results.map((r) => `${r.label}: ${r.value} ${r.unit}`).join("\n");
    navigator.clipboard.writeText(text);
    addToast({ type: "success", title: "Results copied to clipboard" });
  }, [results, addToast]);

  // ─── Group inputs ─────────────────────────────────────────────────────────

  const groups = new Map<string, ToolInput[]>();
  for (const inp of inputs) {
    const g = inp.group || "Parameters";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(inp);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const statusColors: Record<string, string> = {
    available: "#22C55E",
    beta: "#F59E0B",
    experimental: "#EF4444",
  };

  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {name}
            <span
              className="text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider"
              style={{
                backgroundColor: statusColors[status] + "20",
                color: statusColors[status],
                border: `1px solid ${statusColors[status]}40`,
              }}
            >
              {status}
            </span>
          </h2>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
          <p className="text-[10px] text-white/30 font-mono mt-0.5">{domain}</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all border border-white/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Left: Inputs ─────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {Array.from(groups.entries()).map(([groupName, groupInputs]) => (
            <div
              key={groupName}
              className="bg-[#0A1020] border border-white/8 rounded-lg p-4 space-y-3"
            >
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                {groupName}
              </h3>
              {groupInputs.map((inp) => {
                const hasError = !!errors[inp.key];
                return (
                  <div key={inp.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-white/70 font-medium">{inp.label}</label>
                      <span className="text-[10px] text-white/30 font-mono">{inp.unit}</span>
                    </div>
                    <input
                      type="number"
                      value={values[inp.key]}
                      onChange={(e) => handleInputChange(inp.key, e.target.value)}
                      step={inp.step || "any"}
                      min={inp.min}
                      max={inp.max}
                      className={`w-full bg-[#060B18] border rounded-lg px-3 py-2 text-sm text-white font-mono outline-none transition-all
                        ${hasError ? "border-red-500/60 focus:border-red-400" : "border-white/10 focus:border-cyan-500/50"}
                        hover:border-white/20`}
                    />
                    <AnimatePresence>
                      {hasError && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[11px] text-red-400 mt-1 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {errors[inp.key]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {inp.helpText && !hasError && (
                      <p className="text-[10px] text-white/25 mt-0.5">{inp.helpText}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* ── Method (collapsible) ─────────────────────────────────────── */}
          <button
            onClick={() => setShowMethod(!showMethod)}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 bg-[#0A1020] border border-white/8 rounded-lg text-xs text-white/50 hover:text-white/70 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="font-medium">Method, Equations & Assumptions</span>
            {showMethod ? (
              <ChevronUp className="w-3.5 h-3.5 ml-auto" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-auto" />
            )}
          </button>
          <AnimatePresence>
            {showMethod && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#0A1020] border border-white/8 rounded-lg p-4 space-y-3 overflow-hidden"
              >
                {equations.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">
                      Equations
                    </h4>
                    {equations.map((eq, i) => (
                      <p
                        key={i}
                        className="text-xs text-cyan-300/80 font-mono bg-cyan-500/5 px-2 py-1 rounded mb-1"
                      >
                        {eq}
                      </p>
                    ))}
                  </div>
                )}
                {assumptions.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">
                      Assumptions
                    </h4>
                    {assumptions.map((a, i) => (
                      <p key={i} className="text-[11px] text-white/40 flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5">•</span> {a}
                      </p>
                    ))}
                  </div>
                )}
                {references && references.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">
                      References
                    </h4>
                    {references.map((r, i) => (
                      <p key={i} className="text-[11px] text-white/30 italic">
                        {r}
                      </p>
                    ))}
                  </div>
                )}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-amber-400/60 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Simplified model for conceptual analysis. Not certified for production use.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Calculate Button ──────────────────────────────────────────── */}
          <button
            onClick={handleCalculate}
            disabled={calcState === "loading"}
            className="w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              backgroundColor: accentColor + "20",
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            {calcState === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate"
            )}
          </button>
        </div>

        {/* ── Right: Results ───────────────────────────────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {calcState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#0A1020] border border-white/8 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[200px]"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-white/20" />
                </div>
                <p className="text-sm text-white/30">Enter parameters and click Calculate</p>
                <p className="text-[11px] text-white/15 mt-1">Results will appear here</p>
              </motion.div>
            )}

            {calcState === "error" && !results && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/5 border border-red-500/20 rounded-lg p-6 text-center min-h-[200px] flex flex-col items-center justify-center"
              >
                <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
                <p className="text-sm text-red-300">
                  {interpretation || "Invalid inputs. Check highlighted fields."}
                </p>
              </motion.div>
            )}

            {(calcState === "success" || (calcState === "loading" && results)) && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Results Grid */}
                <div className="bg-[#0A1020] border border-white/8 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      Results
                    </h3>
                    <button
                      onClick={handleCopyResults}
                      className="text-white/30 hover:text-white/60 transition-colors"
                      title="Copy results"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {results.map((r, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                          r.highlight
                            ? "bg-cyan-500/8 border border-cyan-500/15"
                            : "bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-xs text-white/60">{r.label}</span>
                        <span
                          className={`text-sm font-mono font-bold ${r.highlight ? "text-cyan-300" : "text-white/90"}`}
                        >
                          {typeof r.value === "number"
                            ? Math.abs(r.value) > 1e6 || (Math.abs(r.value) < 0.01 && r.value !== 0)
                              ? r.value.toExponential(4)
                              : r.value.toFixed(4)
                            : r.value}
                          <span className="text-white/30 text-[10px] ml-1.5">{r.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interpretation */}
                {interpretation && (
                  <div className="bg-[#0A1020] border border-white/8 rounded-lg p-4">
                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                      Interpretation
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">{interpretation}</p>
                  </div>
                )}

                {/* Visualization */}
                {renderVisualization && chartData && (
                  <div className="bg-[#0A1020] border border-white/8 rounded-lg p-4">
                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                      Visualization
                    </h3>
                    {renderVisualization(results, chartData)}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleExport("csv")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all border border-white/5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all border border-white/5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                  </button>
                  <button
                    onClick={handleSaveToProject}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all border"
                    style={{
                      backgroundColor: accentColor + "10",
                      color: accentColor,
                      borderColor: accentColor + "30",
                    }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save to Project
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
