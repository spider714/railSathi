import { env } from '@/config/env';

export interface TerrainFeature {
  type: 'bridge' | 'tunnel' | 'river' | 'mountain' | 'tourist' | 'city';
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  description?: string;
}

interface CuratedLandmark {
  name: string;
  type: TerrainFeature['type'];
  lat: number;
  lng: number;
  description?: string;
  maxDistanceKm?: number;
}

// ─── Curated Indian Railways Tourism & Landmark Database ───────────────────
const LANDMARKS_DB: CuratedLandmark[] = [
  // ─── NORTH & GOLDEN TRIANGLE (DELHI, AGRA, JAIPUR, AMRITSAR) ───
  { name: 'Red Fort & Jama Masjid', type: 'tourist', lat: 28.6562, lng: 77.2410, description: 'Mughal-era fortress in Old Delhi' },
  { name: 'Qutub Minar', type: 'tourist', lat: 28.5244, lng: 77.1855, description: 'UNESCO World Heritage minaret' },
  { name: 'Humayun\'s Tomb', type: 'tourist', lat: 28.5849, lng: 77.2507, description: 'Historic Mughal garden tomb' },
  { name: 'Yamuna River Rail Bridge', type: 'river', lat: 28.6200, lng: 77.2600, description: 'Historic railway crossing over Yamuna' },
  { name: 'Taj Mahal', type: 'tourist', lat: 27.1751, lng: 78.0421, description: '7th Wonder of the World in Agra' },
  { name: 'Agra Fort', type: 'tourist', lat: 27.1795, lng: 78.0211, description: 'Historic imperial Mughal fortress' },
  { name: 'Fatehpur Sikri', type: 'tourist', lat: 27.0945, lng: 77.6679, description: 'UNESCO Mughal heritage capital' },
  { name: 'Golden Temple', type: 'tourist', lat: 31.6200, lng: 74.8765, description: 'Sacred Sikh shrine in Amritsar' },
  { name: 'Jallianwala Bagh', type: 'tourist', lat: 31.6206, lng: 74.8801, description: 'Historic national memorial' },
  { name: 'Rock Garden & Sukhna Lake', type: 'tourist', lat: 30.7525, lng: 76.8101, description: 'Famous Chandigarh rock sculpture garden' },
  { name: 'Beas River Rail Bridge', type: 'river', lat: 31.5100, lng: 75.2900, description: 'Major railway bridge in Punjab' },
  { name: 'Sutlej River Rail Bridge', type: 'river', lat: 30.9700, lng: 75.8500, description: 'Longest river bridge crossing in Punjab' },
  { name: 'Hawa Mahal', type: 'tourist', lat: 26.9239, lng: 75.8267, description: 'Palace of Winds in Jaipur' },
  { name: 'Amber Fort', type: 'tourist', lat: 26.9855, lng: 75.8513, description: 'Majestic hilltop fortress in Jaipur' },
  { name: 'Keoladeo National Park', type: 'tourist', lat: 27.1600, lng: 77.5200, description: 'UNESCO World Heritage Bird Sanctuary in Bharatpur' },
  { name: 'Aravalli Mountain Range', type: 'mountain', lat: 25.5000, lng: 74.0000, maxDistanceKm: 60, description: 'One of the oldest geological mountain ranges' },

  // ─── CENTRAL INDIA (CHHATTISGARH, MP, MAHARASHTRA) ───
  { name: 'Swami Vivekananda Sarovar', type: 'tourist', lat: 21.2400, lng: 81.6300, description: 'Historic lake & iconic statue in Raipur' },
  { name: 'Ghatarani & Jatmai Waterfalls', type: 'tourist', lat: 20.9500, lng: 82.1500, description: 'Scenic forest waterfalls near Rajim/Raipur' },
  { name: 'Mahanadi River Rail Bridge', type: 'river', lat: 21.1800, lng: 81.7800, description: 'Major river crossing in Chhattisgarh' },
  { name: 'Sheonath River Bridge', type: 'river', lat: 21.2000, lng: 81.4000, description: 'Lifeline river crossing near Durg/Raipur' },
  { name: 'Hasdeo River Rail Bridge', type: 'river', lat: 22.3500, lng: 82.7200, description: 'Scenic river crossing in Korba' },
  { name: 'Amarkantak Narmada Hills', type: 'mountain', lat: 22.6700, lng: 81.7500, maxDistanceKm: 60, description: 'Sacred hill station & origin of Narmada River' },
  { name: 'Chitrakote Waterfalls', type: 'tourist', lat: 19.2000, lng: 81.7000, description: 'Wide horseshoe waterfall in Bastar' },
  { name: 'Deekshabhoomi Monument', type: 'tourist', lat: 21.1280, lng: 79.0669, description: 'Sacred Buddhist stupa in Nagpur' },
  { name: 'Pench Tiger Reserve', type: 'tourist', lat: 21.7500, lng: 79.3000, description: 'Renowned wildlife reserve on MP-MH border' },
  { name: 'Sanchi Stupa', type: 'tourist', lat: 23.4792, lng: 77.7397, description: 'Ancient UNESCO Buddhist monument near Bhopal' },
  { name: 'Upper Lake (Bhojtal)', type: 'tourist', lat: 23.2330, lng: 77.3600, description: 'Vast historic lake in Bhopal' },
  { name: 'Bhimbetka Rock Shelters', type: 'tourist', lat: 22.9370, lng: 77.6130, description: 'UNESCO prehistoric cave paintings site' },
  { name: 'Gwalior Fort & Man Singh Palace', type: 'tourist', lat: 26.2300, lng: 78.1690, description: 'Historic hilltop citadel in Gwalior' },
  { name: 'Orchha Fort & Betwa River', type: 'tourist', lat: 25.3500, lng: 78.6400, description: 'Bundela royal palaces near Jhansi' },
  { name: 'Jhansi Fort', type: 'tourist', lat: 25.4580, lng: 78.5780, description: 'Rani Laxmibai historic fortress' },
  { name: 'Narmada River Rail Bridge', type: 'river', lat: 22.7500, lng: 77.7200, description: 'Iconic rail bridge over Narmada at Hoshangabad' },
  { name: 'Vindhyachal Mountain Range', type: 'mountain', lat: 23.5000, lng: 78.5000, maxDistanceKm: 60, description: 'Historic mountain barrier of Central India' },

  // ─── WESTERN CORRIDOR (MUMBAI, GUJARAT, RAJASTHAN) ───
  { name: 'Gateway of India', type: 'tourist', lat: 18.9220, lng: 72.8347, description: 'Iconic 20th century arch monument in Mumbai' },
  { name: 'Sanjay Gandhi National Park', type: 'tourist', lat: 19.2300, lng: 72.8600, description: 'Sprawling urban national park in Mumbai' },
  { name: 'Tapti River Bridge', type: 'river', lat: 21.2000, lng: 72.8300, description: 'Major river crossing near Surat' },
  { name: 'Golden Bridge over Narmada', type: 'bridge', lat: 21.7000, lng: 72.9800, description: 'Historic bridge crossing over Narmada at Bharuch' },
  { name: 'Statue of Unity', type: 'tourist', lat: 21.8380, lng: 73.7190, maxDistanceKm: 50, description: 'World\'s tallest statue near Kevadia' },
  { name: 'Sabarmati Ashram & Riverfront', type: 'tourist', lat: 23.0600, lng: 72.5800, description: 'Historic ashram of Mahatma Gandhi in Ahmedabad' },
  { name: 'Kota Garh Palace & Seven Wonders', type: 'tourist', lat: 25.1800, lng: 75.8400, description: 'Heritage palace on Chambal river in Kota' },
  { name: 'Kota Railway Bridge', type: 'bridge', lat: 25.1950, lng: 75.8550, description: 'Rail bridge over Chambal River gorge in Kota' },
  { name: 'Chambal River Gorge', type: 'river', lat: 25.1900, lng: 75.8500, description: 'Picturesque river gorge in Rajasthan' },

  // ─── EAST & NORTH-EAST (KOLKATA, ODISHA, VARANASI, PATNA) ───
  { name: 'Howrah Bridge (Rabindra Setu)', type: 'bridge', lat: 22.5851, lng: 88.3468, description: 'Iconic cantilever bridge over Hooghly river' },
  { name: 'Victoria Memorial', type: 'tourist', lat: 22.5448, lng: 88.3426, description: 'Grand marble building in Kolkata' },
  { name: 'Dakshineswar Kali Temple', type: 'tourist', lat: 22.6547, lng: 88.3576, description: 'Historic temple on the banks of Hooghly' },
  { name: 'Jagannath Temple', type: 'tourist', lat: 19.8135, lng: 85.8312, description: 'Sacred Dham temple in Puri' },
  { name: 'Konark Sun Temple', type: 'tourist', lat: 19.8876, lng: 86.0945, description: 'UNESCO 13th-century chariot temple' },
  { name: 'Kashi Vishwanath Temple & Ghats', type: 'tourist', lat: 25.3109, lng: 83.0107, description: 'Holiest shrine & ghats in Varanasi' },
  { name: 'Sarnath Ancient Stupa', type: 'tourist', lat: 25.3811, lng: 83.0214, description: 'Buddha\'s first sermon site' },
  { name: 'Ganga River Rail Bridge', type: 'river', lat: 25.3000, lng: 83.0300, description: 'Massive railway bridge over Ganges at Varanasi' },
  { name: 'Mahabodhi Temple', type: 'tourist', lat: 24.6960, lng: 84.9910, description: 'UNESCO Buddha enlightenment site in Gaya' },

  // ─── SOUTH (ANDHRA, TELANGANA, KARNATAKA, TAMIL NADU) ───
  { name: 'Charminar & Golconda Fort', type: 'tourist', lat: 17.3616, lng: 78.4747, description: '16th century iconic fortress & monument in Hyderabad' },
  { name: 'Araku Valley & Borra Caves', type: 'mountain', lat: 18.2800, lng: 82.8700, maxDistanceKm: 50, description: 'Scenic Eastern Ghats hill station' },
  { name: 'Godavari Arch Rail Bridge', type: 'bridge', lat: 17.0000, lng: 81.7700, description: 'Longest bowstring girder rail bridge at Rajahmundry' },
  { name: 'Prakasam Barrage & Krishna Bridge', type: 'river', lat: 16.5100, lng: 80.6200, description: 'Major river rail bridge at Vijayawada' },
  { name: 'Marina Beach', type: 'tourist', lat: 13.0400, lng: 80.2800, description: 'Longest natural urban beach in India' },
  { name: 'Lalbagh & Bangalore Palace', type: 'tourist', lat: 12.9507, lng: 77.5848, description: 'Botanical garden & royal palace in Bengaluru' },
  { name: 'Mysore Palace & Chamundi Hill', type: 'tourist', lat: 12.3052, lng: 76.6552, description: 'Historic palace of Wodeyar dynasty' },
  { name: 'Pamban Rail Sea Bridge', type: 'bridge', lat: 9.2800, lng: 79.2000, description: 'Historic sea railway bridge to Rameswaram' },
  { name: 'Meenakshi Amman Temple', type: 'tourist', lat: 9.9195, lng: 78.1193, description: 'Historic Dravidian temple towers in Madurai' },

  // ─── KONKAN & WESTERN GHATS ───
  { name: 'Panval Nadi Rail Viaduct', type: 'tunnel', lat: 16.9800, lng: 73.3300, description: 'Tallest railway viaduct in Asia' },
  { name: 'Dudhsagar Waterfalls Rail Bridge', type: 'tourist', lat: 15.3144, lng: 74.3143, description: 'Iconic waterfall on Konkan Railway route' },
  { name: 'Western Ghats Peaks & Tunnels', type: 'mountain', lat: 15.8000, lng: 74.0000, maxDistanceKm: 60, description: 'UNESCO World Heritage mountain chain' },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
  * Calculate route-matched landmarks from curated database along train geometry.
  */
function getRouteMatchedLandmarks(routeCoords: [number, number][]): TerrainFeature[] {
  if (!routeCoords || routeCoords.length === 0) return [];

  // Calculate cumulative distance along route coordinates ([lng, lat])
  const cumulativeDists: number[] = [0];
  let totalDist = 0;
  for (let i = 1; i < routeCoords.length; i++) {
    const [lng1, lat1] = routeCoords[i - 1];
    const [lng2, lat2] = routeCoords[i];
    totalDist += haversineKm(lat1, lng1, lat2, lng2);
    cumulativeDists.push(totalDist);
  }

  const matched: TerrainFeature[] = [];

  for (const landmark of LANDMARKS_DB) {
    let minTrackDist = Infinity;
    let closestIdx = 0;

    for (let i = 0; i < routeCoords.length; i++) {
      const [rLng, rLat] = routeCoords[i];
      const dist = haversineKm(landmark.lat, landmark.lng, rLat, rLng);
      if (dist < minTrackDist) {
        minTrackDist = dist;
        closestIdx = i;
      }
    }

    const maxAllowed = landmark.maxDistanceKm ?? 45;
    if (minTrackDist <= maxAllowed) {
      const distanceKm = Math.round(cumulativeDists[closestIdx]);
      matched.push({
        type: landmark.type,
        name: landmark.name,
        lat: landmark.lat,
        lng: landmark.lng,
        distanceKm,
        description: landmark.description,
      });
    }
  }

  return matched;
}

function mapOsmType(tags: Record<string, string>): TerrainFeature['type'] {
  if (tags.bridge === 'yes') return 'bridge';
  if (tags.tunnel === 'yes') return 'tunnel';
  if (tags.waterway === 'river') return 'river';
  if (tags.natural === 'peak') return 'mountain';
  if (tags.tourism === 'attraction' || tags.tourism === 'viewpoint' || tags.tourism === 'museum') return 'tourist';
  if (tags.historic) return 'tourist';
  if (tags.place === 'city' || tags.place === 'town') return 'city';
  return 'tourist';
}

function parseName(tags: Record<string, string>): string {
  return tags['name:en'] || tags.name || tags.description || 'Unnamed feature';
}

/**
 * Fetch live Overpass API features using sampled route waypoints with tight radii.
 */
async function fetchOverpassFeatures(routeCoords: [number, number][]): Promise<TerrainFeature[]> {
  if (!routeCoords || routeCoords.length === 0) return [];

  // Sample up to 5 waypoints along the route
  const waypoints: [number, number][] = [];
  const step = Math.max(1, Math.floor(routeCoords.length / 5));
  for (let i = 0; i < routeCoords.length; i += step) {
    const [lng, lat] = routeCoords[i];
    waypoints.push([lat, lng]);
  }
  if (waypoints.length > 5) waypoints.length = 5;

  const waypointsStr = waypoints.map(([lat, lng]) => `${lat.toFixed(3)},${lng.toFixed(3)}`).join(',');

  const query = `[out:json][timeout:8];
(
  node["tourism"~"attraction|museum|viewpoint"](around:15000,${waypointsStr});
  node["historic"~"monument|memorial|fort|castle"](around:15000,${waypointsStr});
  way["waterway"="river"]["name"](around:10000,${waypointsStr});
  way["bridge"="yes"]["name"](around:8000,${waypointsStr});
  node["natural"="peak"](around:15000,${waypointsStr});
);
out center tags 25;`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    if (!res.ok) return [];

    const json = await res.json();
    const elements: any[] = json?.elements || [];

    const features: TerrainFeature[] = [];
    const seen = new Set<string>();

    for (const el of elements) {
      const tags = el.tags || {};
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (!lat || !lng) continue;

      const name = parseName(tags);
      if (name === 'Unnamed feature') continue;

      const type = mapOsmType(tags);
      const key = `${type}:${name.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      features.push({ type, name, lat, lng });
      if (features.length >= 15) break;
    }

    return features;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch terrain & tourism POIs for an array of route coordinates.
 * Combines route-matched curated landmarks + live Overpass API features.
 */
export async function getTerrainFeatures(
  routeCoords: [number, number][]
): Promise<TerrainFeature[]> {
  if (!routeCoords || routeCoords.length === 0) return [];

  // 1. Get curated route-matched landmarks
  const curated = getRouteMatchedLandmarks(routeCoords);

  // 2. Fetch live Overpass API features around waypoints
  const live = await fetchOverpassFeatures(routeCoords);

  // Calculate route cumulative distances for live Overpass features
  const cumulativeDists: number[] = [0];
  let totalDist = 0;
  for (let i = 1; i < routeCoords.length; i++) {
    const [lng1, lat1] = routeCoords[i - 1];
    const [lng2, lat2] = routeCoords[i];
    totalDist += haversineKm(lat1, lng1, lat2, lng2);
    cumulativeDists.push(totalDist);
  }

  for (const f of live) {
    let minTrackDist = Infinity;
    let closestIdx = 0;
    for (let i = 0; i < routeCoords.length; i++) {
      const [rLng, rLat] = routeCoords[i];
      const dist = haversineKm(f.lat, f.lng, rLat, rLng);
      if (dist < minTrackDist) {
        minTrackDist = dist;
        closestIdx = i;
      }
    }
    f.distanceKm = Math.round(cumulativeDists[closestIdx]);
  }

  // Combine curated and live features, deduplicating by normalized name
  const seenNames = new Set<string>();
  const combined: TerrainFeature[] = [];

  for (const f of [...curated, ...live]) {
    const norm = f.name.toLowerCase().trim();
    if (seenNames.has(norm)) continue;
    seenNames.add(norm);
    combined.push(f);
  }

  // Sort by distance from origin along the train route
  combined.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  return combined.slice(0, 25);
}

