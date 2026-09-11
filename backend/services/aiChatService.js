/**
 * Environmental AI Chatbot Service for AbhayaSetu
 * Integrates Google Gemini API (via GEMINI_API_KEY from env or user header) + Live Weather Telemetry.
 */
import { extractLocationFromQuery, getLiveWeatherData } from './weatherService.js';

export async function processEnvironmentalChat(userMessage, conversationHistory = [], userApiKey = '') {
  const message = (userMessage || '').trim();
  if (!message) {
    return { reply: "Hello! I am your AbhayaSetu Environmental Assistant. Ask me anything about weather conditions, gear recommendations, UV/AQI advice, or safety protocols!" };
  }

  const geminiApiKey = userApiKey || process.env.GEMINI_API_KEY;
  const lower = message.toLowerCase();

  // Check if message is querying weather for a location (e.g., "hows the weather in kumta")
  let locationContext = null;
  const isWeatherQuery = lower.includes('weather') || lower.includes('temp') || lower.includes('rain') || lower.includes('wind') || lower.includes('hike') || lower.includes('drive') || lower.includes('safe');

  if (isWeatherQuery) {
    try {
      const loc = await extractLocationFromQuery(message);
      const weather = await getLiveWeatherData(loc);
      locationContext = { loc, weather };
    } catch (e) {
      console.warn('Weather telemetry context lookup failed:', e.message);
    }
  }

  // 1. If Gemini API Key is provided (from .env or Chat UI key setting), call Gemini API
  if (geminiApiKey && geminiApiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      let systemInstruction = `You are AbhayaSetu AI, an expert Environmental & Safety Assistant. You help users with questions about weather, environmental conditions, outdoor gear, earthquake & flood safety, UV index, air quality, and travel advice. Keep your responses concise, helpful, clear, and professional.`;

      if (locationContext && locationContext.weather) {
        const w = locationContext.weather;
        systemInstruction += `\n\n[LIVE TELEMETRY CONTEXT]: Location: ${w.locationName}, Temp: ${w.temperatureC}°C (${w.temperatureF}°F), Wind: ${w.windSpeedKmh} km/h, Condition: ${w.condition}, Hazard Level: ${w.hazardLevel}. Use these exact live numbers when answering weather questions!`;
      }

      const contents = [
        ...conversationHistory.slice(-4).map(item => ({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        })),
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
        }
      ];

      // Try modern Gemini model endpoints
      const modelCandidates = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-3.5-flash-lite'];
      
      for (const model of modelCandidates) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
            signal: AbortSignal.timeout(20000)
          });

          if (response.ok) {
            const data = await response.json();
            const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              return {
                reply: candidateText.trim(),
                provider: `Gemini AI Live (${model})`
              };
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            console.warn(`Gemini API model ${model} error status:`, response.status, errData.error?.message || errData);
          }
        } catch (modelErr) {
          console.warn(`Gemini model ${model} failed:`, modelErr.message);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Telemetry AI Engine:', err.message);
    }
  }

  // 2. Telemetry AI Engine Fallback (Formats live weather sensor data dynamically if Gemini Key not yet entered)
  if (locationContext && locationContext.weather) {
    const w = locationContext.weather;
    return {
      reply: `🌤️ **Live Environmental Report for ${w.locationName}:**\n\n• **Temperature:** ${w.temperatureC}°C (${w.temperatureF}°F)\n• **Condition:** ${w.condition}\n• **Wind Speed:** ${w.windSpeedKmh} km/h (${w.windSpeedMph} mph)\n• **Hazard Status:** ${(w.hazardLevel || 'low').toUpperCase()}\n\n💡 *Tip: Connect your free Gemini API Key in the Chatbot settings (⚙️ icon) to enable full conversational AI!*`,
      provider: 'AbhayaSetu Live Telemetry Engine'
    };
  }

  // 3. Intelligent Local Environmental Knowledge Reply
  const reply = generateLocalEnvironmentalReply(message);
  return {
    reply,
    provider: 'AbhayaSetu Environmental AI'
  };
}

function generateLocalEnvironmentalReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes('gear') || lower.includes('pack') || lower.includes('bring') || lower.includes('clothes') || lower.includes('wear')) {
    return "🎒 **Recommended Outdoor Gear Guidelines:**\n- **High-Wind/Cold**: Layer up with windproof hardshell jacket, thermal base layers, wool socks, and polarized UV sunglasses.\n- **Rain/Storms**: Waterproof Gore-Tex jacket, dry-bag backpack liner, trail boots with aggressive rubber traction.\n- **Hot/Sunny**: Moisture-wicking shirt, broad-brim hat, SPF 50+ sunscreen, electrolyte hydration packs.\n- **Essential Safety Pack**: Satellite beacon/powerbank, first aid kit, headlamp, and offline topographic maps.";
  }

  if (lower.includes('uv') || lower.includes('sun') || lower.includes('burn') || lower.includes('sunscreen')) {
    return "☀️ **UV Index & Sun Protection Guide:**\n- **UV 0-2 (Low)**: Minimal protection needed.\n- **UV 3-5 (Moderate)**: Wear sunglasses and apply SPF 30+ sunscreen if outside for >45 mins.\n- **UV 6-7 (High)**: Wear a wide hat, UV-blocking sunglasses, and reapply SPF 50 every 2 hours.\n- **UV 8+ (Very High/Extreme)**: Avoid direct sun exposure between 10:00 AM and 4:00 PM. Seek shade and cover exposed skin.";
  }

  if (lower.includes('aqi') || lower.includes('air quality') || lower.includes('pollution') || lower.includes('smog') || lower.includes('smoke')) {
    return "🫁 **Air Quality Index (AQI) Health Advice:**\n- **0-50 (Good)**: Air quality is satisfactory; enjoy outdoor sports.\n- **51-100 (Moderate)**: Sensitive individuals should consider reducing prolonged outdoor exertion.\n- **101-150 (Unhealthy for Sensitive Groups)**: Wear N95 masks outdoors if sensitive to PM2.5.\n- **151-200+ (Unhealthy/Hazardous)**: Avoid strenuous outdoor activities. Run HEPA air purifiers indoors and close windows.";
  }

  if (lower.includes('earthquake') || lower.includes('quake') || lower.includes('tremor') || lower.includes('shake')) {
    return "⚡ **Earthquake Action Protocol:**\n1. **Drop, Cover, and Hold On**: Get down on your hands and knees under a sturdy table.\n2. **Protect Head**: Cover your head and neck with your arms.\n3. **Stay Indoors**: Do not run outside during shaking to avoid falling glass and debris.\n4. **Aftershocks**: Be prepared for secondary tremors; check gas valves if safe.";
  }

  if (lower.includes('flood') || lower.includes('water') || lower.includes('drown') || lower.includes('rain')) {
    return "🌊 **Flash Flood Survival Rule:**\n- **Turn Around, Don't Drown!**: Just 6 inches of moving water can knock you down, and 12 inches can sweep away a car.\n- **Move to High Ground**: Never camp or park near dry riverbeds or drainage basins during storm alerts.\n- **Utilities**: Shut off main power breakers if floodwaters enter your dwelling.";
  }

  if (lower.includes('hike') || lower.includes('hiking') || lower.includes('trail') || lower.includes('trek')) {
    return "🥾 **Hiking Environmental Safety Tips:**\n- Always check weather telemetry and wind forecasts before heading out.\n- Share your itinerary and expected return time with an emergency contact.\n- Turn back early if cloud cover or dark convective clouds approach ridge lines.\n- Carry at least 1 Liter of water for every 2 hours of hiking.";
  }

  return "👋 Hello! I am the **AbhayaSetu Environmental AI Assistant**.\n\nAsk me about:\n• Live weather for any location (e.g. *\"hows the weather in Kumta\"*)\n• Outdoor hiking gear & clothing recommendations\n• UV Index & Air Quality (AQI) advice\n• Flood & Earthquake survival rules\n\n💡 *Tip: Paste your Gemini API Key in the Chatbot settings (⚙️ icon) to unlock full conversational AI capabilities!*";
}
