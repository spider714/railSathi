'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Radio, ChevronDown, ChevronUp, Search, MapPin, Layers } from 'lucide-react';
import { Station } from '@/types/train';
import { formatDelay } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useLanguageStore } from '@/store/language';

interface TimelineProps {
  stations: Station[];
  currentStationCode?: string;
  className?: string;
}

export function Timeline({ stations, currentStationCode, className }: TimelineProps) {
  const { language } = useLanguageStore();
  const isHi = language === 'hi';

  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find index of current live station
  const currentIdx = useMemo(() => {
    const idx = stations.findIndex((s) => s.status === 'current' || s.code === currentStationCode);
    if (idx !== -1) return idx;
    const passedLast = stations.map((s, i) => ({ s, i })).filter(({ s }) => s.status === 'passed').pop();
    return passedLast ? Math.min(passedLast.i + 1, stations.length - 1) : 0;
  }, [stations, currentStationCode]);

  // Filter stations based on search query or collapse logic
  const filteredStations = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return stations.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    }
    return stations;
  }, [stations, searchQuery]);

  // Determine indices to show in collapsed mode
  const collapsedIndices = useMemo(() => {
    if (stations.length <= 6 || isExpanded || searchQuery.trim()) {
      return new Set(stations.map((_, i) => i));
    }

    const indices = new Set<number>();
    indices.add(0); // Origin station
    if (currentIdx > 1) indices.add(currentIdx - 1); // Previous station
    indices.add(currentIdx); // Current station
    if (currentIdx + 1 < stations.length) indices.add(currentIdx + 1); // Next halt
    if (currentIdx + 2 < stations.length - 1) indices.add(currentIdx + 2); // 2nd upcoming halt
    indices.add(stations.length - 1); // Destination station

    return indices;
  }, [stations, currentIdx, isExpanded, searchQuery]);

  const hiddenCount = stations.length - collapsedIndices.size;

  return (
    <div className={cn('glass-panel rounded-3xl p-5 shadow-glass space-y-4', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rail-blue" />
            <span>{isHi ? 'स्टेशन मार्ग समय-सारणी' : 'Station Route Timeline'}</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {isHi
              ? `कुल ${stations.length} स्टेशन • ${hiddenCount > 0 && !isExpanded ? `${hiddenCount} छिपे हैं` : 'पूरा मार्ग'}`
              : `${stations.length} Total Halts • ${hiddenCount > 0 && !isExpanded ? `${hiddenCount} Compacted` : 'Full Route'}`}
          </p>
        </div>

        {/* Quick Station Filter */}
        {stations.length > 5 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'स्टेशन खोजें...' : 'Search station...'}
              className="w-full sm:w-36 rounded-xl bg-slate-100 dark:bg-slate-900/80 pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-rail-blue"
            />
          </div>
        )}
      </div>

      {/* Timeline List */}
      <div className={cn('relative pl-6 before:absolute before:bottom-3 before:left-3 before:top-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800', isExpanded && 'max-h-[520px] overflow-y-auto pr-2')}>
        <div className="space-y-5">
          {stations.map((st, idx) => {
            const isVisible = collapsedIndices.has(idx) || searchQuery.trim() !== '';

            // If hidden in collapsed view, check if we should render a gap collapse indicator
            if (!isVisible) {
              const isFirstHiddenInGap = idx > 0 && collapsedIndices.has(idx - 1) === false && collapsedIndices.has(idx - 2) === true;
              if (idx === 1 || isFirstHiddenInGap) {
                // Compute how many stations in this gap
                let gapSize = 0;
                for (let k = idx; k < stations.length; k++) {
                  if (!collapsedIndices.has(k)) gapSize++;
                  else break;
                }

                return (
                  <button
                    key={`gap-${idx}`}
                    onClick={() => setIsExpanded(true)}
                    className="relative flex items-center gap-3 w-full py-2 my-1 text-left group"
                  >
                    <div className="absolute -left-6 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-background text-slate-400 group-hover:border-rail-blue group-hover:text-rail-blue transition-colors">
                      <Layers className="h-3 w-3" />
                    </div>
                    <div className="flex-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 group-hover:border-rail-blue group-hover:text-rail-blue transition-all flex items-center justify-between">
                      <span className="font-semibold">
                        {isHi
                          ? `+ ${gapSize} intermediate स्टेशन छिपे हैं`
                          : `+ ${gapSize} intermediate stations collapsed`}
                      </span>
                      <span className="text-[10px] font-bold text-rail-blue underline">
                        {isHi ? 'मार्ग देखें' : 'Expand Route'}
                      </span>
                    </div>
                  </button>
                );
              }
              return null;
            }

            const isPassed = st.status === 'passed';
            const isCurrent = st.status === 'current' || st.code === currentStationCode || idx === currentIdx;
            const isUpcoming = st.status === 'upcoming';
            const delayInfo = formatDelay(st.delayMinutes);

            return (
              <div key={st.code + idx} className="relative flex items-start justify-between gap-3">
                {/* Timeline Dot Marker */}
                <div className="absolute -left-6 top-0.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-background">
                  {isPassed && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                  )}
                  {isCurrent && (
                    <div className="relative flex items-center justify-center">
                      <Radio className="h-5 w-5 text-rail-blue animate-pulse" />
                      <span className="absolute h-8 w-8 rounded-full bg-rail-blue/20 animate-ping" />
                    </div>
                  )}
                  {isUpcoming && (
                    <Circle className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                  )}
                </div>

                {/* Station Info */}
                <div className="flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={cn(
                        'font-bold',
                        isCurrent
                          ? 'text-rail-blue text-base'
                          : isPassed
                          ? 'text-slate-800 dark:text-slate-200 text-sm'
                          : 'text-slate-500 dark:text-slate-400 text-sm'
                      )}
                    >
                      {st.name} ({st.code})
                    </h4>

                    {isCurrent && (
                      <span className="rounded-md bg-rail-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-blue">
                        {isHi ? 'लाइव स्थान' : 'LIVE LOCATION'}
                      </span>
                    )}

                    {st.platform && (
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        PF {st.platform}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{st.distanceKm} km</span>
                    {st.haltMinutes && <span>Halt: {st.haltMinutes}m</span>}
                  </div>
                </div>

                {/* Schedule vs Actual Timing */}
                <div className="text-right font-mono text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {st.actualArrival || st.scheduledArrival}
                  </div>
                  {st.delayMinutes > 0 ? (
                    <div className={cn('text-[11px] font-bold', delayInfo.color)}>
                      +{st.delayMinutes}m {isHi ? 'देरी' : 'delay'}
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isHi ? 'समय पर' : 'On Time'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expand / Collapse Button */}
      {stations.length > 6 && !searchQuery && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-rail-blue hover:text-white transition-all shadow-sm mt-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>{isHi ? 'मार्ग को छोटा करें' : 'Collapse Route Timeline'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>
                {isHi
                  ? `पूरा मार्ग देखें (${stations.length} स्टेशन)`
                  : `Show Full Route (${stations.length} stations)`}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
