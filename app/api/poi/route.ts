import { NextRequest, NextResponse } from 'next/server';
import { getLiveJourney } from '@/lib/railradar';
import { getTerrainFeatures } from '@/lib/overpass';
import { getJourneyPois, PoiItem } from '@/lib/poi';
import { getCached, setCached } from '@/lib/cache';
import { ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trainId = searchParams.get('trainId');

  if (!trainId) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: 'trainId is required', timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }

  const cacheKey = `poi:v1:${trainId}`;
  const cached = getCached<PoiItem[]>(cacheKey);
  if (cached) {
    return NextResponse.json<ApiResponse<PoiItem[]>>({
      success: true,
      data: cached,
      cached: true,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const journey = await getLiveJourney(trainId);
    if (!journey) {
      return NextResponse.json<ApiResponse<PoiItem[]>>({
        success: true,
        data: [],
        cached: false,
        timestamp: new Date().toISOString(),
      });
    }

    const routeCoords =
      journey.routeGeometry ||
      journey.stations.filter((s) => s.lat && s.lng).map((s) => [s.lng, s.lat] as [number, number]);

    // Fetch terrain/overpass features to combine with curated POIs
    const terrainFeatures = await getTerrainFeatures(routeCoords);
    const pois = getJourneyPois(journey, terrainFeatures);

    setCached(cacheKey, pois, 3600); // 1 hour cache

    return NextResponse.json<ApiResponse<PoiItem[]>>({
      success: true,
      data: pois,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: err.message || 'POI fetch failed', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
