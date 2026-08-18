import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpTooltipProps {
  text: string;
  delay?: number;
}

export default function HelpTooltip({ text, delay = 0 }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-aerospace-blue/20 hover:bg-aerospace-blue/40 text-aerospace-blue transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.2, delay }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 w-48 p-3 bg-primary border border-aerospace-blue/40 rounded-lg shadow-lg"
          >
            <p className="font-paragraph text-xs text-foreground/80 leading-relaxed">
              {text}
            </p>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary border-r border-b border-aerospace-blue/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
