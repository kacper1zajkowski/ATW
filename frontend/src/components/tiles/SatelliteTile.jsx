import { useEffect } from 'react';
import { Globe } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BaseTile } from './BaseTile';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

export function SatelliteTile({ location, index }) {
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
          zoom={10}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <Marker position={[location.lat, location.lon]} />
          <MapUpdater lat={location.lat} lon={location.lon} />
        </MapContainer>
      </div>
    </BaseTile>
  );
}
