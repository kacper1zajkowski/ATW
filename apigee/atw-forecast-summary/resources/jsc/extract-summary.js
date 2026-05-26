var status = context.getVariable('sc.gemini.response.status.code');
var raw = context.getVariable('sc.gemini.response.content') || '{}';

if (status != 200) {
  context.setVariable('summary.payload', JSON.stringify({
    error: 'Gemini API returned status ' + status
  }));
} else {
  var text = null;
  try {
    var data = JSON.parse(raw);
    text = data.candidates && data.candidates[0] &&
           data.candidates[0].content && data.candidates[0].content.parts &&
           data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    text = text ? text.replace(/^\s+|\s+$/g, '') : null;
  } catch (e) { text = null; }

  if (!text) {
    context.setVariable('summary.payload', JSON.stringify({ error: 'Empty Gemini response' }));
  } else {
    context.setVariable('summary.payload', JSON.stringify({ summary: text }));
  }
}
