import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Wrench,
  Activity,
  FileText,
  HelpCircle,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AICopilotSidebarProps {
  projectId?: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export default function AICopilotSidebar({
  projectId,
  isOpen,
  onToggle,
}: AICopilotSidebarProps) {
  const { addToast } = useToastStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text:
        'AeroForge Engineering Copilot connected to active CFD Case 04. I am analyzing the boundary layer velocity contours and convergence logs.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = [
    { label: 'Analyze this result', prompt: 'Analyze aerodynamic convergence and pressure coefficient Cp for active CFD Case 04.' },
    { label: 'Explain convergence failure', prompt: 'Explain why Shockwave Intersection mesh test failed with Courant number > 1.0.' },
    { label: 'Compare experiments', prompt: 'Compare CFD Case 04 wing lift-to-drag ratio L/D against structural FEA constraints.' },
    { label: 'Optimize this wing', prompt: 'Suggest camber and thickness distribution optimization to delay shock-induced separation.' },
    { label: 'Find papers', prompt: 'Find AIAA papers related to Mach 5.0 hypersonic boundary layer stability.' },
    { label: 'Generate report', prompt: 'Compile a full AS9100-compliant engineering report for this simulation project.' },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate AI Copilot Response with Provenance Badges
    setTimeout(() => {
      let response =
        '[AI HEURISTIC INTERPRETATION] Based on subsonic thin airfoil theory calculations (C_L = 0.440, C_D = 0.008): Boundary layer velocity gradients indicate steady attached flow at AoA = 4.0°. [RECOMMENDATION] Verify boundary layer displacement thickness at higher angles of attack using XFOIL or RANS solvers.';

      if (text.includes('failure') || text.includes('Courant')) {
        response =
          '[DIAGNOSTIC ANALYSIS] High Courant number (Co > 1.0) occurs when the time step exceeds local cell residence time. [RECOMMENDED FIX] Reduce global CFL number or refine inflation layer mesh growth rate to 1.15.';
      } else if (text.includes('report') || text.includes('AS9100')) {
        response =
          '[CALCULATED ARTIFACT] Technical summary report compiled. [PROVENANCE] Digital thread hash #EXP-2026-NACA2412 attached with Prandtl-Glauert compressibility parameters.';
        addToast({
          title: 'Engineering Report Generated',
          description: 'Report PDF saved to project knowledge artifacts.',
          type: 'success',
        });
      } else if (text.includes('paper') || text.includes('literature')) {
        response =
          '[LITERATURE CITATION] Abbott & Von Doenhoff (1959), "Theory of Wing Sections", Dover Publications, p. 462. Benchmark wind tunnel data confirms lift curve slope dC_L/dα ≈ 2π per radian for thin symmetric airfoils.';
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Pill when closed */}
      {!isOpen && (
        <button
          onClick={() => onToggle(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#080E1C] border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold shadow-2xl hover:bg-cyan-500 hover:text-black transition-all"
        >
          <Brain className="w-4 h-4" />
          <span>AI Copilot</span>
        </button>
      )}

      {/* Slide-over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            className="fixed right-0 top-12 h-[calc(100vh-3rem)] w-96 z-40 bg-[#060B18] border-l border-white/10 shadow-2xl flex flex-col font-mono text-xs text-white"
          >
            {/* Drawer Header */}
            <div className="p-3.5 bg-[#080E20] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs">Engineering AI Copilot</span>
              </div>
              <button
                onClick={() => onToggle(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contextual Action Chips */}
            <div className="p-3 bg-[#080E1C] border-b border-white/5 space-y-1.5">
              <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
                CONTEXTUAL ACTIONS
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(action.prompt)}
                    className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 text-[10px] text-white/70 transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg text-[11px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                        : 'bg-[#0A1224] text-white/90 border border-white/10'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-white/30 mt-0.5 px-1">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[#080E20] border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask engineering copilot..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#050914] border border-white/15 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded bg-cyan-500 text-black hover:bg-cyan-400 font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
