import { NextRequest, NextResponse } from 'next/server';
import { askRailSathiAI } from '@/lib/gemini';
import { getLiveJourney } from '@/lib/railradar';
import { getWeatherForLocation, WeatherData } from '@/lib/openweather';
import { getElevationProfile } from '@/lib/opentopography';
import { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, trainId, history, language } = body || {};

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: 'Prompt is required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }

    let journey = undefined;
    let weather: WeatherData | undefined = undefined;
    let elevation = undefined;

    if (trainId) {
      journey = (await getLiveJourney(trainId).catch(() => undefined)) || undefined;

      if (journey) {
        const lat = journey.currentLocation?.lat || journey.stations[0]?.lat || 28.64;
        const lng = journey.currentLocation?.lng || journey.stations[0]?.lng || 77.22;
        const stationName = journey.currentStation?.name || journey.nextStation?.name || journey.name;

        // Fetch real-time weather & OpenTopography elevation for train's exact coordinates
        const [weatherRes, elevationProfile] = await Promise.all([
          getWeatherForLocation(lat, lng, stationName).catch(() => undefined),
          getElevationProfile(
            journey.routeGeometry || journey.stations.map((s) => [s.lng, s.lat] as [number, number]),
            journey.totalDistanceKm
          ).catch(() => []),
        ]);

        weather = weatherRes;

        if (elevationProfile && elevationProfile.length > 0) {
          const highestElevationM = Math.max(...elevationProfile.map((e) => e.elevationM), 100);
          // Estimate current elevation point based on completion percentage
          const currentIdx = Math.min(
            elevationProfile.length - 1,
            Math.max(0, Math.floor((journey.completionPercentage / 100) * elevationProfile.length))
          );
          const currentElevationM = elevationProfile[currentIdx]?.elevationM || elevationProfile[0]?.elevationM || 120;

          elevation = {
            currentElevationM,
            highestElevationM,
          };
        }
      }
    }

    const aiResult = await askRailSathiAI(prompt, journey, weather, elevation, history || [], language || 'en');

    return NextResponse.json<ApiResponse<typeof aiResult>>({
      success: true,
      data: aiResult,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.warn('AI Assistant route fallback triggered:', err?.message);
    const fallbackResult = await askRailSathiAI(
      typeof request === 'object' ? 'help' : 'hello',
      undefined,
      undefined,
      undefined,
      [],
      'en'
    );
    return NextResponse.json<ApiResponse<typeof fallbackResult>>({
      success: true,
      data: fallbackResult,
      timestamp: new Date().toISOString(),
    });
  }
}
