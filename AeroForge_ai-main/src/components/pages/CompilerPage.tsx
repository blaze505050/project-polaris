import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Play, Download, Copy, CheckCircle2, AlertCircle, Zap, Terminal, FileJson, Settings } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CompilerPage() {
  const [code, setCode] = useState(`// AeroForge Design Compiler
// Define your aerospace component

component Wing {
  geometry {
    span: 35.5m
    chord: 4.2m
    thickness: 0.18
    sweep: 25°
  }
  
  materials {
    primary: "7075-T6 Aluminum"
    fasteners: "Titanium Grade 5"
  }
  
  validation {
    standard: "AS9100C"
    tolerance: ±0.001mm
  }
}`);

  const [output, setOutput] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    // Simulate compilation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOutput(JSON.stringify({
      status: "SUCCESS",
      geometry: {
        vertices: 2847,
        faces: 5694,
        edges: 8541
      },
      validation: {
        passed: true,
        checks: ["Topology", "Tolerance", "Manufacturing"],
        timestamp: new Date().toISOString()
      },
      cad: {
        format: "STEP",
        size: "2.4MB",
        ready: true
      }
    }, null, 2));
    setIsCompiling(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-aerospace-dark text-foreground font-paragraph flex flex-col">
      <Header />
      
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-20 bg-primary border-b border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-aerospace-blue" />
                <span className="font-mono text-sm uppercase tracking-widest text-aerospace-blue">Design Compiler</span>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4">
                Deterministic CAD <span className="text-aerospace-blue">Compilation</span>
              </h1>
              <p className="font-paragraph text-xl text-secondary-foreground max-w-2xl mx-auto">
                Write your aerospace design once, compile to production-ready CAD with guaranteed consistency.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Compiler Interface */}
        <section className="w-full py-16 bg-aerospace-dark">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Code Editor */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-aerospace-blue" />
                    <h2 className="font-heading text-lg font-bold text-foreground">Design Definition</h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy design code to clipboard"
                    className="p-2 hover:bg-secondary/20 rounded transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5 text-aerospace-success" />
                    ) : (
                      <Copy className="w-5 h-5 text-aerospace-blue" />
                    )}
                  </button>
                </div>
                
                <textarea
                  value={code}
                  aria-label="Aerospace Component Design Definition Code Editor"
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 bg-[#090f20] border border-secondary/40 rounded-lg p-4 md:p-5 font-mono text-sm text-slate-100 focus:outline-none focus:border-aerospace-blue/70 resize-none shadow-inner"
                />
                
                <button
                  type="button"
                  onClick={handleCompile}
                  disabled={isCompiling}
                  aria-label="Compile design to production-ready CAD"
                  className="w-full group relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-aerospace-blue to-aerospace-accent text-white font-mono text-sm uppercase tracking-wider hover:shadow-xl transition-all duration-300 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isCompiling ? (
                      <>
                        <Zap className="w-4 h-4 animate-pulse" />
                        Compiling...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Compile Design
                      </>
                    )}
                  </span>
                </button>
              </motion.div>

              {/* Output Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-aerospace-accent" />
                  <h2 className="font-heading text-lg font-bold text-foreground">CAD Output</h2>
                </div>
                
                <div className="bg-[#090f20] border border-secondary/40 rounded-lg p-4 md:p-5 h-96 overflow-auto shadow-inner">
                  {output ? (
                    <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap break-words">
                      {output}
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div className="space-y-3">
                        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-mono text-sm text-slate-300">
                          Compile your design to see output
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {output && (
                  <button
                    type="button"
                    aria-label="Download generated STEP CAD file"
                    className="w-full group relative inline-flex items-center justify-center px-6 py-3 bg-secondary/20 border border-aerospace-blue/30 text-aerospace-blue font-mono text-sm uppercase tracking-wider hover:bg-secondary/30 transition-all duration-300 rounded-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download STEP File
                    </span>
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-20 bg-primary border-t border-secondary/20">
          <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
                Compiler Features
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground max-w-2xl mx-auto">
                Deterministic parametric design compilation with transparent mathematical rules
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: CheckCircle2, title: 'Deterministic', desc: 'Same output every time' },
                { icon: Zap, title: 'Real-Time', desc: 'Instant compilation' },
                { icon: Settings, title: 'Validated', desc: 'Analytical Verification' },
                { icon: Download, title: 'Export Ready', desc: 'STEP, IGES, STL formats' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-aerospace-dark/50 border border-aerospace-blue/20 rounded-lg p-6 text-center hover:border-aerospace-blue/50 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-aerospace-blue mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="font-paragraph text-sm text-secondary-foreground">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
