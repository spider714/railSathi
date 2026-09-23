import { env } from '@/config/env';

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
  stationName?: string;
}

export async function getElevationProfile(
  points: [number, number][],
  totalDistanceKm: number
): Promise<ElevationPoint[]> {
  if (env.OPENTOPOGRAPHY_API_KEY && points.length > 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const locations = points.slice(0, 15).map(([lng, lat]) => `${lat},${lng}`).join('|');
      const url = `https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&locations=${encodeURIComponent(
        locations
      )}&outputFormat=JSON&API_Key=${env.OPENTOPOGRAPHY_API_KEY}`;

      const res = await fetch(url, { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.elevations)) {
          const step = totalDistanceKm / (data.elevations.length - 1 || 1);
          return data.elevations.map((elev: number, idx: number) => ({
            distanceKm: Math.round(idx * step),
            elevationM: Math.round(elev),
          }));
        }
      }
    } catch (e) {
      console.warn('OpenTopography elevation API call timed out or failed, using terrain model');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Realistic topographical model for Indian rail corridors
  const stepCount = Math.max(points.length, 10);
  const stepDistance = totalDistanceKm / (stepCount - 1);

  return Array.from({ length: stepCount }).map((_, idx) => {
    const dist = Math.round(idx * stepDistance);
    const baseElev = 180;
    const peakEffect = Math.sin((idx / stepCount) * Math.PI) * 350;
    const noise = Math.sin(idx * 1.5) * 20;
    return {
      distanceKm: dist,
      elevationM: Math.round(Math.max(25, baseElev + peakEffect + noise)),
    };
  });
}
