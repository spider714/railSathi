'use client';

import React, { useEffect, useState } from 'react';
import { CloudSun } from 'lucide-react';
import { LiveJourney } from '@/types/train';
import { WeatherCard } from './WeatherCard';
import { WeatherData } from '@/lib/openweather';
import { useLanguageStore } from '@/store/language';

interface WeatherPanelProps {
  journey: LiveJourney;
}

export function WeatherPanel({ journey }: WeatherPanelProps) {
  const { language } = useLanguageStore();
  const isHi = language === 'hi';

  const [weatherData, setWeatherData] = useState<{
    current?: WeatherData;
    next?: WeatherData;
    dest?: WeatherData;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      try {
        const currSt = journey.currentStation || journey.previousStation || journey.stations[0];
        const nextSt = journey.nextStation || journey.stations[journey.stations.length - 1];
        const destSt = journey.stations[journey.stations.length - 1];

        const [currRes, nextRes, destRes] = await Promise.all([
          fetch(`/api/weather?lat=${currSt.lat}&lng=${currSt.lng}&name=${encodeURIComponent(currSt.name)}&code=${currSt.code}`),
          fetch(`/api/weather?lat=${nextSt.lat}&lng=${nextSt.lng}&name=${encodeURIComponent(nextSt.name)}&code=${nextSt.code}`),
          fetch(`/api/weather?lat=${destSt.lat}&lng=${destSt.lng}&name=${encodeURIComponent(destSt.name)}&code=${destSt.code}`),
        ]);

        const [currJson, nextJson, destJson] = await Promise.all([
          currRes.json(),
          nextRes.json(),
          destRes.json(),
        ]);

        setWeatherData({
          current: currJson.data,
          next: nextJson.data,
          dest: destJson.data,
        });
      } catch (e) {
        console.warn('Weather panel loading failed', e);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [journey]);

  if (loading || !weatherData.current) {
    return (
      <div className="glass-panel rounded-3xl p-6 text-center text-xs text-slate-400">
        {isHi ? 'लाइव OpenWeather मौसम लोड हो रहा है...' : 'Loading live OpenWeather intelligence...'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
        <CloudSun className="h-5 w-5 text-amber-500" />
        <span>{isHi ? 'स्मार्ट यात्रा मौसम जानकारी' : 'Smart Travel Companion Weather'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weatherData.current && (
          <WeatherCard label={isHi ? 'वर्तमान स्टेशन का मौसम' : 'Current Station Weather'} weather={weatherData.current} />
        )}
        {weatherData.next && (
          <WeatherCard label={isHi ? 'अगले स्टेशन का मौसम' : 'Next Station Weather'} weather={weatherData.next} />
        )}
        {weatherData.dest && (
          <WeatherCard label={isHi ? 'गंतव्य स्टेशन का मौसम' : 'Destination Weather'} weather={weatherData.dest} />
        )}
      </div>
    </div>
  );
}
