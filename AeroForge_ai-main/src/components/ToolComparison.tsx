import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, ChevronRight } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  category: string;
  features: Record<string, boolean | string>;
  price?: string;
  description?: string;
}

interface ToolComparisonProps {
  tools: Tool[];
  featureKeys: string[];
}

export default function ToolComparison({ tools, featureKeys }: ToolComparisonProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleToolSelection = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev.slice(-1), toolId].slice(-2) // Max 2 tools
    );
  };

  const comparisonTools = tools.filter((t) => selectedTools.includes(t.id));

  return (
    <div className="w-full space-y-6">
      {/* Comparison Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-aerospace-blue/10 to-aerospace-accent/10 border border-aerospace-blue/30 rounded-lg hover:border-aerospace-blue/60 transition-all group"
      >
        <div className="text-left">
          <p className="font-heading text-lg font-bold text-foreground">
            Compare Tools
          </p>
          <p className="font-paragraph text-sm text-foreground/70">
            {selectedTools.length === 0
              ? 'Select up to 2 tools to compare features'
              : `${selectedTools.length} tool${selectedTools.length !== 1 ? 's' : ''} selected`}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 text-aerospace-blue transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Tool Selection */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-primary border border-secondary/30 rounded-lg space-y-4"
        >
          <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
            Select Tools (Max 2)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleToolSelection(tool.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTools.includes(tool.id)
                    ? 'border-aerospace-blue bg-aerospace-blue/10'
                    : 'border-secondary/30 bg-secondary/5 hover:border-secondary/50'
                }`}
              >
                <p className="font-heading font-bold text-foreground">{tool.name}</p>
                <p className="font-mono text-xs text-aerospace-blue mt-1">{tool.category}</p>
                {tool.description && (
                  <p className="font-paragraph text-sm text-foreground/70 mt-2 line-clamp-2">
                    {tool.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Comparison Table */}
      {comparisonTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-secondary/30">
                <th className="text-left py-4 px-4 font-heading font-bold text-foreground">
                  Features
                </th>
                {comparisonTools.map((tool) => (
                  <th
                    key={tool.id}
                    className="text-center py-4 px-4 font-heading font-bold text-foreground min-w-[200px]"
                  >
                    <div className="flex items-center justify-between">
                      <span>{tool.name}</span>
                      <button
                        onClick={() => toggleToolSelection(tool.id)}
                        className="ml-2 p-1 hover:bg-secondary/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-foreground/60" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((feature, idx) => (
                <tr
                  key={feature}
                  className={`border-b border-secondary/20 ${
                    idx % 2 === 0 ? 'bg-secondary/5' : ''
                  }`}
                >
                  <td className="py-4 px-4 font-paragraph text-sm text-foreground/80">
                    {feature}
                  </td>
                  {comparisonTools.map((tool) => {
                    const value = tool.features[feature];
                    return (
                      <td
                        key={`${tool.id}-${feature}`}
                        className="text-center py-4 px-4"
                      >
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 text-aerospace-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-aerospace-danger mx-auto opacity-30" />
                          )
                        ) : (
                          <span className="font-mono text-sm text-foreground/80">
                            {value}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
