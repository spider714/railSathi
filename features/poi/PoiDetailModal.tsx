'use client';

import React, { useState } from 'react';
import {
  X,
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
  ExternalLink,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { PoiItem } from '@/lib/poi';
import { cn } from '@/utils/cn';

interface PoiDetailModalProps {
  poi: PoiItem | null;
  onClose: () => void;
  onAskAi?: (promptText: string) => void;
}

export function PoiDetailModal({ poi, onClose, onAskAi }: PoiDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!poi) return null;

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = poi.audioGuideText || `${poi.name}. ${poi.description}. ${poi.localFoodSpecialty ? `Famous food specialty: ${poi.localFoodSpecialty}.` : ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel relative w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-2 pr-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rail-blue/10 border border-rail-blue/30 px-3 py-1 text-xs font-bold text-rail-blue">
              <Compass className="h-3.5 w-3.5" />
              <span>Point of Interest</span>
            </span>

            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border',
                poi.status === 'current'
                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40 dark:text-emerald-300'
                  : poi.status === 'passed'
                  ? 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400'
                  : 'bg-rose-500/15 text-rail-blue border-rose-500/30 dark:text-rose-300'
              )}
            >
              {poi.status === 'current' ? 'At Current Location' : poi.status === 'passed' ? 'Passed' : 'Upcoming'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {poi.name}
          </h2>

          {poi.nearestStationName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rail-blue" />
              Nearest Station: <strong>{poi.nearestStationName} ({poi.nearestStationCode})</strong>
            </p>
          )}
        </div>

        {/* Window View Recommendation & Audio Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {poi.windowSide && (
            <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rail-blue">
              <Eye className="h-5 w-5 flex-shrink-0" />
              <div>
                <span className="font-bold block">Best Window View:</span>
                <span className="font-semibold">{poi.windowSide} of Train</span>
              </div>
            </div>
          )}

          {/* Audio Guide Button */}
          <button
            onClick={handleSpeak}
            className={cn(
              'flex items-center justify-center gap-2 rounded-2xl p-3 text-xs font-bold transition-all shadow-glow',
              isPlaying
                ? 'bg-rose-500 text-white'
                : 'bg-rail-blue text-white hover:bg-rose-600'
            )}
          >
            {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause Audio Guide' : 'Listen Audio Guide 🔊'}</span>
          </button>
        </div>

        {/* Description & History */}
        <div className="space-y-2 glass-panel p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About & Heritage Highlight</h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
            {poi.description}
          </p>
          {poi.famousFor && (
            <div className="pt-2 text-xs font-semibold text-rail-blue flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Famous For: {poi.famousFor}</span>
            </div>
          )}
        </div>

        {/* Local Food Specialty Section */}
        {poi.localFoodSpecialty && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              <Utensils className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Station & Local Culinary Specialty</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-amber-200 font-semibold">
              {poi.localFoodSpecialty}
            </p>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
              💡 Tip: Look out for station platform vendors or order via e-catering when approaching this station.
            </p>
          </div>
        )}

        {/* Distance Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="glass-panel p-3 rounded-2xl text-center space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold block">Route Origin Distance</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">{poi.distanceKm} km</span>
          </div>

          <div className="glass-panel p-3 rounded-2xl text-center space-y-0.5">
            <span className="text-[10px] text-slate-400 font-semibold block">Position from Train</span>
            <span className="text-sm font-extrabold text-rail-blue">
              {poi.status === 'upcoming'
                ? `${poi.distanceFromTrainKm} km away`
                : poi.status === 'current'
                ? 'At Location'
                : 'Already Passed'}
            </span>
          </div>
        </div>

        {/* Action button to ask AI Companion */}
        {onAskAi && (
          <button
            onClick={() => {
              onClose();
              onAskAi(`Tell me more interesting historical facts and travel tips for ${poi.name} near ${poi.nearestStationName || 'this route'}.`);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 p-3 text-xs font-bold text-white shadow-glow hover:opacity-95 transition-opacity"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask RailSathi AI Companion about {poi.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}
