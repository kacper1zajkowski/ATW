const KNOWN_CITIES = {
  warsaw:      { name: 'Warsaw',   country: 'PL', lat: 52.2297,  lon: 21.0122  },
  krakow:      { name: 'Kraków',   country: 'PL', lat: 50.0647,  lon: 19.9450  },
  london:      { name: 'London',   country: 'GB', lat: 51.5074,  lon: -0.1278  },
  paris:       { name: 'Paris',    country: 'FR', lat: 48.8566,  lon: 2.3522   },
  berlin:      { name: 'Berlin',   country: 'DE', lat: 52.5200,  lon: 13.4050  },
  'new york':  { name: 'New York', country: 'US', lat: 40.7128,  lon: -74.0060 },
  tokyo:       { name: 'Tokyo',    country: 'JP', lat: 35.6762,  lon: 139.6503 },
  sydney:      { name: 'Sydney',   country: 'AU', lat: -33.8688, lon: 151.2093 },
};

const CONDITIONS = [
  { text: 'Sunny',         code: 'sunny'         },
  { text: 'Partly cloudy', code: 'partly_cloudy'  },
  { text: 'Cloudy',        code: 'cloudy'         },
  { text: 'Light rain',    code: 'light_rain'     },
  { text: 'Thunderstorm',  code: 'thunderstorm'   },
];

const UV_CATEGORIES = ['Low','Low','Low','Moderate','Moderate','Moderate','High','High','Very High','Very High','Extreme'];
const AQI_LABELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

const rand    = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick    = (arr) => arr[Math.floor(Math.random() * arr.length)];

function nextDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });
}

function resolveLocation(input) {
  const coords = input.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (coords) {
    const lat = parseFloat(coords[1]);
    const lon = parseFloat(coords[2]);
    return { name: `${lat.toFixed(3)}, ${lon.toFixed(3)}`, country: '', lat, lon };
  }

  const key = input.toLowerCase().trim();
  for (const [cityKey, loc] of Object.entries(KNOWN_CITIES)) {
    if (key.includes(cityKey)) return loc;
  }

  return { name: input, country: '', lat: rand(40, 55), lon: rand(5, 25) };
}

export function buildMockResponse(locationInput) {
  const location = resolveLocation(locationInput);
  const uvIndex  = randInt(1, 9);
  const aqiEu    = randInt(1, 5);
  const now      = new Date().toISOString();

  return {
    location,
    current: {
      temp_c:        Math.round(rand(5, 30)),
      feels_like_c:  Math.round(rand(3, 28)),
      humidity_pct:  randInt(40, 90),
      wind_kph:      Math.round(rand(2, 50)),
      wind_deg:      randInt(0, 359),
      pressure_hpa:  randInt(995, 1030),
      visibility_km: randInt(5, 20),
      condition:     pick(CONDITIONS),
    },
    air_quality: {
      aqi_eu:   aqiEu,
      category: AQI_LABELS[aqiEu - 1],
      pm2_5:    +rand(1, 30).toFixed(1),
      pm10:     +rand(5, 60).toFixed(1),
      no2_ugm3: +rand(5, 50).toFixed(1),
      o3_ugm3:  +rand(40, 120).toFixed(1),
      co_ugm3:  +rand(150, 500).toFixed(1),
    },
    uv: {
      index:     uvIndex,
      max_today: Math.min(11, uvIndex + randInt(0, 2)),
      category:  UV_CATEGORIES[uvIndex],
      sunrise:   '05:28',
      sunset:    '20:47',
    },
    forecast: nextDays(6).map((date) => ({
      date,
      temp_max_c:             Math.round(rand(10, 32)),
      temp_min_c:             Math.round(rand(2, 18)),
      condition:              pick(CONDITIONS),
      precipitation_prob_pct: randInt(0, 80),
      wind_kph:               Math.round(rand(3, 40)),
    })),
    satellite: {
      lat:       location.lat,
      lon:       location.lon,
      zoom:      10,
      timestamp: now,
      source:    'mock',
    },
    _meta: {
      source:     'mock',
      fetched_at: now,
    },
  };
}
