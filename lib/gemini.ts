import { env } from '@/config/env';
import { LiveJourney } from '@/types/train';
import { WeatherData } from '@/lib/openweather';

export interface ElevationData {
  currentElevationM?: number;
  highestElevationM?: number;
}

export interface AiChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AiAssistantResponse {
  answer: string;
  suggestions?: string[];
  isFallback?: boolean;
}

export async function askRailSathiAI(
  prompt: string,
  journey?: LiveJourney,
  weather?: WeatherData,
  elevation?: ElevationData,
  history: AiChatMessage[] = [],
  language: 'en' | 'hi' = 'en'
): Promise<AiAssistantResponse> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  // Build context text from live journey, real-time weather & OpenTopography elevation
  let contextText = '';
  if (journey) {
    const upcoming = journey.stations.filter((s) => s.status === 'upcoming');
    contextText = `
REAL-TIME TRAIN & ATMOSPHERIC CONTEXT (DIRECT FROM LIVE APIS):
• Train: ${journey.name} (#${journey.number})
• Route: ${journey.origin.name} (${journey.origin.code}) ➔ ${journey.destination.name} (${journey.destination.code})
• Status: ${journey.status.toUpperCase()} (Delay: ${journey.delayMinutes} mins)
• Current Speed: ${journey.speedKmh} km/h
• Journey Progress: ${journey.completionPercentage}% (${journey.distanceCoveredKm} km of ${journey.totalDistanceKm} km)
• Current Station: ${journey.currentStation?.name || journey.previousStation?.name || 'En Route'}
• Next Halt: ${journey.nextStation?.name || 'N/A'} (ETA: ${journey.ETA})
• Upcoming Stops: ${upcoming.slice(0, 5).map((s) => `${s.name} (${s.code})`).join(', ')}
`;
  }

  if (weather) {
    contextText += `
REAL-TIME WEATHER DATA (OpenWeather API):
• Location: ${weather.stationName || 'Current Train Location'}
• Temperature: ${weather.tempC}°C (Feels like ${weather.feelsLikeC}°C)
• Weather Condition: ${weather.condition}
• Humidity: ${weather.humidity}%
• Wind Speed: ${weather.windSpeedKmh} km/h
• Rain Probability: ${weather.rainChancePercent ?? 10}%
`;
  }

  if (elevation) {
    contextText += `
REAL-TIME ELEVATION & TERRAIN DATA (OpenTopography SRTM API):
• Current Altitude: ${elevation.currentElevationM ?? 'N/A'} meters above sea level
• Maximum Route Elevation: ${elevation.highestElevationM ?? 'N/A'} meters above sea level
`;
  }

  const languagePrompt =
    language === 'hi'
      ? 'CRITICAL LANGUAGE REQUIREMENT: You MUST answer the user completely in HINDI (हिंदी) using clean, respectful Devanagari script.'
      : 'Respond in clear, professional English.';

  const systemInstruction = `You are RailSathi AI, an advanced real-time travel intelligence assistant for Indian Railways.
${languagePrompt}
Using the REAL-TIME live API data provided above (RailRadar, OpenWeather, OpenTopography):
1. Directly answer the user's specific question (food, delay prediction, station facilities, scenic spots, or weather).
2. Give precise, context-aware answers combining current weather, elevation/terrain, and live train status.
3. Keep your response concise (under 180 words), crisp, formatted with clear markdown bullet points and emojis.

${contextText}`;

  const defaultSuggestions =
    language === 'hi'
      ? [
          '🍱 आगामी स्टेशनों पर भोजन की सिफारिशें?',
          '⏱️ क्या देरी बढ़ेगी या घटेगी?',
          '🏔️ इस मार्ग के प्रमुख दृश्य?',
          '🚉 स्टेशन सुविधाएं और प्रतीक्षालय की जानकारी',
        ]
      : [
          '🍱 Food recommendations at upcoming stations?',
          '⏱️ Will delay increase or decrease?',
          '🏔️ Scenic highlights on this route?',
          '🚉 Station facilities & waiting rooms info',
        ];

  if (!apiKey) {
    return {
      answer: generateFallbackAiAnswer(prompt, journey, weather, elevation, language),
      suggestions: defaultSuggestions,
      isFallback: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Include up to last 6 chat history turns for multi-turn context
    for (const msg of history.slice(-6)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    // Append current prompt
    contents.push({
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }],
    });

    const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest'];
    let response: Response | null = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
              },
            }),
          }
        );
        if (res.ok) {
          response = res;
          break;
        } else {
          lastError = await res.json().catch(() => ({}));
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (!response) {
      console.warn('Gemini API request error across models:', lastError);
      throw new Error(lastError?.error?.message || 'Gemini API call failed');
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const answerText = parts.map((p: any) => p.text).filter(Boolean).join('\n').trim();
    const answer =
      answerText ||
      (language === 'hi'
        ? 'क्षमा करें, मैं इस समय आपके अनुरोध का उत्तर नहीं दे सका।'
        : 'I apologize, I could not process your request at the moment.');

    return {
      answer,
      suggestions: defaultSuggestions,
      isFallback: false,
    };
  } catch (err: any) {
    console.warn('Error calling Gemini API, generating smart advisory:', err?.message);
    return {
      answer: generateFallbackAiAnswer(prompt, journey, weather, elevation, language),
      suggestions: defaultSuggestions,
      isFallback: true,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function generateFallbackAiAnswer(
  prompt: string,
  journey?: LiveJourney,
  weather?: WeatherData,
  elevation?: ElevationData,
  language: 'en' | 'hi' = 'en'
): string {
  const p = prompt.toLowerCase();
  const isHi = language === 'hi';
  const trainName = journey ? `${journey.name} (#${journey.number})` : isHi ? 'आपकी ट्रेन' : 'your train';
  const upcomingStops = journey?.stations.filter((s) => s.status === 'upcoming') || [];
  const nextHalt = journey?.nextStation?.name || upcomingStops[0]?.name || (isHi ? 'अगला स्टेशन' : 'the next station');

  // ─── 1. Delay & Timing Questions ───
  if (
    p.includes('delay') ||
    p.includes('late') ||
    p.includes('time') ||
    p.includes('schedule') ||
    p.includes('increase') ||
    p.includes('decrease') ||
    p.includes('eta') ||
    p.includes('देरी') ||
    p.includes('विलंब') ||
    p.includes('समय') ||
    p.includes('घटेगी') ||
    p.includes('बढ़ेगी')
  ) {
    const delayMins = journey?.delayMinutes ?? 0;
    const speed = journey?.speedKmh ?? 80;

    if (isHi) {
      if (delayMins === 0) {
        return (
          `⏱️ **${trainName} के लिए देरी एवं समयबद्धता विश्लेषण**:\n\n` +
          `• **वर्तमान स्थिति**: **समय पर (ON TIME)** (0 मिनट विलंब)।\n` +
          `• **वर्तमान गति**: **${speed} किमी/घंटा**।\n` +
          `• **अगला स्टेशन**: **${nextHalt}** (अनुमानित समय: ${journey?.ETA || 'समय पर'})।\n` +
          `• **पूर्वानुमान**: आगे सिग्नल की स्थिति अनुकूल है। ट्रेन के अगले स्टेशनों पर भी समयबद्ध चलने की संभावना है।`
        );
      } else {
        return (
          `⏱️ **${trainName} के लिए देरी एवं समयबद्धता विश्लेषण**:\n\n` +
          `• **वर्तमान स्थिति**: **${delayMins} मिनट विलंब**।\n` +
          `• **वर्तमान गति**: **${speed} किमी/घंटा**।\n` +
          `• **अगला स्टेशन**: **${nextHalt}** (अनुमानित समय: ${journey?.ETA || 'प्रतीक्षित'})।\n` +
          `• **पूर्वानुमान**: वर्तमान गति (${speed} किमी/घंटा) के साथ खुली पटरी पर ट्रेन ${journey?.destination.name || 'गंतव्य'} पहुँचने से पहले 5–10 मिनट कवर कर सकती है।`
        );
      }
    } else {
      if (delayMins === 0) {
        return (
          `⏱️ **Delay & Schedule Intelligence for ${trainName}**:\n\n` +
          `• **Current Status**: Running **ON TIME** (0 mins delay).\n` +
          `• **Current Speed**: **${speed} km/h** cruising speed.\n` +
          `• **Next Halt**: **${nextHalt}** (ETA: ${journey?.ETA || 'On schedule'}).\n` +
          `• **Delay Forecast**: Signal clearance ahead is favorable. The train is expected to maintain its on-time performance across upcoming halts.`
        );
      } else {
        return (
          `⏱️ **Delay & Schedule Intelligence for ${trainName}**:\n\n` +
          `• **Current Delay**: **${delayMins} minutes delayed**.\n` +
          `• **Current Speed**: **${speed} km/h**.\n` +
          `• **Next Halt**: **${nextHalt}** (ETA: ${journey?.ETA || 'Calculating...'}).\n` +
          `• **Delay Forecast**: Maintain optimistic outlook – with current speed (${speed} km/h), the train can recover 5–10 minutes on open track stretches before reaching ${journey?.destination.name || 'destination'}.`
        );
      }
    }
  }

  // ─── 2. Food & Delicacies Questions ───
  if (
    p.includes('food') ||
    p.includes('eat') ||
    p.includes('snack') ||
    p.includes('delicac') ||
    p.includes('meal') ||
    p.includes('pantry') ||
    p.includes('breakfast') ||
    p.includes('lunch') ||
    p.includes('dinner') ||
    p.includes('tea') ||
    p.includes('भोजन') ||
    p.includes('खाना') ||
    p.includes('नाश्ता') ||
    p.includes('चाय')
  ) {
    const stopNames = upcomingStops.slice(0, 3).map((s) => s.name);
    const stopStr = stopNames.length > 0 ? stopNames.join(', ') : isHi ? 'आगामी स्टेशन' : 'upcoming stations';

    if (isHi) {
      let foodDetails =
        '• **प्लेटफ़ॉर्म स्नैक्स**: गर्मागर्म समोसे, ताज़ा पोहा, पकौड़े और IRCTC स्टॉलों की ताज़ा चाय/कॉफ़ी।\n' +
        '• **स्थानीय खासियतें**: प्रमुख स्टेशनों से क्षेत्रीय टिफ़िन पैक्स और नीर (Rail Neer) पानी बोतलें लें।';

      if (stopStr.includes('Raipur') || stopStr.includes('Durg')) {
        foodDetails =
          '• **रायपुर / दुर्ग जंक्शन**: प्रसिद्ध छत्तीसगढ़ी फरा, चीला, गर्मागर्म पोहा-जलेबी और रेलवे चाय।\n' +
          '• **स्टेशन टिप**: प्लेटफॉर्म 1 पर IRCTC फ़ूड प्लाज़ा में ताज़ा वेज/नॉन-वेज थाली मिलती है।';
      } else if (stopStr.includes('Bilaspur') || stopStr.includes('Korba')) {
        foodDetails =
          '• **बिलासपुर जंक्शन**: प्लेटफॉर्म समोसा चाट, जलेबी और ताज़ा साउथ इंडियन टिफ़िन आइटम आजमाएं।\n' +
          '• **स्टेशन टिप**: जन आहार स्टॉल पर किफायती और स्वच्छ ताज़ा खाना उपलब्ध है।';
      } else if (stopStr.includes('Nagpur')) {
        foodDetails =
          '• **नागपुर जंक्शन**: प्रसिद्ध तीखा तरी पोहा, नागपुरी संतरा बर्फी और कटलेट।\n' +
          '• **स्टेशन टिप**: प्लेटफॉर्म 1 के स्टॉल पर असली तरी पोहा मिलता है।';
      }

      return (
        `🍱 **${trainName} के लिए प्रसिद्ध स्टेशन व्यंजन और भोजन सिफारिशें**:\n\n` +
        `• **आगामी फ़ूड हॉल्ट्स**: ${stopStr}\n` +
        `${foodDetails}\n` +
        `• **जल सलाह**: तापमान ~${weather?.tempC ?? 28}°C है – आरामदायक यात्रा के लिए पीने का पानी साथ रखें।`
      );
    } else {
      let foodDetails =
        '• **Platform Snacks**: Hot samosas, fresh Poha, pakodas, and hot tea/coffee from IRCTC stalls.\n' +
        '• **Local Specialties**: Grab regional tiffin packs and packaged drinking water (Neer/Rail Neer) at major halts.';

      if (stopStr.includes('Raipur') || stopStr.includes('Durg')) {
        foodDetails =
          '• **Raipur / Durg Junction**: Famous for local Chhattisgarhi Faraa, Chila, hot Poha-Jalebi, and fresh Railway tea.\n' +
          '• **Station Tip**: IRCTC Food Plaza on Platform 1 offers hygienic South Indian & North Indian thalis.';
      } else if (stopStr.includes('Bilaspur') || stopStr.includes('Korba')) {
        foodDetails =
          '• **Bilaspur Junction**: Try platform Samosa Chat, Jalebis, and fresh South Indian tiffin items.\n' +
          '• **Station Tip**: Jan Aahar stall on Platform 1 provides budget-friendly fresh thalis.';
      }

      return (
        `🍱 **Food & Local Culinary Recommendations for ${trainName}**:\n\n` +
        `• **Upcoming Food Halts**: ${stopStr}\n` +
        `${foodDetails}\n` +
        `• **Hydration Tip**: Temperature is ~${weather?.tempC ?? 28}°C – carry bottled water for a comfortable journey.`
      );
    }
  }

  // ─── 3. Scenic & Tourism Questions ───
  if (
    p.includes('scenic') ||
    p.includes('view') ||
    p.includes('highlight') ||
    p.includes('sight') ||
    p.includes('mountain') ||
    p.includes('river') ||
    p.includes('nature') ||
    p.includes('landscape') ||
    p.includes('दृश्य') ||
    p.includes('प्राकृतिक') ||
    p.includes('पहाड़') ||
    p.includes('नदी')
  ) {
    const currentAlt = elevation?.currentElevationM ?? 180;
    const cond = weather?.condition ?? (isHi ? 'साफ़ मौसम' : 'Clear skies');

    if (isHi) {
      return (
        `🏔️ **मार्ग के प्राकृतिक दृश्य और दर्शनीय स्थल गाइड**:\n\n` +
        `• **मार्ग की सुंदरता**: ${journey ? `${journey.origin.name} से ${journey.destination.name}` : 'ट्रेन मार्ग'} के मनमोहक प्राकृतिक दृश्य।\n` +
        `• **समुद्र तल से ऊंचाई**: वर्तमान में **${currentAlt} मीटर की ऊंचाई** पर यात्रा जारी है।\n` +
        `• **नदी पुल और घाटी**: प्रमुख नदी पुलों और लहलहाते खेतों का खिड़की से शानदार नज़ारा।\n` +
        `• **मौसम की स्थिति**: वर्तमान में **${weather?.tempC ?? 26}°C (${cond})** – खिड़की की सीट से देखने के लिए आदर्श!`
      );
    } else {
      return (
        `🏔️ **Scenic Highlights & Landscape View Guide**:\n\n` +
        `• **Route Geography**: Traversing picturesque landscapes along ${journey ? `${journey.origin.name} ➔ ${journey.destination.name}` : 'the rail route'}.\n` +
        `• **Altitude Profile**: Currently traveling at **${currentAlt}m elevation** above sea level.\n` +
        `• **River Bridges & Valley Views**: Keep an eye out near major river crossings and agricultural valley stretches.\n` +
        `• **Viewing Comfort**: Current weather is **${weather?.tempC ?? 26}°C (${cond})** – excellent window-seat visibility!`
      );
    }
  }

  // ─── 4. Station Facilities Questions ───
  if (
    p.includes('facility') ||
    p.includes('facilities') ||
    p.includes('waiting') ||
    p.includes('room') ||
    p.includes('lounge') ||
    p.includes('wifi') ||
    p.includes('cloak') ||
    p.includes('platform') ||
    p.includes('toilet') ||
    p.includes('सुविधा') ||
    p.includes('वेटिंग') ||
    p.includes('कमरा') ||
    p.includes('वाई-फाई')
  ) {
    const upcomingList = upcomingStops.slice(0, 3).map((s) => `${s.name} (${s.code})`).join(', ') || (isHi ? 'अगले स्टेशन' : 'Next stations');

    if (isHi) {
      return (
        `🚉 **स्टेशन सुविधाएं और प्रतीक्षालय गाइड**:\n\n` +
        `• **आगामी प्रमुख स्टेशन**: ${upcomingList}\n` +
        `• **वेटिंग रूम**: प्रमुख जंक्शन स्टेशनों पर एसी एवं अपर क्लास प्रतीक्षालय उपलब्ध हैं।\n` +
        `• **मुफ्त वाई-फाई**: प्लेटफॉर्म पर हाई-स्पीड RailWire वाई-फाई की सुविधा है।\n` +
        `• **शौचालय व पेयजल**: पे एंड यूज़ शौचालय और IRCTC वाटर वेंडिंग मशीन (WVM) प्लेटफॉर्म पर स्थित हैं।`
      );
    } else {
      return (
        `🚉 **Station Facilities & Amenity Guide**:\n\n` +
        `• **Upcoming Halts**: ${upcomingList}\n` +
        `• **Waiting Rooms**: AC & Upper Class Waiting Rooms available at major junction stations.\n` +
        `• **Free High-Speed Wi-Fi**: RailWire Wi-Fi available at all upcoming station platforms.\n` +
        `• **Restrooms & Water**: Pay & Use restrooms and IRCTC Water Vending Machines (WVM) on main platforms.`
      );
    }
  }

  // ─── 5. Weather Questions ───
  if (
    p.includes('weather') ||
    p.includes('temp') ||
    p.includes('rain') ||
    p.includes('climate') ||
    p.includes('wind') ||
    p.includes('sun') ||
    p.includes('cold') ||
    p.includes('hot') ||
    p.includes('मौसम') ||
    p.includes('तापमान') ||
    p.includes('बारिश')
  ) {
    if (weather) {
      if (isHi) {
        return (
          `🌦️ **${weather.stationName || 'वर्तमान स्थान'} का लाइव मौसम पूर्वालोकन**:\n\n` +
          `• **तापमान**: **${weather.tempC}°C** (महसूस होता है: ${weather.feelsLikeC}°C)\n` +
          `• **स्थिति**: **${weather.condition}** | **आर्द्रता**: ${weather.humidity}% | **हवा**: ${weather.windSpeedKmh} किमी/घंटा\n` +
          `• **सलाह**: ${weather.tempC > 30 ? 'गर्म दोपहर है – खिड़की के पर्दे लगाकर रखें और पानी पिएं।' : 'सुहावना मौसम है – यात्रा का आनंद लें!'}`
        );
      } else {
        return (
          `🌦️ **Real-Time Weather Advisory for ${weather.stationName || 'Current Location'}**:\n\n` +
          `• **Temperature**: **${weather.tempC}°C** (Feels like ${weather.feelsLikeC}°C)\n` +
          `• **Condition**: **${weather.condition}** | **Humidity**: ${weather.humidity}% | **Wind**: ${weather.windSpeedKmh} km/h\n` +
          `• **Comfort Advisory**: ${weather.tempC > 30 ? 'Warm afternoon outside – keep coach window shades down during peak sun.' : 'Mild & pleasant temperatures – perfect for window seat viewing!'}`
        );
      }
    }
  }

  // ─── 6. Greeting & General Assistance ───
  if (
    p.includes('hello') ||
    p.includes('hi') ||
    p.includes('hey') ||
    p.includes('help') ||
    p.includes('who are you') ||
    p.includes('assist') ||
    p.includes('नमस्ते') ||
    p.includes('हेलो') ||
    p.includes('सहायता')
  ) {
    if (isHi) {
      return (
        `🤖 **नमस्ते! मैं RailSathi AI हूँ**, **${trainName}** के लिए आपका यात्रा साथी।\n\n` +
        `आप मुझसे पूछ सकते हैं:\n` +
        `• ⏱️ **देरी की जानकारी**: क्या देरी बढ़ेगी या घटेगी?\n` +
        `• 🍱 **भोजन सिफारिशें**: आगामी स्टेशनों के प्रसिद्ध प्लेटफॉर्म व्यंजन\n` +
        `• 🏔️ **प्राकृतिक दृश्य**: नदी पुल, पहाड़ और दर्शनीय स्थल\n` +
        `• 🚉 **स्टेशन सुविधाएं**: वेटिंग रूम, वाई-फाई और प्लेटफॉर्म जानकारी`
      );
    } else {
      return (
        `🤖 **Hello! I am RailSathi AI**, your real-time travel assistant for **${trainName}**.\n\n` +
        `I can help you with:\n` +
        `• ⏱️ **Delay Insights**: Check if delays will increase or decrease\n` +
        `• 🍱 **Food Tips**: Station delicacies & platform food recommendations\n` +
        `• 🏔️ **Scenic Spots**: River bridges, mountains & landscape view spots\n` +
        `• 🚉 **Station Facilities**: Waiting rooms, Wi-Fi & platform details`
      );
    }
  }

  // ─── 7. Default Dynamic Fallback Response ───
  if (isHi) {
    const weatherStr = weather ? `लाइव मौसम: **${weather.tempC}°C, ${weather.condition}**.` : 'लाइव मौसम ट्रैकिंग चालू।';
    const elevationStr = elevation?.currentElevationM ? ` ऊंचाई: **${elevation.currentElevationM}m**.` : '';

    return (
      `🤖 **${trainName} के लिए RailSathi AI यात्रा गाइड**:\n\n` +
      `मार्ग: **${journey?.origin.name || 'प्रारंभिक'}** से **${journey?.destination.name || 'गंतव्य'}**.\n` +
      `${weatherStr}${elevationStr}\n\n` +
      `• **लाइव स्थिति**: ट्रेन **${journey?.speedKmh ?? 80} किमी/घंटा** पर चल रही है (${journey?.delayMinutes ? `${journey.delayMinutes} मिनट विलंब` : 'समय पर'}).\n` +
      `• **अगला स्टॉप**: **${nextHalt}** (अनुमानित समय: ${journey?.ETA || 'समय पर'}).\n` +
      `• **सलाह**: ${nextHalt} पर स्थानीय स्नैक्स का आनंद लें और पर्याप्त पानी पिएं!`
    );
  } else {
    const weatherStr = weather ? `Live Weather: **${weather.tempC}°C, ${weather.condition}**.` : 'Live atmospheric tracking active.';
    const elevationStr = elevation?.currentElevationM ? ` Altitude: **${elevation.currentElevationM}m**.` : '';

    return (
      `🤖 **RailSathi AI Travel Insights for ${trainName}**:\n\n` +
      `Tracking route from **${journey?.origin.name || 'Origin'}** to **${journey?.destination.name || 'Destination'}**.\n` +
      `${weatherStr}${elevationStr}\n\n` +
      `• **Live Status**: ${journey?.status === 'running' ? 'Train is moving' : 'Train active'} at **${journey?.speedKmh ?? 80} km/h** (${journey?.delayMinutes ? `${journey.delayMinutes} mins delay` : 'On Time'}).\n` +
      `• **Next Stop**: **${nextHalt}** (ETA: ${journey?.ETA || 'On schedule'}).\n` +
      `• **Food & Comfort**: Grab local platform snacks at ${nextHalt} and stay hydrated!`
    );
  }
}

export const askRailGaadiAI = askRailSathiAI;

