import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Microscope, Crown } from 'lucide-react';
import { useAstroLabStore, LabMode } from '@/stores/astrolabStore';

interface ModeOption {
  id: LabMode;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

const MODES: ModeOption[] = [
  {
    id: 'explorer',
    label: 'Explorer Mode',
    description: 'Interactive visualization and real-time exploration of celestial phenomena',
    icon: Zap,
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'learning',
    label: 'Learning Mode',
    description: 'Guided educational experience with challenges and step-by-step tutorials',
    icon: BookOpen,
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'research',
    label: 'Research Mode',
    description: 'Advanced tools for scientific research with full data export and analysis',
    icon: Microscope,
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'investor-demo',
    label: 'Investor Demo',
    description: 'Professional presentation mode showcasing platform capabilities',
    icon: Crown,
    color: 'from-amber-600 to-orange-600',
    badge: 'Premium',
  },
];

export default function AstroLabModeSelector() {
  const { currentMode, setMode } = useAstroLabStore();

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-foreground">Select Lab Mode</h2>
        <p className="text-foreground/70 text-sm">
          Choose your experience level and access appropriate tools and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              onClick={() => setMode(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-xl border-2 transition-all text-left group ${
                isActive
                  ? 'border-aerospace-blue bg-aerospace-blue/10'
                  : 'border-secondary/30 bg-primary hover:border-aerospace-blue/50'
              }`}
            >
              {/* Badge */}
              {mode.badge && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-aerospace-warning/20 border border-aerospace-warning/50 rounded text-xs font-mono text-aerospace-warning">
                  {mode.badge}
                </div>
              )}

              {/* Icon */}
              <Icon className={`w-8 h-8 mb-3 transition-colors ${
                isActive ? 'text-aerospace-blue' : 'text-foreground/60 group-hover:text-aerospace-blue'
              }`} />

              {/* Label */}
              <h3 className="font-heading font-bold text-foreground mb-2">{mode.label}</h3>

              {/* Description */}
              <p className="text-xs text-foreground/70 leading-relaxed mb-4">{mode.description}</p>

              {/* Active Indicator */}
              {isActive && (
                <div className="flex items-center gap-2 text-aerospace-blue text-xs font-mono">
                  <div className="w-2 h-2 rounded-full bg-aerospace-blue" />
                  Active
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mode Info */}
      <motion.div
        key={currentMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-primary border border-aerospace-blue/20 rounded-lg"
      >
        <p className="text-sm text-foreground/80">
          <span className="font-mono text-aerospace-blue">Current Mode:</span>{' '}
          {MODES.find((m) => m.id === currentMode)?.label}
        </p>
      </motion.div>
    </div>
  );
}
