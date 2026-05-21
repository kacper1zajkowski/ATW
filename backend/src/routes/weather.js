import { Router } from 'express';

const router = Router();

const WMO_CONDITIONS = {
  0:  { text: 'Clear sky',     code: 'sunny' },
  1:  { text: 'Mainly clear',  code: 'sunny' },
  2:  { text: 'Partly cloudy', code: 'partly_cloudy' },
  3:  { text: 'Overcast',      code: 'cloudy' },
  45: { text: 'Foggy',         code: 'cloudy' },
  48: { text: 'Icy fog',       code: 'cloudy' },
  51: { text: 'Light drizzle', code: 'light_rain' },
  53: { text: 'Drizzle',       code: 'light_rain' },
  55: { text: 'Heavy drizzle', code: 'light_rain' },
  61: { text: 'Light rain',    code: 'light_rain' },
  63: { text: 'Rain',          code: 'light_rain' },
  65: { text: 'Heavy rain',    code: 'heavy_rain' },
  71: { text: 'Light snow',    code: 'snow' },
  73: { text: 'Snow',          code: 'snow' },
  75: { text: 'Heavy snow',    code: 'snow' },
  80: { text: 'Rain showers',  code: 'light_rain' },
  81: { text: 'Rain showers',  code: 'light_rain' },
  82: { text: 'Heavy showers', code: 'heavy_rain' },
  95: { text: 'Thunderstorm',  code: 'thunderstorm' },
  96: { text: 'Thunderstorm',  code: 'thunderstorm' },
  99: { text: 'Thunderstorm',  code: 'thunderstorm' },
};

const UV_CATEGORIES = ['Low','Low','Low','Moderate','Moderate','Moderate','High','High','Very High','Very High','Extreme'];

function aqiCategory(aqi) {
  if (aqi <= 20) return { aqi_eu: 1, category: 'Good' };
  if (aqi <= 40) return { aqi_eu: 2, category: 'Fair' };
  if (aqi <= 60) return { aqi_eu: 3, category: 'Moderate' };
  if (aqi <= 80) return { aqi_eu: 4, category: 'Poor' };
  return { aqi_eu: 5, category: 'Very Poor' };
}

async function geocode(location) {
  const coords = location.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (coords) {
    return { name: location, country: '', lat: parseFloat(coords[1]), lon: parseFloat(coords[2]) };
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) throw new Error(`Location not found: ${location}`);
  const r = data.results[0];
  return { name: r.name, country: r.country_code ?? '', lat: r.latitude, lon: r.longitude };
}

router.get('/weather', async (req, res) => {
  const loc = typeof req.query.location === 'string' ? req.query.location.trim() : '';
  if (!loc) {
    return res.status(400).json({ error: 'Missing required query parameter: location' });
  }

  try {
    const location = await geocode(loc);

    const weatherUrl = `${process.env.APIGEE_BASE_URL}/weather/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,weather_code,uv_index,uv_index_clear_sky&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset&forecast_days=7&wind_speed_unit=kmh&timezone=auto`;
    const aqUrl = `${process.env.APIGEE_BASE_URL}/aq/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=pm10,pm2_5,nitrogen_dioxide,ozone,carbon_monoxide,european_aqi`;
    const pollenUrl = `${process.env.APIGEE_BASE_URL}/pollen?lat=${location.lat}&lng=${location.lon}`;

    const [weatherRes, aqRes, pollenRes] = await Promise.all([fetch(weatherUrl), fetch(aqUrl), fetch(pollenUrl)]);
    const [weather, aq, pollenData] = await Promise.all([weatherRes.json(), aqRes.json(), pollenRes.json()]);

    const c = weather.current;
    const d = weather.daily;
    const uvIndex = Math.round(c.uv_index ?? 0);
    const { aqi_eu, category: aqiCat } = aqiCategory(aq.current?.european_aqi ?? 0);

    const forecast = d.time.slice(1, 7).map((date, i) => ({
      date,
      temp_max_c: Math.round(d.temperature_2m_max[i + 1]),
      temp_min_c: Math.round(d.temperature_2m_min[i + 1]),
      condition: WMO_CONDITIONS[d.weather_code[i + 1]] ?? { text: 'Unknown', code: 'cloudy' },
      precipitation_prob_pct: d.precipitation_probability_max[i + 1] ?? 0,
      wind_kph: Math.round(d.wind_speed_10m_max[i + 1]),
    }));

    res.json({
      location,
      current: {
        temp_c: Math.round(c.temperature_2m),
        feels_like_c: Math.round(c.apparent_temperature),
        humidity_pct: c.relative_humidity_2m,
        wind_kph: Math.round(c.wind_speed_10m),
        wind_deg: c.wind_direction_10m,
        pressure_hpa: Math.round(c.surface_pressure),
        visibility_km: Math.round((c.visibility ?? 10000) / 1000),
        condition: WMO_CONDITIONS[c.weather_code] ?? { text: 'Unknown', code: 'cloudy' },
      },
      air_quality: {
        aqi_eu,
        category: aqiCat,
        pm2_5: +(aq.current?.pm2_5 ?? 0).toFixed(1),
        pm10: +(aq.current?.pm10 ?? 0).toFixed(1),
        no2_ugm3: +(aq.current?.nitrogen_dioxide ?? 0).toFixed(1),
        o3_ugm3: +(aq.current?.ozone ?? 0).toFixed(1),
        co_ugm3: +(aq.current?.carbon_monoxide ?? 0).toFixed(1),
      },
      uv: {
        index: uvIndex,
        max_today: Math.round(d.uv_index_max[0] ?? uvIndex),
        category: UV_CATEGORIES[Math.min(uvIndex, 10)],
        sunrise: d.sunrise[0]?.slice(11, 16) ?? '06:00',
        sunset: d.sunset[0]?.slice(11, 16) ?? '20:00',
      },
      forecast,
      pollen: pollenData.data?.[0] ? {
        grass: { risk: pollenData.data[0].Risk.grass_pollen, count: pollenData.data[0].Count.grass_pollen },
        tree:  { risk: pollenData.data[0].Risk.tree_pollen,  count: pollenData.data[0].Count.tree_pollen  },
        weed:  { risk: pollenData.data[0].Risk.weed_pollen,  count: pollenData.data[0].Count.weed_pollen  },
        species: {
          grass: pollenData.data[0].Species.Grass,
          tree:  pollenData.data[0].Species.Tree,
          weed:  pollenData.data[0].Species.Weed,
        },
      } : null,
    });
  } catch (err) {
    const notFound = err.message?.includes('not found');
    res.status(notFound ? 404 : 502).json({ error: err.message ?? 'Failed to fetch weather data' });
  }
});

router.post('/forecast-summary', async (req, res) => {
  const { location, forecast } = req.body ?? {};
  if (!location || !forecast?.length) {
    return res.status(400).json({ error: 'Missing location or forecast data' });
  }

  const days = forecast.map(d =>
    `${d.date}: ${d.condition.text}, max ${d.temp_max_c}°C, min ${d.temp_min_c}°C, rain ${d.precipitation_prob_pct}%, wind ${d.wind_kph} km/h`
  ).join('\n');

  const prompt = `You are a friendly weather assistant. Based on the 6-day forecast for ${location.name}, ${location.country}, write exactly 2 short sentences in natural language, summarizing the upcoming weather. Be concise and practical.\n\nForecast:\n${days}`;

  try {
    const geminiRes = await fetch(
      `${process.env.APIGEE_BASE_URL}/gemini/v1beta/models/gemini-3.1-flash-lite:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 256, temperature: 0.7 },
        }),
      }
    );

    const data = await geminiRes.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!summary) throw new Error('Empty response from Gemini');

    res.json({ summary });
  } catch (err) {
    res.status(502).json({ error: err.message ?? 'Failed to fetch summary' });
  }
});

export default router;
