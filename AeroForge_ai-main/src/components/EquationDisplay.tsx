import React from 'react';
import { motion } from 'framer-motion';
import { Copy } from 'lucide-react';

interface EquationDisplayProps {
  title: string;
  latex: string;
  description?: string;
  variables?: Record<string, string>;
  copyable?: boolean;
  displayMode?: boolean;
}

export default function EquationDisplay({
  title,
  latex,
  description,
  variables,
  copyable = true,
  displayMode = true,
}: EquationDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple LaTeX to Unicode conversion for display
  const renderLatex = (tex: string) => {
    // This is a simplified renderer - in production, use MathJax or KaTeX
    let rendered = tex;

    // Greek letters
    const greekLetters: Record<string, string> = {
      '\\alpha': 'α',
      '\\beta': 'β',
      '\\gamma': 'γ',
      '\\delta': 'δ',
      '\\epsilon': 'ε',
      '\\theta': 'θ',
      '\\lambda': 'λ',
      '\\mu': 'μ',
      '\\pi': 'π',
      '\\rho': 'ρ',
      '\\sigma': 'σ',
      '\\tau': 'τ',
      '\\omega': 'ω',
      '\\Omega': 'Ω',
      '\\Delta': 'Δ',
      '\\Sigma': 'Σ',
    };

    Object.entries(greekLetters).forEach(([tex, unicode]) => {
      rendered = rendered.replace(new RegExp(tex, 'g'), unicode);
    });

    // Superscripts and subscripts (simplified)
    rendered = rendered.replace(/\^{([^}]+)}/g, '^($1)');
    rendered = rendered.replace(/_({[^}]+}|[^}])/g, '_($1)');

    // Common symbols
    rendered = rendered.replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)');
    rendered = rendered.replace(/\\sqrt{([^}]+)}/g, '√($1)');
    rendered = rendered.replace(/\\cdot/g, '·');
    rendered = rendered.replace(/\\times/g, '×');
    rendered = rendered.replace(/\\div/g, '÷');
    rendered = rendered.replace(/\\pm/g, '±');
    rendered = rendered.replace(/\\approx/g, '≈');
    rendered = rendered.replace(/\\leq/g, '≤');
    rendered = rendered.replace(/\\geq/g, '≥');
    rendered = rendered.replace(/\\neq/g, '≠');
    rendered = rendered.replace(/\\infty/g, '∞');
    rendered = rendered.replace(/\\sum/g, '∑');
    rendered = rendered.replace(/\\int/g, '∫');
    rendered = rendered.replace(/\\partial/g, '∂');
    rendered = rendered.replace(/\\nabla/g, '∇');

    return rendered;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00F0FF]/10">
        <h3 className="text-sm font-bold text-[#00F0FF] font-mono">{title}</h3>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-2 text-secondary-foreground hover:text-[#00F0FF] transition-colors"
            title="Copy LaTeX"
          >
            <Copy size={14} />
          </button>
        )}
      </div>

      {/* Equation */}
      <div className="p-6 bg-[#0B0E14]/30">
        <div className="font-mono text-center mb-4">
          {displayMode ? (
            <div className="text-lg text-[#00F0FF] leading-relaxed">
              {renderLatex(latex)}
            </div>
          ) : (
            <div className="text-sm text-[#00F0FF] leading-relaxed inline-block">
              {renderLatex(latex)}
            </div>
          )}
        </div>

        {/* LaTeX Source */}
        <div className="bg-[#131924] p-3 rounded border border-[#00F0FF]/10 mb-4">
          <div className="text-xs font-mono text-secondary-foreground mb-1">LaTeX:</div>
          <code className="text-xs font-mono text-[#00F0FF] break-all">{latex}</code>
        </div>

        {/* Description */}
        {description && (
          <div className="mb-4 p-3 bg-[#131924] rounded border border-[#FF007A]/10">
            <div className="text-xs font-mono text-secondary-foreground mb-1">DESCRIPTION:</div>
            <p className="text-xs text-secondary-foreground leading-relaxed">{description}</p>
          </div>
        )}

        {/* Variables */}
        {variables && Object.keys(variables).length > 0 && (
          <div className="p-3 bg-[#131924] rounded border border-[#F59E0B]/10">
            <div className="text-xs font-mono text-secondary-foreground mb-2">VARIABLES:</div>
            <div className="space-y-1">
              {Object.entries(variables).map(([variable, definition]) => (
                <div key={variable} className="flex justify-between text-xs font-mono">
                  <span className="text-[#F59E0B]">{variable}</span>
                  <span className="text-secondary-foreground">{definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy Status */}
      {copied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-4 py-2 bg-[#10B981]/10 border-t border-[#10B981]/20 text-xs font-mono text-[#10B981]"
        >
          LaTeX copied to clipboard
        </motion.div>
      )}
    </motion.div>
  );
}
