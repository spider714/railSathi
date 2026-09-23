'use client';

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Utensils,
  Landmark,
  Waves,
  Mountain,
  Volume2,
  VolumeX,
  Eye,
  Clock,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { PoiItem } from '@/lib/poi';
import { cn } from '@/utils/cn';

interface PoiCardProps {
  poi: PoiItem;
  onSelect: (poi: PoiItem) => void;
}

const CATEGORY_CONFIG: Record<
  PoiItem['category'],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badgeBg: string }
> = {
  heritage: {
    label: 'Heritage & Monument',
    icon: Landmark,
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
  },
  food: {
    label: 'Local Food & Delicacy',
    icon: Utensils,
    color: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
  },
  river_bridge: {
    label: 'River & Rail Bridge',
    icon: Waves,
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
  },
  nature: {
    label: 'Nature & Scenery',
    icon: Mountain,
    color: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  },
  sacred: {
    label: 'Sacred & Spiritual',
    icon: Sparkles,
    color: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
  },
  station: {
    label: 'Station & Junction',
    icon: MapPin,
    color: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300',
  },
};

export function PoiCard({ poi, onSelect }: PoiCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cfg = CATEGORY_CONFIG[poi.category] || CATEGORY_CONFIG.heritage;
  const CategoryIcon = cfg.icon;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const textToSpeak = poi.audioGuideText || `${poi.name}. ${poi.description}. ${poi.localFoodSpecialty ? `Famous food: ${poi.localFoodSpecialty}.` : ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      onClick={() => onSelect(poi)}
      className="glass-panel group relative flex flex-col justify-between rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-hover hover:border-rail-blue/40 cursor-pointer overflow-hidden"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-rail-blue/5 blur-2xl group-hover:bg-rail-blue/15 transition-all duration-500" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold', cfg.badgeBg)}>
            <CategoryIcon className="h-3.5 w-3.5" />
            <span>{cfg.label}</span>
          </span>

          {/* Status Badge */}
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border',
              poi.status === 'current'
                ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40 animate-pulse dark:text-emerald-300'
                : poi.status === 'passed'
                ? 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400'
                : 'bg-rose-500/15 text-rail-blue border-rose-500/30 dark:text-rose-300'
            )}
          >
            {poi.status === 'current' ? 'At Current Location' : poi.status === 'passed' ? 'Passed' : 'Upcoming'}
          </span>
        </div>

        {/* POI Name & Location */}
        <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-rail-blue transition-colors line-clamp-1">
          {poi.name}
        </h4>

        {poi.nearestStationName && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-rail-blue" />
            <span>Near {poi.nearestStationName} ({poi.nearestStationCode})</span>
          </div>
        )}

        {/* Description */}
        <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-sans">
          {poi.description}
        </p>

        {/* Local Food Specialty Highlight if available */}
        {poi.localFoodSpecialty && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Utensils className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="truncate">Specialty: {poi.localFoodSpecialty}</span>
          </div>
        )}
      </div>

      {/* Footer Info & Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {/* Distance from train */}
          {poi.status === 'upcoming' && poi.distanceFromTrainKm !== undefined && (
            <span className="inline-flex items-center gap-1 font-semibold text-rail-blue">
              <Clock className="h-3.5 w-3.5" />
              <span>{poi.distanceFromTrainKm} km away (~{poi.estimatedMinutesAway}m)</span>
            </span>
          )}

          {poi.status === 'passed' && (
            <span className="font-medium text-slate-400">
              {poi.distanceKm} km from origin
            </span>
          )}

          {/* Window Direction */}
          {poi.windowSide && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <Eye className="h-3 w-3 text-slate-400" />
              {poi.windowSide}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Audio Speech Button */}
          <button
            onClick={handleSpeak}
            title={isPlaying ? 'Stop Audio Guide' : 'Listen to Audio Guide'}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-all shadow-sm',
              isPlaying
                ? 'bg-rose-500 text-white animate-pulse shadow-glow'
                : 'bg-slate-100 hover:bg-rail-blue hover:text-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            )}
          >
            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* View details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(poi);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rail-blue/10 text-rail-blue group-hover:bg-rail-blue group-hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
