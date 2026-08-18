import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'table' | 'card' | 'chart' | 'text';
  rows?: number;
}

export default function SkeletonLoader({
  variant = 'card',
  rows = 4,
}: SkeletonLoaderProps) {
  if (variant === 'table') {
    return (
      <div className="w-full bg-[#080E1C] border border-white/10 rounded-lg p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3" />
        <div className="space-y-2 pt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 bg-white/5 rounded flex-1" />
              <div className="h-8 bg-white/5 rounded flex-1" />
              <div className="h-8 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="w-full h-64 bg-[#080E1C] border border-white/10 rounded-lg p-4 flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-white/10 rounded w-32" />
          <div className="h-4 bg-white/10 rounded w-16" />
        </div>
        <div className="flex items-end gap-2 h-40 pt-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-cyan-500/20 rounded-t flex-1"
              style={{ height: `${Math.floor(Math.random() * 60) + 30}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#080E1C] border border-white/10 rounded-lg p-5 space-y-3 animate-pulse">
      <div className="h-5 bg-white/10 rounded w-1/2" />
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-4 bg-white/5 rounded w-2/3" />
    </div>
  );
}
