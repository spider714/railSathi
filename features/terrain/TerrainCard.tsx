import React from 'react';
import { TerrainFeature } from '@/lib/overpass';
import { cn } from '@/utils/cn';

interface TerrainCardProps {
  feature: TerrainFeature;
}

const TYPE_CONFIG = {
  bridge: { emoji: '🌉', label: 'Bridge', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  tunnel: { emoji: '🚇', label: 'Tunnel', color: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300' },
  river: { emoji: '🌊', label: 'River', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  mountain: { emoji: '⛰️', label: 'Peak', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
  tourist: { emoji: '🏛️', label: 'Attraction', color: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
  city: { emoji: '🏙️', label: 'City', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
};

export function TerrainCard({ feature }: TerrainCardProps) {
  const cfg = TYPE_CONFIG[feature.type] || TYPE_CONFIG.tourist;

  return (
    <div className="glass-panel flex-shrink-0 w-52 rounded-2xl p-4 space-y-2 border shadow-glass transition-all hover:-translate-y-0.5 hover:shadow-glass-hover">
      <div className="flex items-center justify-between">
        <div className="text-2xl">{cfg.emoji}</div>
        <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', cfg.color)}>
          {cfg.label}
        </span>
      </div>
      <div>
        <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
          {feature.name}
        </p>
        {feature.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-snug font-normal">
            {feature.description}
          </p>
        )}
        {feature.distanceKm !== undefined && (
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
            ~{feature.distanceKm} km from origin
          </p>
        )}
      </div>
    </div>
  );
}
