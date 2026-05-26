var body = JSON.parse(context.getVariable('request.content') || '{}');
var loc = body.location || {};
var forecast = body.forecast || [];

if (!loc.name || !forecast.length) {
  throw new Error('Missing location or forecast in request body');
}

var days = [];
for (var i = 0; i < forecast.length; i++) {
  var d = forecast[i];
  days.push(d.date + ': ' + d.condition.text + ', max ' + d.temp_max_c +
    '°C, min ' + d.temp_min_c + '°C, rain ' + d.precipitation_prob_pct +
    '%, wind ' + d.wind_kph + ' km/h');
}

var prompt = 'You are a friendly weather assistant. Based on the 6-day forecast for ' +
  loc.name + ', ' + (loc.country || '') +
  ', write exactly 2 short sentences in natural language, summarizing the upcoming weather. ' +
  'Be concise and practical. Involve location name in sentences, city or land or area\n\n' +
  'Forecast:\n' + days.join('\n');

var geminiBody = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { maxOutputTokens: 256, temperature: 0.7 }
};

context.setVariable('gemini.body', JSON.stringify(geminiBody));
