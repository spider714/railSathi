'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Check, MapPin, Compass, CloudSun, Mountain, AlertCircle, Sparkles } from 'lucide-react';
import { useLiveJourney } from '@/hooks/useLiveJourney';
import { JourneyCard } from '@/components/journey/JourneyCard';
import { Timeline } from '@/components/journey/Timeline';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { WeatherPanel } from '@/features/weather/WeatherPanel';
import { AnalyticsDashboard } from '@/features/analytics/AnalyticsDashboard';
import { TerrainPanel } from '@/features/terrain/TerrainPanel';
import { PointsOfInterestPanel } from '@/features/poi/PointsOfInterestPanel';
import { AiAssistantPanel } from '@/features/ai/AiAssistantPanel';
import { AiSmartAdvisoryBanner } from '@/features/ai/AiSmartAdvisoryBanner';
import { MobileJourneySummary } from '@/components/layout/MobileJourneySummary';
import { FavoriteButton } from '@/features/favorites/FavoriteButton';
import { useLanguageStore } from '@/store/language';
import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/features/maps/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] w-full items-center justify-center rounded-3xl bg-slate-900/30">
      <Skeleton className="h-full w-full rounded-3xl" />
    </div>
  ),
});

const TABS = [
  { id: 'map', label: 'Live Map', icon: MapPin },
  { id: 'poi', label: 'Points of Interest', icon: Compass },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'analytics', label: 'Terrain & Analytics', icon: Mountain },
  { id: 'ai', label: 'AI Companion', icon: Sparkles },
] as const;

type TabId = typeof TABS[number]['id'];

const STATUS_CONFIG: Record<string, { label: string; labelHi: string; color: string; dot: string }> = {
  running: {
    label: 'Running',
    labelHi: 'चल रही है',
    color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400',
    dot: 'bg-emerald-500 animate-pulse',
  },
  not_started: {
    label: 'Not Started',
    labelHi: 'प्रारंभ नहीं हुई',
    color: 'bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  completed: {
    label: 'Journey Complete',
    labelHi: 'यात्रा पूर्ण',
    color: 'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  cancelled: {
    label: 'Cancelled',
    labelHi: 'रद्द',
    color: 'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

export default function TrainJourneyPage({ params }: { params: { id: string } }) {
  const trainId = params.id;
  const { data: journey, isLoading, isError, error, refetch, isRefetching } = useLiveJourney(trainId);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('map');
  const { language } = useLanguageStore();

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    if (typeof navigator.share === 'function') {
      navigator
        .share({ title: `RailSathi – ${journey?.name || `Train #${trainId}`}`, url: shareUrl })
        .catch(() => {
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 py-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-12 w-80 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-7 h-[480px] rounded-3xl" />
          <Skeleton className="lg:col-span-5 h-[480px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !journey) {
    const errMsg = (error as Error)?.message || '';
    const isQuotaError = errMsg.includes('QUOTA_EXCEEDED') || errMsg.includes('TOO_MANY_REQUESTS') || errMsg.includes('Daily quota');
    const is404 = errMsg.includes('404') || errMsg.includes('not found');

    return (
      <div className="py-12 max-w-xl mx-auto space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-rail-blue transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </Link>

        {isQuotaError ? (
          <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-amber-500/20">
            <div className="text-4xl">⏳</div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">API Quota Reached</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              The RailRadar free tier allows <strong>50 requests/day</strong>. Today's quota has been exhausted.
              Live tracking will resume tomorrow, or you can upgrade your RailRadar plan.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://railradar.in/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-4 py-2 text-xs font-semibold text-white shadow-glow hover:bg-rose-600 transition-colors"
              >
                Upgrade API Plan
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Back to Search
              </Link>
            </div>
          </div>
        ) : (
          <ErrorCard
            title={is404 ? 'Train Not Found' : 'Live Data Unavailable'}
            message={
              is404
                ? `Train #${trainId} not found. Please check the train number.`
                : `Could not load live data for train #${trainId}. The train may not be running today or the service is temporarily unavailable.`
            }
            onRetry={() => refetch()}
          />
        )}
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[journey.status] || STATUS_CONFIG.running;

  // Build a lean SearchResult-compatible object for FavoriteButton
  const trainForFavorite = {
    id: journey.trainId,
    number: journey.number,
    name: journey.name,
    origin: journey.origin,
    destination: journey.destination,
  };

  return (
    <div className="space-y-5 pt-2 sm:pt-4 pb-6">
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold', statusCfg.color)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg.dot)} />
            {language === 'hi' ? statusCfg.labelHi : statusCfg.label}
          </span>

          {/* Favorite */}
          <FavoriteButton train={trainForFavorite} />

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-rail-blue px-3.5 py-2 text-xs font-semibold text-white shadow-glow transition-all hover:bg-rose-600 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {copied
                ? language === 'hi'
                  ? 'कॉपी हुआ!'
                  : 'Copied!'
                : language === 'hi'
                ? 'शेयर करें'
                : 'Share'}
            </span>
          </button>
        </div>
      </div>

      {/* ─── Mobile Journey Summary ─── */}
      <MobileJourneySummary journey={journey} />

      {/* ─── Hero Journey Card (desktop) ─── */}
      <div className="hidden md:block">
        <JourneyCard journey={journey} onRefresh={() => refetch()} isRefreshing={isRefetching} />
      </div>

      {/* ─── Gemini AI Live Weather & Height/Elevation Advisory ─── */}
      <AiSmartAdvisoryBanner journey={journey} />

      {/* ─── Not-Started / Cancelled Banner ─── */}
      {(journey.status === 'not_started' || journey.status === 'cancelled') && (
        <div className="glass-panel flex items-center gap-3 rounded-2xl p-4 border border-amber-500/20">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {journey.status === 'not_started'
              ? language === 'hi'
                ? `ट्रेन #${journey.number} अभी प्रस्थान नहीं हुई है। यात्रा शुरू होते ही लाइव ट्रैकिंग सक्रिय हो जाएगी (निर्धारित प्रस्थान: ${journey.stations[0]?.scheduledDeparture || 'समय-सारणी देखें'})।`
                : `Train #${journey.number} hasn't departed yet. Live tracking activates once the journey begins (scheduled departure: ${journey.stations[0]?.scheduledDeparture || 'check timetable'}).`
              : language === 'hi'
              ? `ट्रेन #${journey.number} को रद्द कर दिया गया है। कृपया वैकल्पिक व्यवस्था के लिए NTES देखें।`
              : `Train #${journey.number} has been cancelled. Please check NTES for alternate arrangements.`}
          </p>
        </div>
      )}

      {/* ─── Tab Selector ─── */}
      <div className="flex items-center gap-1.5 rounded-2xl glass-panel p-1.5 shadow-glass w-full max-w-full overflow-x-auto no-scrollbar flex-nowrap">
        {TABS.map(({ id, label, icon: Icon }) => {
          const tabName =
            language === 'hi'
              ? id === 'map'
                ? 'लाइव मानचित्र'
                : id === 'poi'
                ? 'दर्शनीय स्थल (POI)'
                : id === 'weather'
                ? 'मौसम'
                : id === 'analytics'
                ? 'भूभाग व विश्लेषण'
                : 'AI साथी'
              : label;

          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3.5 sm:px-4 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0',
                activeTab === id
                  ? 'bg-rail-blue text-white shadow-glow'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tabName}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Main Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active feature panel */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {activeTab === 'map' && <MapView journey={journey} className="h-[480px] w-full" />}
          {activeTab === 'poi' && (
            <PointsOfInterestPanel
              journey={journey}
              onAskAi={(prompt) => {
                setActiveTab('ai');
              }}
            />
          )}
          {activeTab === 'weather' && <WeatherPanel journey={journey} />}
          {activeTab === 'analytics' && (
            <>
              <AnalyticsDashboard journey={journey} />
              <TerrainPanel trainId={journey.trainId} />
            </>
          )}
          {activeTab === 'ai' && <AiAssistantPanel journey={journey} />}
        </div>

        {/* Route Timeline */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Timeline
            stations={journey.stations}
            currentStationCode={journey.currentStation?.code}
          />
        </div>
      </div>
    </div>
  );
}
