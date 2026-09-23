'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CloudSun, Mountain, AlertCircle, RefreshCw, Loader2, ArrowUpRight } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { useLanguageStore } from '@/store/language';

interface AiSmartAdvisoryBannerProps {
  journey: LiveJourney;
}

export function AiSmartAdvisoryBanner({ journey }: AiSmartAdvisoryBannerProps) {
  const { language } = useLanguageStore();
  const isHi = language === 'hi';

  const [advisoryText, setAdvisoryText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchAiAdvisory = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const prompt = `Based on real-time weather and elevation data for train #${journey.number} (${journey.name}), generate 3 short, helpful travel advisories for the passenger: 1 for clothing/hydration based on live temperature & weather, 1 for altitude/scenic mountain pass based on elevation, and 1 for food/station tips. Format cleanly with bullet points and emojis.`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          trainId: journey.number || journey.trainId,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.answer) {
        setAdvisoryText(data.data.answer);
      } else {
        throw new Error(data.error || 'Failed to fetch advisory');
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiAdvisory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey.trainId, journey.number, language]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-rose-600/15 p-5 md:p-6 border border-rose-500/30 shadow-glass">
      {/* Decorative gradient glow background */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-rail-blue/20 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rail-blue text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              {isHi ? 'Gemini AI लाइव मौसम व ऊंचाई सलाह' : 'Gemini AI Live Weather & Altitude Advisory'}
              <span className="rounded-full bg-rose-500/20 text-rail-blue text-[10px] font-bold px-2 py-0.5 border border-rose-500/30">
                {isHi ? 'लाइव स्थिति' : 'Real-Time Telemetry'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isHi
                ? 'OpenWeather मौसम व OpenTopography ऊंचाई डेटा द्वारा जनरेटेड'
                : 'Generated from live OpenWeather & OpenTopography SRTM altitude data'}
            </p>
          </div>
        </div>

        <button
          onClick={fetchAiAdvisory}
          disabled={isLoading}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-rail-blue hover:text-white transition-all disabled:opacity-50"
          title={isHi ? 'सलाह ताज़ा करें' : 'Refresh AI Advisory'}
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isLoading ? 'animate-spin' : '')} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 py-6 text-xs text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-rail-blue" />
          <span>{isHi ? 'Gemini AI लाइव मौसम, तापमान व ऊंचाई प्रोफ़ाइल का विश्लेषण कर रहा है...' : 'Gemini AI is analyzing live weather, atmospheric temperature & elevation profile...'}</span>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 py-3 text-xs text-rose-500">
          <AlertCircle className="h-4 w-4" />
          <span>{isHi ? 'सलाह प्राप्त नहीं हो सकी। पुनः प्रयास करें।' : 'Could not fetch Gemini AI advisory right now. Please try again.'}</span>
        </div>
      ) : (
        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-sans whitespace-pre-wrap">
          {advisoryText}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
