'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  Utensils,
  Landmark,
  Waves,
  Mountain,
  Sparkles,
  Loader2,
  Volume2,
  VolumeX,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { PoiItem, getJourneyPois } from '@/lib/poi';
import { PoiCard } from './PoiCard';
import { PoiDetailModal } from './PoiDetailModal';
import { useLanguageStore } from '@/store/language';
import { cn } from '@/utils/cn';

interface PointsOfInterestPanelProps {
  journey: LiveJourney;
  onAskAi?: (promptText: string) => void;
}

type CategoryFilter = 'all' | 'heritage' | 'food' | 'river_bridge' | 'nature' | 'sacred' | 'station';
type StatusFilter = 'all' | 'upcoming' | 'passed' | 'current';

export function PointsOfInterestPanel({ journey, onAskAi }: PointsOfInterestPanelProps) {
  const { language } = useLanguageStore();
  const isHi = language === 'hi';

  const categoryTabs = [
    { id: 'all' as CategoryFilter, label: isHi ? 'सभी दर्शनीय स्थल' : 'All POIs', icon: Compass },
    { id: 'heritage' as CategoryFilter, label: isHi ? 'विरासत और स्मारक' : 'Heritage & Monuments', icon: Landmark },
    { id: 'food' as CategoryFilter, label: isHi ? 'स्थानीय भोजन' : 'Local Food & Delicacies', icon: Utensils },
    { id: 'river_bridge' as CategoryFilter, label: isHi ? 'नदियां और पुल' : 'Rivers & Bridges', icon: Waves },
    { id: 'nature' as CategoryFilter, label: isHi ? 'प्रकृति और दृश्य' : 'Nature & Scenery', icon: Mountain },
    { id: 'sacred' as CategoryFilter, label: isHi ? 'धार्मिक स्थल' : 'Sacred & Spiritual', icon: Sparkles },
    { id: 'station' as CategoryFilter, label: isHi ? 'स्टेशन जंक्शन' : 'Station Junctions', icon: MapPin },
  ];

  const [pois, setPois] = useState<PoiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [selectedPoi, setSelectedPoi] = useState<PoiItem | null>(null);
  const [isTourPlaying, setIsTourPlaying] = useState(false);

  useEffect(() => {
    async function loadPois() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/poi?trainId=${journey.number || journey.trainId}`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setPois(json.data);
        } else {
          // Fallback to client-side calculated POIs if API returns empty
          const fallbackPois = getJourneyPois(journey);
          setPois(fallbackPois);
        }
      } catch {
        const fallbackPois = getJourneyPois(journey);
        setPois(fallbackPois);
      } finally {
        setLoading(false);
      }
    }
    loadPois();
  }, [journey]);

  // Filter POIs
  const filteredPois = useMemo(() => {
    return pois.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nearestStationName && item.nearestStationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.localFoodSpecialty && item.localFoodSpecialty.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesStatus = activeStatus === 'all' || item.status === activeStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [pois, searchQuery, activeCategory, activeStatus]);

  // Summary Counts
  const stats = useMemo(() => {
    const total = pois.length;
    const upcoming = pois.filter((p) => p.status === 'upcoming').length;
    const foodCount = pois.filter((p) => p.localFoodSpecialty || p.category === 'food').length;
    const heritageCount = pois.filter((p) => p.category === 'heritage').length;
    return { total, upcoming, foodCount, heritageCount };
  }, [pois]);

  // Global Audio Tour Play/Pause
  const handleToggleGlobalTour = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isTourPlaying) {
      window.speechSynthesis.cancel();
      setIsTourPlaying(false);
      return;
    }

    const upcomingPois = pois.filter((p) => p.status === 'upcoming' || p.status === 'current');
    const targetList = upcomingPois.length > 0 ? upcomingPois : pois;
    if (targetList.length === 0) return;

    const fullScript = `Welcome to the RailSathi audio tour guide for ${journey.name}. There are ${pois.length} points of interest along your journey. ` +
      targetList.slice(0, 5).map((p) => `${p.name} near ${p.nearestStationName || 'the route'}. ${p.description}`).join(' ');

    const utterance = new SpeechSynthesisUtterance(fullScript);
    utterance.rate = 0.95;
    utterance.onend = () => setIsTourPlaying(false);
    utterance.onerror = () => setIsTourPlaying(false);

    setIsTourPlaying(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Title */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rail-blue text-white shadow-glow">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              Points of Interest
              <span className="rounded-full bg-rail-blue/10 border border-rail-blue/30 text-rail-blue text-xs font-bold px-2.5 py-0.5">
                {pois.length} Locations
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Heritage sites, local delicacies, rivers, bridges & scenic window highlights
            </p>
          </div>
        </div>

        {/* Global Audio Tour Button */}
        <button
          onClick={handleToggleGlobalTour}
          className={cn(
            'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all shadow-glow',
            isTourPlaying
              ? 'bg-rose-500 text-white'
              : 'bg-rail-blue text-white hover:bg-rose-600'
          )}
        >
          {isTourPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span>{isTourPlaying ? 'Stop Audio Guide' : 'Audio Tour Guide 🔊'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rail-blue flex items-center justify-center flex-shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total POIs</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">{stats.total}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Upcoming</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{stats.upcoming}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Food Specialties</span>
            <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">{stats.foodCount}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Heritage Sites</span>
            <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">{stats.heritageCount}</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="glass-panel flex-1 w-full flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 border border-slate-200/60 dark:border-slate-800">
          <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search POIs, delicacies (Petha, Sev, Biryani), forts, bridges..."
            className="w-full bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Pill Selector */}
        <div className="flex items-center gap-1 glass-panel p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800 w-full sm:w-auto overflow-x-auto">
          {(['all', 'upcoming', 'current', 'passed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all capitalize whitespace-nowrap',
                activeStatus === st
                  ? 'bg-rail-blue text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              {st === 'all' ? 'All Status' : st === 'current' ? 'Current Stop' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {categoryTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={cn(
              'flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap border',
              activeCategory === id
                ? 'bg-rail-blue text-white border-rail-blue shadow-glow'
                : 'glass-panel text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading && (
        <div className="glass-panel flex items-center justify-center gap-3 rounded-3xl p-12 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-rail-blue" />
          <span>Curating points of interest & heritage attractions along route…</span>
        </div>
      )}

      {!loading && filteredPois.length === 0 && (
        <div className="glass-panel rounded-3xl p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
          <Compass className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-900 dark:text-white text-base">No Points of Interest Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or switching to another category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setActiveStatus('all');
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-4 py-2 text-xs font-bold text-white shadow-glow"
          >
            Reset Filters
          </button>
        </div>
      )}

      {!loading && filteredPois.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPois.map((poi) => (
            <PoiCard key={poi.id} poi={poi} onSelect={(p) => setSelectedPoi(p)} />
          ))}
        </div>
      )}

      {/* POI Detail Modal */}
      <PoiDetailModal
        poi={selectedPoi}
        onClose={() => setSelectedPoi(null)}
        onAskAi={onAskAi}
      />
    </div>
  );
}
