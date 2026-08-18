import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';
import { DataFormatter } from '@/services/dataFormatting';

interface DataPanelProps {
  title: string;
  data: Record<string, any>;
  format?: 'scientific' | 'table' | 'json' | 'raw';
  precision?: number;
  copyable?: boolean;
  downloadable?: boolean;
  collapsible?: boolean;
}

export default function ProfessionalDataPanel({
  title,
  data,
  format = 'table',
  precision = 3,
  copyable = true,
  downloadable = true,
  collapsible = true,
}: DataPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = JSON.stringify(data, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toString();
      return DataFormatter.scientific(value, precision);
    }
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (value === null) return 'NULL';
    if (value === undefined) return 'UNDEFINED';
    return String(value);
  };

  const renderContent = () => {
    switch (format) {
      case 'scientific':
        return (
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-xs font-mono">
                <span className="text-secondary-foreground">{key}:</span>
                <span className="text-[#00F0FF]">{formatValue(value)}</span>
              </div>
            ))}
          </div>
        );
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#00F0FF]/20">
                  <th className="text-left py-2 px-3 text-secondary-foreground">Parameter</th>
                  <th className="text-right py-2 px-3 text-secondary-foreground">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([key, value], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-[#0B0E14]/30' : ''}>
                    <td className="py-2 px-3 text-secondary-foreground">{key}</td>
                    <td className="py-2 px-3 text-right text-[#00F0FF]">{formatValue(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'json':
        return (
          <pre className="bg-[#0B0E14] p-4 rounded border border-[#00F0FF]/10 overflow-x-auto text-xs font-mono text-[#00F0FF]">
            {JSON.stringify(data, null, 2)}
          </pre>
        );
      case 'raw':
      default:
        return (
          <div className="text-xs font-mono text-secondary-foreground whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#131924]/60 backdrop-blur-md border border-[#00F0FF]/20 rounded overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#00F0FF]/10">
        <div className="flex items-center gap-3">
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-secondary-foreground hover:text-[#00F0FF] transition-colors"
            >
              {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          <h3 className="text-sm font-bold text-[#00F0FF] font-mono">{title}</h3>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-2 text-secondary-foreground hover:text-[#00F0FF] transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
          )}
          {downloadable && (
            <button
              onClick={handleDownload}
              className="p-2 text-secondary-foreground hover:text-[#00F0FF] transition-colors"
              title="Download as JSON"
            >
              <Download size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4"
        >
          {renderContent()}
        </motion.div>
      )}

      {/* Status Bar */}
      {copied && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-4 py-2 bg-[#10B981]/10 border-t border-[#10B981]/20 text-xs font-mono text-[#10B981]"
        >
          Copied to clipboard
        </motion.div>
      )}
    </motion.div>
  );
}
