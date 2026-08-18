import React from 'react';

export type FeatureStatus = 'available' | 'beta' | 'experimental' | 'coming-soon' | 'prototype';

interface FeatureStatusBadgeProps {
  status: FeatureStatus;
  className?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<FeatureStatus, { label: string; classes: string }> = {
  available: {
    label: 'Available',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  beta: {
    label: 'Beta',
    classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  experimental: {
    label: 'Experimental',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  'coming-soon': {
    label: 'Coming Soon',
    classes: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  prototype: {
    label: 'Prototype',
    classes: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  },
};

export default function FeatureStatusBadge({
  status,
  className = '',
  size = 'sm',
}: FeatureStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded border ${config.classes} ${sizeClasses} ${className}`}
    >
      {config.label}
    </span>
  );
}
