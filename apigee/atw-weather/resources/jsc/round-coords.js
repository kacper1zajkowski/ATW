//rounding for ~1.1km diameter

var lat = parseFloat(context.getVariable('location.lat')) || 0;
var lon = parseFloat(context.getVariable('location.lon')) || 0;
context.setVariable('lat_rounded', (Math.round(lat * 100) / 100).toFixed(2));
context.setVariable('lon_rounded', (Math.round(lon * 100) / 100).toFixed(2));
