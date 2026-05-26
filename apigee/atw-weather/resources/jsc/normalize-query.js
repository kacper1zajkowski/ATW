var q = (context.getVariable('request.queryparam.q') || '').trim();
if (!q) { throw new Error('Missing q'); }

var coords = q.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
if (coords) {
  context.setVariable('requires_geocode', false);
  context.setVariable('location.lat', parseFloat(coords[1]));
  context.setVariable('location.lon', parseFloat(coords[2]));
  context.setVariable('location.name', q);
  context.setVariable('location.country', '');
} else {
  context.setVariable('requires_geocode', true);
  context.setVariable('geocode.q', q);
}