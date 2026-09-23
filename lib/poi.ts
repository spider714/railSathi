import { LiveJourney, Station } from '@/types/train';
import { getTerrainFeatures, TerrainFeature } from './overpass';

export interface PoiItem {
  id: string;
  name: string;
  category: 'heritage' | 'food' | 'river_bridge' | 'nature' | 'sacred' | 'station';
  description: string;
  lat: number;
  lng: number;
  distanceKm: number; // distance from route origin in km
  nearestStationCode?: string;
  nearestStationName?: string;
  windowSide?: 'Left Window' | 'Right Window' | 'Both';
  famousFor?: string;
  localFoodSpecialty?: string;
  audioGuideText?: string;
  status: 'passed' | 'upcoming' | 'current';
  distanceFromTrainKm?: number; // relative to train's current position
  estimatedMinutesAway?: number;
}

export interface CuratedPoiData {
  name: string;
  category: PoiItem['category'];
  lat: number;
  lng: number;
  description: string;
  famousFor?: string;
  localFoodSpecialty?: string;
  windowSide?: 'Left Window' | 'Right Window' | 'Both';
  audioGuideText?: string;
  nearestStationCode?: string;
  maxDistanceKm?: number;
}

export const CURATED_POIS: CuratedPoiData[] = [
  // ─── DELHI & AGRA & NORTHERN CORRIDOR ───
  {
    name: 'Red Fort & Old Delhi Heritage',
    category: 'heritage',
    lat: 28.6562,
    lng: 77.241,
    nearestStationCode: 'NDLS',
    description: 'Iconic 17th-century Mughal red sandstone citadel built by Emperor Shah Jahan.',
    famousFor: 'Mughal Architecture & Republic Day Flag Hoisting',
    localFoodSpecialty: 'Old Delhi Paranthe Wali Gali Paranthas & Daulat Ki Chaat',
    windowSide: 'Right Window',
    audioGuideText: 'You are passing near Old Delhi. To your right stands the majestic Red Fort, constructed in 1639 by Mughal Emperor Shah Jahan.',
  },
  {
    name: 'Taj Mahal & Yamuna River Vista',
    category: 'heritage',
    lat: 27.1751,
    lng: 78.0421,
    nearestStationCode: 'AGC',
    description: 'World-famous white marble mausoleum and UNESCO World Heritage site on the banks of Yamuna.',
    famousFor: '7th Wonder of the World',
    localFoodSpecialty: 'Agra Famous Petha & Bedmi Puri',
    windowSide: 'Right Window',
    audioGuideText: 'Approaching Agra Cantt. The legendary Taj Mahal is located just 4 km east along the Yamuna River bank. Don\'t forget to grab authentic Agra Petha at the station!',
  },
  {
    name: 'Historic Yamuna Rail Bridge (Lohe Ka Pul)',
    category: 'river_bridge',
    lat: 28.62,
    lng: 77.26,
    nearestStationCode: 'DLI',
    description: 'Double-decker iron lattice bridge constructed in 1866 over the Yamuna River.',
    famousFor: '19th Century British Indian Engineering',
    windowSide: 'Both',
    audioGuideText: 'Crossing the historic 1866 Yamuna Steel Lattice Railway Bridge. Look down to see the flowing waters of the holy Yamuna.',
  },
  {
    name: 'Mathura Janmabhoomi & Peda Junction',
    category: 'sacred',
    lat: 27.4924,
    lng: 77.6737,
    nearestStationCode: 'MTJ',
    description: 'Sacred birthplace of Lord Krishna along the Yamuna river plain.',
    famousFor: 'Shri Krishna Janmabhoomi Temple',
    localFoodSpecialty: 'Mathura Mawa Peda & Kesar Lassi',
    windowSide: 'Left Window',
    audioGuideText: 'Passing Mathura Junction, holy land of Lord Krishna. Station platform vendors are famous for fresh, warm Mathura Pedas.',
  },
  {
    name: 'Golden Temple & Wagah Vista',
    category: 'sacred',
    lat: 31.62,
    lng: 74.8765,
    nearestStationCode: 'ASR',
    description: 'The holiest Sikh Gurdwara, gilded in pure gold, surrounded by the Amrit Sarovar lake.',
    famousFor: 'Harmandir Sahib & World\'s Largest Free Kitchen (Langar)',
    localFoodSpecialty: 'Amritsari Kulcha, Chole & Lassi',
    windowSide: 'Both',
    audioGuideText: 'Welcome to Amritsar! Home of the Sri Harmandir Sahib (Golden Temple). Amritsari Butter Kulche at the station area are world-famous.',
  },

  // ─── RAJASTHAN & WESTERN CORRIDOR ───
  {
    name: 'Hawa Mahal & Pink City Palaces',
    category: 'heritage',
    lat: 26.9239,
    lng: 75.8267,
    nearestStationCode: 'JP',
    description: 'Famous Palace of Winds with 953 honeycombed jharokha windows.',
    famousFor: 'Rajput Architecture & Pink Sandstone',
    localFoodSpecialty: 'Jaipuri Pyaz Kachori, Ghevar & Ker Sangri',
    windowSide: 'Right Window',
    audioGuideText: 'Approaching Jaipur, the Pink City. The iconic Hawa Mahal and Amber Fort showcase centuries of royal Rajput grandeur.',
  },
  {
    name: 'Chambal River Rail Viaduct & Gorge',
    category: 'river_bridge',
    lat: 25.195,
    lng: 75.855,
    nearestStationCode: 'KOTA',
    description: 'Dramatically high railway bridge spanning the deep rocky canyon of the Chambal River.',
    famousFor: 'Chambal Crocodile Sanctuary & Cliffside River Views',
    localFoodSpecialty: 'Kota Kachori & Dal Baati Churma',
    windowSide: 'Both',
    audioGuideText: 'Now crossing the high Chambal River Bridge near Kota. Look down into the canyon for breathtaking views of the river rapids.',
  },
  {
    name: 'Ratlami Sev & Malwa Plateau',
    category: 'food',
    lat: 23.3344,
    lng: 75.037,
    nearestStationCode: 'RTM',
    description: 'Major railway junction on Delhi-Mumbai trunk line, renowned across India for spicy gram flour snacks.',
    famousFor: 'GI Tagged Ratlami Laung Sev & Poha',
    localFoodSpecialty: 'Ratlami Clove Sev & Indori Poha Jalebi',
    windowSide: 'Both',
    audioGuideText: 'Train arriving at Ratlam Junction! Don\'t miss out on GI-tagged Ratlami Sev and hot Poha on the station platform.',
  },
  {
    name: 'Aravalli Range Scenic Curves',
    category: 'nature',
    lat: 25.5,
    lng: 74.0,
    maxDistanceKm: 65,
    description: 'One of the world\'s oldest mountain ranges featuring steep rock cuts and scenic curves.',
    famousFor: 'Prehistoric Geology & Forested Slopes',
    windowSide: 'Both',
    audioGuideText: 'The train is winding through the ancient Aravalli Hills, formed over 3.5 billion years ago.',
  },

  // ─── CENTRAL & CHHATTISGARH & MAHARASHTRA ───
  {
    name: 'Sanchi Stupa Heritage Monument',
    category: 'heritage',
    lat: 23.4792,
    lng: 77.7397,
    nearestStationCode: 'BPL',
    description: '3rd-century BCE UNESCO Buddhist monument commissioned by Emperor Ashoka.',
    famousFor: 'Torana Gates & Buddhist Relics',
    localFoodSpecialty: 'Bhopali Bhutte Ka Kees & Sulaimani Chai',
    windowSide: 'Right Window',
    audioGuideText: 'Passing near Sanchi Stupa, one of India\'s oldest stone structures dating back to Emperor Ashoka in 300 BCE.',
  },
  {
    name: 'Narmada River Golden Rail Bridge',
    category: 'river_bridge',
    lat: 22.75,
    lng: 77.72,
    nearestStationCode: 'ET',
    description: 'Vast rail bridge crossing over the sacred Narmada River near Narmadapuram.',
    famousFor: 'Sacred Narmada Ghats & Sunset Rail Views',
    windowSide: 'Both',
    audioGuideText: 'Crossing the holy Narmada River. Devotees often toss coins into the river as a blessing for safe travels.',
  },
  {
    name: 'Deekshabhoomi Sacred Stupa',
    category: 'sacred',
    lat: 21.128,
    lng: 79.0669,
    nearestStationCode: 'NGP',
    description: 'Vast architectural stupa where Dr. B.R. Ambedkar embraced Buddhism in 1956.',
    famousFor: 'Dhammachakra Pravartan Din & World Peace Stupa',
    localFoodSpecialty: 'Nagpuri Tarri Poha & Juicy Nagpur Oranges',
    windowSide: 'Left Window',
    audioGuideText: 'Entering Nagpur, the Orange City of India. Famous for Deekshabhoomi, spicy Tarri Poha, and fresh Nagpur oranges at station platforms.',
  },
  {
    name: 'Swami Vivekananda Sarovar & Marine Lake',
    category: 'station',
    lat: 21.24,
    lng: 81.63,
    nearestStationCode: 'R',
    description: 'Historic Budha Talab with a colossal 37-foot statue of Swami Vivekananda in Raipur.',
    famousFor: 'Capital City Lake Landmark',
    localFoodSpecialty: 'Chhattisgarhi Chila, Faraa & Bore Basi',
    windowSide: 'Right Window',
    audioGuideText: 'Passing Raipur Junction, capital of Chhattisgarh. The city is renowned for Vivekananda Sarovar and traditional rice-flour snacks like Faraa.',
  },

  // ─── MUMBAI & KONKAN RAILWAY ───
  {
    name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    category: 'heritage',
    lat: 18.9398,
    lng: 72.8355,
    nearestStationCode: 'CSMT',
    description: 'UNESCO World Heritage Gothic Revival railway terminus in Mumbai built in 1887.',
    famousFor: 'Victorian Gothic Architecture & Central Railway HQ',
    localFoodSpecialty: 'Mumbai Vada Pav, Pav Bhaji & Cutting Chai',
    windowSide: 'Both',
    audioGuideText: 'Welcome to CSMT Mumbai! A UNESCO World Heritage architectural masterpiece designed by Frederick William Stevens.',
  },
  {
    name: 'Panval Nadi Rail Viaduct',
    category: 'river_bridge',
    lat: 16.98,
    lng: 73.33,
    nearestStationCode: 'RN',
    description: 'One of the tallest concrete railway viaducts in Asia, standing at 64 meters tall on Konkan Railway.',
    famousFor: 'Engineering Wonder of Konkan Railway',
    windowSide: 'Both',
    audioGuideText: 'Crossing the famous Panval Nadi Viaduct on Konkan Railway — standing higher than a 20-storey building!',
  },
  {
    name: 'Dudhsagar Waterfalls Rail Bridge',
    category: 'nature',
    lat: 15.3144,
    lng: 74.3143,
    nearestStationCode: 'CLR',
    description: 'Spectacular 4-tiered waterfall cascading directly under the railway bridge in Western Ghats.',
    famousFor: 'Sea of Milk Waterfall & Movie Location',
    windowSide: 'Left Window',
    audioGuideText: 'Get your cameras ready! The train is passing right over the Dudhsagar Waterfalls rail bridge. White foamy water cascades beneath the tracks.',
  },

  // ─── EAST & NORTH-EAST ───
  {
    name: 'Howrah Cantilever Bridge & Hooghly River',
    category: 'river_bridge',
    lat: 22.5851,
    lng: 88.3468,
    nearestStationCode: 'HWH',
    description: 'Iconic 705-meter balanced cantilever bridge without nuts or bolts over Hooghly river.',
    famousFor: 'Busiest Cantilever Bridge in the World',
    localFoodSpecialty: 'Kolkata Rosogolla, Mishti Doi & Kati Rolls',
    windowSide: 'Both',
    audioGuideText: 'Arriving at Howrah Station! Ahead lies the world-famous Howrah Bridge over the Hooghly river, carrying over 100,000 vehicles daily.',
  },
  {
    name: 'Kashi Vishwanath & Ganga Ghats',
    category: 'sacred',
    lat: 25.3109,
    lng: 83.0107,
    nearestStationCode: 'BSB',
    description: 'Ancient holy city of Lord Shiva along the sacred Ganges river ghats.',
    famousFor: 'Spiritual Capital of India & Ganga Aarti',
    localFoodSpecialty: 'Varanasi Malaiyyo, Tamatar Chaat & Banarasi Paan',
    windowSide: 'Right Window',
    audioGuideText: 'Passing Varanasi Junction! Home of Kashi Vishwanath Dham and ancient Ganga Aarti. Don\'t miss out on authentic Banarasi Tamatar Chaat.',
  },
  {
    name: 'Pamban Rail Sea Bridge',
    category: 'river_bridge',
    lat: 9.28,
    lng: 79.2,
    nearestStationCode: 'RMM',
    description: 'Historic 2.06 km railway bridge connecting mainland India across Palk Strait ocean to Rameswaram island.',
    famousFor: 'Scherzer Lift Span over the Indian Ocean',
    windowSide: 'Both',
    audioGuideText: 'Riding over the Indian Ocean! The Pamban Sea Bridge offers a sensational 360-degree view of turquoise ocean waters on both sides.',
  },
  {
    name: 'Godavari Arch Rail Bridge',
    category: 'river_bridge',
    lat: 17.0,
    lng: 81.77,
    nearestStationCode: 'RJY',
    description: '2.7 km bowstring girder railway bridge spanning the massive Godavari River at Rajahmundry.',
    famousFor: 'Third Longest Rail-cum-Road Bridge in India',
    localFoodSpecialty: 'Rajahmundry Rose Milk & Andhra Punugulu',
    windowSide: 'Both',
    audioGuideText: 'Crossing the vast Godavari River over the 2.7 km Rajahmundry Bowstring Rail Bridge.',
  },
];

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
 * Derives comprehensive POI items for a given train journey.
 */
export function getJourneyPois(journey: LiveJourney, liveTerrainFeatures: TerrainFeature[] = []): PoiItem[] {
  const routeCoords: [number, number][] =
    journey.routeGeometry ||
    journey.stations.filter((s) => s.lat && s.lng).map((s) => [s.lng, s.lat] as [number, number]);

  if (!routeCoords || routeCoords.length === 0) return [];

  // Calculate cumulative distances along route coordinates
  const cumulativeDists: number[] = [0];
  let totalDist = 0;
  for (let i = 1; i < routeCoords.length; i++) {
    const [lng1, lat1] = routeCoords[i - 1];
    const [lng2, lat2] = routeCoords[i];
    totalDist += calculateHaversineKm(lat1, lng1, lat2, lng2);
    cumulativeDists.push(totalDist);
  }

  const result: PoiItem[] = [];
  const addedNames = new Set<string>();

  // 1. Process Curated POIs
  for (const cpoi of CURATED_POIS) {
    let minDistanceToRoute = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < routeCoords.length; i++) {
      const [rLng, rLat] = routeCoords[i];
      const dist = calculateHaversineKm(cpoi.lat, cpoi.lng, rLat, rLng);
      if (dist < minDistanceToRoute) {
        minDistanceToRoute = dist;
        closestIndex = i;
      }
    }

    const maxAllowed = cpoi.maxDistanceKm ?? 50;
    if (minDistanceToRoute <= maxAllowed) {
      const distanceKm = Math.round(cumulativeDists[closestIndex]);

      // Find nearest station in journey
      let nearestSt: Station | undefined;
      if (cpoi.nearestStationCode) {
        nearestSt = journey.stations.find((s) => s.code === cpoi.nearestStationCode);
      }
      if (!nearestSt) {
        let minDist = Infinity;
        for (const st of journey.stations) {
          if (!st.lat || !st.lng) continue;
          const d = calculateHaversineKm(cpoi.lat, cpoi.lng, st.lat, st.lng);
          if (d < minDist) {
            minDist = d;
            nearestSt = st;
          }
        }
      }

      // Determine status based on train completion & position
      let status: PoiItem['status'] = 'upcoming';
      const trainCovered = journey.distanceCoveredKm || (journey.completionPercentage / 100) * journey.totalDistanceKm;

      if (distanceKm <= trainCovered - 15) {
        status = 'passed';
      } else if (Math.abs(distanceKm - trainCovered) <= 15) {
        status = 'current';
      } else {
        status = 'upcoming';
      }

      const trainSpeed = journey.speedKmh > 10 ? journey.speedKmh : 60;
      const distFromTrain = Math.max(0, Math.round(distanceKm - trainCovered));
      const etaMins = status === 'upcoming' ? Math.round((distFromTrain / trainSpeed) * 60) : 0;

      addedNames.add(cpoi.name.toLowerCase());
      result.push({
        id: `poi-curated-${cpoi.name.replace(/\s+/g, '-').toLowerCase()}`,
        name: cpoi.name,
        category: cpoi.category,
        description: cpoi.description,
        lat: cpoi.lat,
        lng: cpoi.lng,
        distanceKm,
        nearestStationCode: nearestSt?.code,
        nearestStationName: nearestSt?.name,
        windowSide: cpoi.windowSide || 'Both',
        famousFor: cpoi.famousFor,
        localFoodSpecialty: cpoi.localFoodSpecialty,
        audioGuideText: cpoi.audioGuideText,
        status,
        distanceFromTrainKm: distFromTrain,
        estimatedMinutesAway: etaMins,
      });
    }
  }

  // 2. Add Live Terrain/Overpass features if not already in curated
  for (const tf of liveTerrainFeatures) {
    const norm = tf.name.toLowerCase().trim();
    if (addedNames.has(norm)) continue;
    addedNames.add(norm);

    let cat: PoiItem['category'] = 'nature';
    if (tf.type === 'bridge' || tf.type === 'tunnel' || tf.type === 'river') cat = 'river_bridge';
    else if (tf.type === 'tourist') cat = 'heritage';
    else if (tf.type === 'city') cat = 'station';

    const distanceKm = tf.distanceKm ?? 0;
    const trainCovered = journey.distanceCoveredKm || (journey.completionPercentage / 100) * journey.totalDistanceKm;

    let status: PoiItem['status'] = 'upcoming';
    if (distanceKm <= trainCovered - 15) status = 'passed';
    else if (Math.abs(distanceKm - trainCovered) <= 15) status = 'current';
    else status = 'upcoming';

    const trainSpeed = journey.speedKmh > 10 ? journey.speedKmh : 60;
    const distFromTrain = Math.max(0, Math.round(distanceKm - trainCovered));
    const etaMins = status === 'upcoming' ? Math.round((distFromTrain / trainSpeed) * 60) : 0;

    result.push({
      id: `poi-terrain-${tf.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: tf.name,
      category: cat,
      description: tf.description || `Scenic landmark along route (${tf.type})`,
      lat: tf.lat,
      lng: tf.lng,
      distanceKm,
      status,
      distanceFromTrainKm: distFromTrain,
      estimatedMinutesAway: etaMins,
    });
  }

  // Sort POIs by distance along the train route
  result.sort((a, b) => a.distanceKm - b.distanceKm);

  return result;
}
