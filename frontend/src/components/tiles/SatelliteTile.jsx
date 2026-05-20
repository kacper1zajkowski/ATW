import { Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BaseTile } from './BaseTile';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function SatelliteTile({ satellite, location, index }) {
  return (
    <BaseTile
      title="Map view"
      icon={<Globe size={14} className="text-violet-400" />}
      accentColor="border-l-violet-500"
      index={index}
    >
      <div className="overflow-hidden rounded-xl" style={{ height: 192 }}>
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={satellite.zoom}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lon]} />
        </MapContainer>
      </div>
      <p className="mt-2 truncate text-xs text-slate-500">
        {satellite.source} · {new Date(satellite.timestamp).toLocaleDateString()}
      </p>
    </BaseTile>
  );
}
