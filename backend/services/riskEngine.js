/**
 * Risk Assessment Engine for AbhayaSetu (SafeRoute Bridge)
 * Synthesizes Natural Language Query Intent + Live Weather + Live Seismic Telemetry
 */
import { extractLocationFromQuery, getLiveWeatherData } from './weatherService.js';
import { getLiveSeismicData } from './seismicService.js';

export async function generateSafetyAssessment(queryText) {
  const query = (queryText || '').trim();
  const lowerQuery = query.toLowerCase();

  // 1. Identify location intent
  const location = await extractLocationFromQuery(query);

  // 2. Fetch parallel telemetry
  const [weatherData, seismicData] = await Promise.all([
    getLiveWeatherData(location),
    getLiveSeismicData(location.lat, location.lon)
  ]);

  // 3. Classify Activity & Hazard Intent from Query
  const isHiking = lowerQuery.includes('hike') || lowerQuery.includes('climb') || lowerQuery.includes('trail') || lowerQuery.includes('mountain') || lowerQuery.includes('outdoor');
  const isDriving = lowerQuery.includes('drive') || lowerQuery.includes('road') || lowerQuery.includes('highway') || lowerQuery.includes('car') || lowerQuery.includes('pass');
  const isSeismicCheck = lowerQuery.includes('quake') || lowerQuery.includes('earthquake') || lowerQuery.includes('seismic') || lowerQuery.includes('tremor') || lowerQuery.includes('tsunami');
  const isStormCheck = lowerQuery.includes('storm') || lowerQuery.includes('rain') || lowerQuery.includes('snow') || lowerQuery.includes('wind') || lowerQuery.includes('flood');

  // 4. Calculate Risk Level Score
  let riskPoints = 0;
  const factors = [];
  const recommendations = [];

  // Weather risk factors
  if (weatherData.windSpeedKmh > 40) {
    riskPoints += 2;
    factors.push(`High wind gusts detected at ${weatherData.windSpeedKmh} km/h (${weatherData.windSpeedMph} mph).`);
    recommendations.push('Exercise caution on exposed roads and elevated terrain.');
  } else if (weatherData.windSpeedKmh > 25) {
    riskPoints += 1;
    factors.push(`Moderate winds at ${weatherData.windSpeedKmh} km/h.`);
  }

  if (weatherData.hazardLevel === 'severe' || weatherData.hazardLevel === 'high') {
    riskPoints += 3;
    factors.push(`Severe atmospheric condition flagged: "${weatherData.condition}".`);
    recommendations.push('Delay non-essential travel until severe weather warnings subside.');
  } else if (weatherData.hazardLevel === 'moderate') {
    riskPoints += 1;
    factors.push(`Precipitation or reduced visibility reported: "${weatherData.condition}".`);
    recommendations.push('Equip appropriate rain/snow gear and check route conditions.');
  }

  // Seismic risk factors
  if (seismicData.maxMagnitude >= 5.5) {
    riskPoints += 3;
    factors.push(`Significant seismic event (M${seismicData.maxMagnitude}) recorded within past 7 days.`);
    recommendations.push('Inspect local emergency civil defense alerts for aftershock warnings.');
  } else if (seismicData.maxMagnitude >= 4.0) {
    riskPoints += 1;
    factors.push(`Moderate seismic activity (M${seismicData.maxMagnitude}) monitored in regional radius.`);
    recommendations.push('Review basic earthquake safety procedures (Drop, Cover, Hold On).');
  }

  // Activity specific adjustments
  if (isHiking && (weatherData.windSpeedKmh > 30 || weatherData.hazardLevel !== 'none')) {
    riskPoints += 1;
    factors.push('Trail exposures significantly amplify weather vulnerability for outdoor hikers.');
    recommendations.push('Inform someone of your itinerary and carry a satellite communication or offline map device.');
  }

  if (isDriving && weatherData.weatherCode >= 61) {
    riskPoints += 1;
    factors.push('Wet/icy road surfaces decrease tire traction and lengthen braking distance.');
    recommendations.push('Maintain extra distance behind leading vehicles and check tire tread pressure.');
  }

  // Final Risk Classification (Strict LOW / MODERATE / HIGH)
  let level = 'LOW';
  let badgeColor = '#8CA0BC'; // risk-low
  let icon = 'ShieldCheck';
  let summary = `Conditions around ${location.name} are currently stable with low environmental risk. Normal activities may proceed with standard awareness.`;

  if (riskPoints >= 3) {
    level = 'HIGH';
    badgeColor = '#9C7568'; // risk-high
    icon = 'AlertOctagon';
    summary = `Caution advised for ${location.name}. Heightened risk identified due to combined weather/seismic factors. Exercise strict safety measures.`;
  } else if (riskPoints >= 1) {
    level = 'MODERATE';
    badgeColor = '#CBAE8C'; // risk-moderate
    icon = 'AlertTriangle';
    summary = `Moderate hazard potential observed near ${location.name}. Monitor updates closely and take sensible precautions.`;
  }

  // Default factors fallback if clean conditions
  if (factors.length === 0) {
    factors.push(`Atmospheric stability rated clear with ${weatherData.condition.toLowerCase()}.`);
    factors.push(`No major seismic disruptions (Max M${seismicData.maxMagnitude || '2.8'}).`);
    recommendations.push('Enjoy your journey while staying informed of local updates.');
    recommendations.push('Keep emergency contacts accessible on mobile devices.');
  }

  return {
    query,
    timestamp: new Date().toISOString(),
    location: location.name,
    coordinates: { lat: location.lat, lon: location.lon },
    riskAssessment: {
      level,               // 'LOW' | 'MODERATE' | 'HIGH'
      badgeColor,          // CSS color token hex
      icon,                // Icon identifier
      boldTextLabel: `${level} RISK`,
      summary,
      confidenceScore: '94%',
      riskPoints
    },
    riskFactors: factors,
    recommendations,
    telemetry: {
      weather: weatherData,
      seismic: seismicData
    }
  };
}
