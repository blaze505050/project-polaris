import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Crosshair, Download, RotateCcw, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAeroForgeStore } from "@/stores/aeroforgeStore";
import { generateSyntheticStarField, computeAperturePhotometry } from "@/services/physicsEngine";

export default function PhotometrySuite() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userMode = useAeroForgeStore((s) => s.userMode);

  // Image parameters
  const [imgWidth] = useState(400);
  const [imgHeight] = useState(400);
  const [skyBackground, setSkyBackground] = useState(200);
  const [readNoise, setReadNoise] = useState(5);
  const [gain, setGain] = useState(1.5);
  const [exposureTime, setExposureTime] = useState(300);

  // Aperture parameters
  const [aperturePos, setAperturePos] = useState<{ x: number; y: number } | null>(null);
  const [apertureRadius, setApertureRadius] = useState(8);
  const [innerAnnulus, setInnerAnnulus] = useState(12);
  const [outerAnnulus, setOuterAnnulus] = useState(18);
  const [colorMap, setColorMap] = useState<"heat" | "gray" | "viridis">("heat");

  // Synthetic star field
  const stars = useMemo(
    () => [
      { x: 120, y: 150, flux: 50000, fwhm: 4 },
      { x: 250, y: 200, flux: 25000, fwhm: 3.5 },
      { x: 80, y: 300, flux: 80000, fwhm: 5 },
      { x: 300, y: 100, flux: 15000, fwhm: 3 },
      { x: 180, y: 280, flux: 40000, fwhm: 4.2 },
      { x: 350, y: 320, flux: 10000, fwhm: 3 },
      { x: 60, y: 60, flux: 60000, fwhm: 4.5 },
      { x: 320, y: 250, flux: 35000, fwhm: 3.8 },
    ],
    [],
  );

  const imageData = useMemo(
    () => generateSyntheticStarField(imgWidth, imgHeight, stars, skyBackground, readNoise),
    [imgWidth, imgHeight, stars, skyBackground, readNoise],
  );

  // Photometry result
  const photResult = useMemo(() => {
    if (!aperturePos) return null;
    return computeAperturePhotometry(
      imageData,
      aperturePos.x,
      aperturePos.y,
      apertureRadius,
      innerAnnulus,
      outerAnnulus,
      readNoise,
      0.01,
      exposureTime,
      gain,
    );
  }, [
    aperturePos,
    apertureRadius,
    innerAnnulus,
    outerAnnulus,
    imageData,
    readNoise,
    exposureTime,
    gain,
  ]);

  // Color mapping functions
  const applyColorMap = useCallback(
    (value: number, min: number, max: number): [number, number, number] => {
      const t = Math.max(0, Math.min(1, (value - min) / (max - min + 1)));
      switch (colorMap) {
        case "heat":
          return [
            Math.min(255, t * 510),
            Math.min(255, Math.max(0, (t - 0.33) * 760)),
            Math.min(255, Math.max(0, (t - 0.67) * 760)),
          ];
        case "viridis":
          return [68 + t * 180, 1 + t * 200, 84 + t * 120];
        default: // gray
          return [t * 255, t * 255, t * 255];
      }
    },
    [colorMap],
  );

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth;
    const displayH = canvas.clientHeight;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);

    const scaleX = displayW / imgWidth;
    const scaleY = displayH / imgHeight;

    // Find min/max for normalization
    let min = Infinity,
      max = -Infinity;
    for (const row of imageData) {
      for (const v of row) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }

    // Draw image
    const imgData = ctx.createImageData(imgWidth, imgHeight);
    for (let y = 0; y < imgHeight; y++) {
      for (let x = 0; x < imgWidth; x++) {
        const [r, g, b] = applyColorMap(imageData[y][x], min, max);
        const idx = (y * imgWidth + x) * 4;
        imgData.data[idx] = r;
        imgData.data[idx + 1] = g;
        imgData.data[idx + 2] = b;
        imgData.data[idx + 3] = 255;
      }
    }

    // Put image data at correct scale
    const offCanvas = document.createElement("canvas");
    offCanvas.width = imgWidth;
    offCanvas.height = imgHeight;
    offCanvas.getContext("2d")!.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offCanvas, 0, 0, displayW, displayH);

    // Draw aperture overlay
    if (aperturePos) {
      const ax = aperturePos.x * scaleX;
      const ay = aperturePos.y * scaleY;

      // Sky annulus
      ctx.strokeStyle = "rgba(255,255,0,0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(ax, ay, innerAnnulus * scaleX, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ax, ay, outerAnnulus * scaleX, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Source aperture
      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ax, ay, apertureRadius * scaleX, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshair
      ctx.strokeStyle = "rgba(0,240,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax - 15, ay);
      ctx.lineTo(ax + 15, ay);
      ctx.moveTo(ax, ay - 15);
      ctx.lineTo(ax, ay + 15);
      ctx.stroke();
    }
  }, [
    imageData,
    aperturePos,
    apertureRadius,
    innerAnnulus,
    outerAnnulus,
    applyColorMap,
    imgWidth,
    imgHeight,
  ]);

  // Handle click to place aperture
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * imgWidth;
    const y = ((e.clientY - rect.top) / rect.height) * imgHeight;
    setAperturePos({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white">
      <Header />
      <div className="max-w-[120rem] mx-auto px-4 md:px-[4%] py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/astrolab")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Photometry Suite — Aperture Analysis
            </h1>
            <p className="text-sm text-white/50 font-mono">
              Click any star to measure Net Sky-Subtracted Flux & SNR
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FITS Image Canvas */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl overflow-hidden border border-white/10 bg-black"
              style={{ boxShadow: "0 0 40px rgba(245,158,11,0.05)" }}
            >
              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair"
                style={{ height: "500px" }}
                onClick={handleCanvasClick}
              />
              {/* Color map selector */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-t border-white/5">
                <span className="text-xs text-white/40 font-mono">Colormap:</span>
                {(["heat", "gray", "viridis"] as const).map((cm) => (
                  <button
                    key={cm}
                    onClick={() => setColorMap(cm)}
                    className={`px-3 py-1 text-xs font-mono rounded transition-all ${colorMap === cm ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-white/40 hover:text-white/70 border border-transparent"}`}
                  >
                    {cm}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => setAperturePos(null)}
                  className="px-3 py-1 text-xs font-mono text-white/40 hover:text-white/70 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>

            {userMode === "student" && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-amber-400/80">
                  💡 <strong>How Aperture Photometry Works:</strong> Click on a star to place a
                  circular aperture (cyan circle). The sky background is measured in the annular
                  ring (yellow dashed). Net flux = Star counts − Sky counts. Signal-to-Noise Ratio
                  (SNR) tells you how confident the measurement is.
                </p>
              </div>
            )}
          </div>

          {/* Controls & Results Panel */}
          <div className="space-y-4">
            {/* Aperture Settings */}
            <div
              className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
              style={{ backdropFilter: "blur(20px)" }}
            >
              <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" /> Aperture Parameters
              </h3>
              {[
                {
                  label: "Aperture Radius",
                  value: apertureRadius,
                  set: setApertureRadius,
                  min: 3,
                  max: 25,
                  unit: "px",
                },
                {
                  label: "Inner Annulus",
                  value: innerAnnulus,
                  set: setInnerAnnulus,
                  min: 5,
                  max: 35,
                  unit: "px",
                },
                {
                  label: "Outer Annulus",
                  value: outerAnnulus,
                  set: setOuterAnnulus,
                  min: 10,
                  max: 50,
                  unit: "px",
                },
              ].map((param) => (
                <div key={param.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">{param.label}</span>
                    <span className="font-mono text-amber-400">
                      {param.value} {param.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    value={param.value}
                    onChange={(e) => param.set(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              ))}

              {userMode === "professional" && (
                <>
                  <div className="border-t border-white/5 my-3 pt-3">
                    <h4 className="text-xs text-white/40 mb-2">Detector Settings</h4>
                    {[
                      {
                        label: "Read Noise (e⁻/pix)",
                        value: readNoise,
                        set: setReadNoise,
                        min: 1,
                        max: 20,
                      },
                      {
                        label: "Gain (e⁻/ADU)",
                        value: gain,
                        set: (v: number) => setGain(v / 10),
                        min: 5,
                        max: 50,
                        display: gain.toFixed(1),
                      },
                      {
                        label: "Exposure (s)",
                        value: exposureTime,
                        set: setExposureTime,
                        min: 1,
                        max: 3600,
                      },
                      {
                        label: "Sky Background (ADU)",
                        value: skyBackground,
                        set: setSkyBackground,
                        min: 50,
                        max: 500,
                      },
                    ].map((param) => (
                      <div key={param.label} className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/40">{param.label}</span>
                          <span className="font-mono text-white/60">
                            {"display" in param ? (param as any).display : param.value}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          value={param.value}
                          onChange={(e) => param.set(Number(e.target.value))}
                          className="w-full h-1 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/50 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Photometry Results */}
            {photResult && aperturePos && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
                style={{ backdropFilter: "blur(20px)" }}
              >
                <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                  <Crosshair className="w-4 h-4" /> Measurement Results
                </h3>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "Position",
                      value: `(${aperturePos.x}, ${aperturePos.y})`,
                      highlight: false,
                    },
                    {
                      label: "Source Flux",
                      value: `${photResult.sourceFlux.toFixed(0)} ADU`,
                      highlight: false,
                    },
                    {
                      label: "Sky/pixel",
                      value: `${photResult.skyFluxPerPixel.toFixed(1)} ADU`,
                      highlight: false,
                    },
                    {
                      label: "Net Flux",
                      value: `${photResult.netFlux.toFixed(1)} ADU`,
                      highlight: true,
                    },
                    { label: "SNR", value: photResult.snr.toFixed(2), highlight: true },
                    {
                      label: "Instrumental Mag",
                      value:
                        photResult.instrumentalMag < 50
                          ? photResult.instrumentalMag.toFixed(3)
                          : "N/A",
                      highlight: true,
                    },
                    {
                      label: "Source Pixels",
                      value: photResult.sourcePixels.toString(),
                      highlight: false,
                    },
                    {
                      label: "Sky Pixels",
                      value: photResult.skyPixels.toString(),
                      highlight: false,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={`flex justify-between items-center py-1.5 border-b border-white/5 ${row.highlight ? "" : ""}`}
                    >
                      <span className="text-xs text-white/40">{row.label}</span>
                      <span
                        className={`font-mono text-sm ${row.highlight ? "text-amber-400 font-bold" : "text-white/80"}`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {userMode === "professional" && (
                  <div className="mt-3 p-3 rounded-lg bg-black/30 border border-white/5">
                    <p className="text-xs font-mono text-white/40 leading-relaxed">
                      SNR = S_net / √(S_src + n·B_sky + n·D·t + n·R²)
                      <br />
                      m_inst = -2.5 · log₁₀(F_net)
                      <br />
                      n_src = {photResult.sourcePixels}, R² contrib ={" "}
                      {photResult.readNoiseContrib.toFixed(1)} e⁻
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {!aperturePos && (
              <div
                className="rounded-xl bg-white/[0.03] border border-white/10 p-6 text-center"
                style={{ backdropFilter: "blur(20px)" }}
              >
                <Crosshair className="w-8 h-8 mx-auto mb-3 text-amber-400/30" />
                <p className="text-sm text-white/40">
                  Click on a star in the image to begin photometric measurement
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
