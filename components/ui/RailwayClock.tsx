'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RailwayClockProps {
  className?: string;
  showSeconds?: boolean;
  compact?: boolean;
}

export function RailwayClock({ className, showSeconds = true, compact = false }: RailwayClockProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format time in IST (Asia/Kolkata)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      if (showSeconds) {
        options.second = '2-digit';
      }

      const timeFormatted = new Intl.DateTimeFormat('en-IN', options).format(now);
      const dateFormatted = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(now);

      setTimeStr(timeFormatted);
      setDateStr(dateFormatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [showSeconds]);

  if (!timeStr) {
    return <div className={cn('h-8 w-28 animate-pulse rounded-xl bg-slate-200/50 dark:bg-slate-800/50', className)} />;
  }

  if (compact) {
    return (
      <div className={cn('inline-flex items-center gap-1.5 rounded-xl bg-slate-900/90 text-white dark:bg-slate-800 px-3 py-1 font-mono text-xs font-bold border border-slate-700/50 shadow-sm', className)}>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <Clock className="h-3.5 w-3.5 text-rose-400" />
        <span>{timeStr} IST</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'glass-panel inline-flex items-center gap-2.5 rounded-2xl px-3.5 py-1.5 border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-background to-background shadow-glass',
        className
      )}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow flex-shrink-0">
        <Clock className="h-4 w-4" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span>{timeStr}</span>
          <span className="text-[10px] font-bold text-rail-blue tracking-wider">IST</span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
          {dateStr} · Railway Standard Time
        </span>
      </div>
    </div>
  );
}
