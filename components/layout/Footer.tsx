'use client';

import React from 'react';
import Link from 'next/link';
import { Train, Code2, Heart, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import { useLanguageStore } from '@/store/language';

export function Footer() {
  const { language } = useLanguageStore();
  const isHi = language === 'hi';

  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-950/50 backdrop-blur-md mt-auto py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rail-blue text-white shadow-glow flex-shrink-0">
              <Train className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Rail<span className="text-rail-blue">Sathi</span>
                </span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rail-blue border border-rose-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isHi
                  ? 'भारतीय रेलवे के लिए स्मार्ट लाइव ट्रैकिंग व यात्रा बुद्धिमत्ता'
                  : 'Next-gen real-time Indian Railways tracking & travel intelligence'}
              </p>
            </div>
          </div>

          {/* Developer Credit Card */}
          <div className="glass-panel relative overflow-hidden rounded-2xl p-4 border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-background to-background shadow-glass max-w-md w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-glow flex-shrink-0">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {isHi ? 'द्वारा विकसित:' : 'Developed by:'}
                  </span>
                  <span className="font-extrabold text-sm text-rail-blue tracking-wide">
                    Team JARVIS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <GraduationCap className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                  <span>5th Sem · CGIT Raipur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <strong className="text-slate-800 dark:text-slate-200 font-bold">Team JARVIS</strong>
            <span>(5th Sem, CGIT Raipur)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-rail-blue" />
              CGIT Raipur
            </span>
            <span>·</span>
            <span>Real-time RailRadar telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
