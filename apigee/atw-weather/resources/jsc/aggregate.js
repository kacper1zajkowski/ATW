var WMO = {
  0:{text:'Clear sky',code:'sunny'}, 1:{text:'Mainly clear',code:'sunny'},
  2:{text:'Partly cloudy',code:'partly_cloudy'}, 3:{text:'Overcast',code:'cloudy'},
  45:{text:'Foggy',code:'cloudy'}, 48:{text:'Icy fog',code:'cloudy'},
  51:{text:'Light drizzle',code:'light_rain'}, 53:{text:'Drizzle',code:'light_rain'},
  55:{text:'Heavy drizzle',code:'light_rain'}, 61:{text:'Light rain',code:'light_rain'},
  63:{text:'Rain',code:'light_rain'}, 65:{text:'Heavy rain',code:'heavy_rain'},
  71:{text:'Light snow',code:'snow'}, 73:{text:'Snow',code:'snow'},
  75:{text:'Heavy snow',code:'snow'}, 80:{text:'Rain showers',code:'light_rain'},
  81:{text:'Rain showers',code:'light_rain'}, 82:{text:'Heavy showers',code:'heavy_rain'},
  95:{text:'Thunderstorm',code:'thunderstorm'}, 96:{text:'Thunderstorm',code:'thunderstorm'},
  99:{text:'Thunderstorm',code:'thunderstorm'}
};
var UV = ['Low','Low','Low','Moderate','Moderate','Moderate','High','High','Very High','Very High','Extreme'];

function wmo(code) { return WMO[code] || {text:'Unknown',code:'cloudy'}; }

function aqiCategory(aqi) {
  if (aqi <= 20) return { aqi_eu: 1, category: 'Good' };
  if (aqi <= 40) return { aqi_eu: 2, category: 'Fair' };
  if (aqi <= 60) return { aqi_eu: 3, category: 'Moderate' };
  if (aqi <= 80) return { aqi_eu: 4, category: 'Poor' };
  return { aqi_eu: 5, category: 'Very Poor' };
}

function parseAirQuality() {
  var status = context.getVariable('sc.air-quality.response.status.code');
  if (status != 200) return null;
  var raw = context.getVariable('sc.air-quality.response.content');
  if (!raw) return null;
  try {
    var aq = JSON.parse(raw).current || {};
    var cat = aqiCategory(aq.european_aqi || 0);
    return {
      aqi_eu: cat.aqi_eu,
      category: cat.category,
      pm2_5: +(aq.pm2_5 || 0).toFixed(1),
      pm10: +(aq.pm10 || 0).toFixed(1),
      no2_ugm3: +(aq.nitrogen_dioxide || 0).toFixed(1),
      o3_ugm3: +(aq.ozone || 0).toFixed(1),
      co_ugm3: +(aq.carbon_monoxide || 0).toFixed(1)
    };
  } catch (e) { return null; }
}

var MOON_PHASES = {
  'NEW_MOON':        { index: 0, name: 'New Moon' },
  'WAXING_CRESCENT': { index: 1, name: 'Waxing Crescent' },
  'FIRST_QUARTER':   { index: 2, name: 'First Quarter' },
  'WAXING_GIBBOUS':  { index: 3, name: 'Waxing Gibbous' },
  'FULL_MOON':       { index: 4, name: 'Full Moon' },
  'WANING_GIBBOUS':  { index: 5, name: 'Waning Gibbous' },
  'LAST_QUARTER':    { index: 6, name: 'Last Quarter' },
  'THIRD_QUARTER':   { index: 6, name: 'Last Quarter' },
  'WANING_CRESCENT': { index: 7, name: 'Waning Crescent' }
};

function moonAge(phaseIndex, illumination) {
  var half = 29.53 / 2;
  if (phaseIndex <= 4) return Math.round((illumination / 100) * half);
  return Math.round(half + (1 - illumination / 100) * half);
}

function parsePollen() {
  var status = context.getVariable('sc.pollen.response.status.code');
  if (status != 200) return null;
  var raw = context.getVariable('sc.pollen.response.content');
  if (!raw) return null;
  try {
    var arr = JSON.parse(raw).data;
    if (!arr || !arr.length) return null;
    var p = arr[0];
    if (!p.Risk || !p.Count) return null;
    var result = {
      grass: { risk: p.Risk.grass_pollen, count: p.Count.grass_pollen },
      tree:  { risk: p.Risk.tree_pollen,  count: p.Count.tree_pollen  },
      weed:  { risk: p.Risk.weed_pollen,  count: p.Count.weed_pollen  },
      species: null
    };
    if (p.Species) {
      result.species = { grass: p.Species.Grass, tree: p.Species.Tree, weed: p.Species.Weed };
    }
    return result;
  } catch (e) { return null; }
}

function parseMoon() {
  var status = context.getVariable('sc.astronomy.response.status.code');
  if (status != 200) return null;
  var raw = context.getVariable('sc.astronomy.response.content');
  if (!raw) return null;
  try {
    var data = JSON.parse(raw);
    if (!data.astronomy) return null;
    var a = data.astronomy;
    var phase = MOON_PHASES[a.moon_phase] || MOON_PHASES.NEW_MOON;
    var illumination = parseFloat(a.moon_illumination_percentage) || 0;
    return {
      phaseIndex: phase.index,
      phaseName: phase.name,
      illumination: Math.round(illumination),
      age: moonAge(phase.index, illumination),
      moonrise: a.moonrise,
      moonset: a.moonset
    };
  } catch (e) { return null; }
}

var w = JSON.parse(context.getVariable('sc.weather.response.content') || '{}');
var c = w.current || {};
var d = w.daily || {};
var time = d.time || [];

var uvIndex = Math.round(c.uv_index || 0);

var forecast = [];
for (var i = 1; i < Math.min(7, time.length); i++) {
  forecast.push({
    date: time[i],
    temp_max_c: Math.round(d.temperature_2m_max[i]),
    temp_min_c: Math.round(d.temperature_2m_min[i]),
    condition: wmo(d.weather_code[i]),
    precipitation_prob_pct: d.precipitation_probability_max[i] || 0,
    wind_kph: Math.round(d.wind_speed_10m_max[i])
  });
}

var sunrise = (d.sunrise && d.sunrise[0]) ? d.sunrise[0].substring(11, 16) : '06:00';
var sunset = (d.sunset && d.sunset[0]) ? d.sunset[0].substring(11, 16) : '20:00';

var payload = {
  location: {
    name: context.getVariable('location.name') || 'Unknown',
    country: context.getVariable('location.country') || '',
    lat: parseFloat(context.getVariable('location.lat')) || 0,
    lon: parseFloat(context.getVariable('location.lon')) || 0
  },
  current: {
    temp_c: Math.round(c.temperature_2m || 0),
    feels_like_c: Math.round(c.apparent_temperature || 0),
    humidity_pct: c.relative_humidity_2m || 0,
    wind_kph: Math.round(c.wind_speed_10m || 0),
    wind_deg: c.wind_direction_10m || 0,
    pressure_hpa: Math.round(c.surface_pressure || 0),
    visibility_km: Math.round((c.visibility || 10000) / 1000),
    condition: wmo(c.weather_code)
  },
  air_quality: parseAirQuality(),
  uv: {
    index: uvIndex,
    max_today: Math.round((d.uv_index_max && d.uv_index_max[0]) || uvIndex),
    category: UV[Math.min(uvIndex, 10)],
    sunrise: sunrise,
    sunset: sunset
  },
  forecast: forecast,
  pollen: parsePollen(),
  moon: parseMoon()
};

context.setVariable('aggregated.payload', JSON.stringify(payload));
