import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (color) => new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const icons = {
  High: createIcon('#ef4444'),
  Medium: createIcon('#f97316'),
  Low: createIcon('#22c55e'),
  default: createIcon('#0f766e'),
};

function FitBounds({ errands }) {
  const map = useMap();
  useEffect(() => {
    if (errands.length > 0) {
      const bounds = L.latLngBounds(errands.map(e => [e.latitude, e.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [errands, map]);
  return null;
}

export function BrowseMap({ errands }) {
  return (
    <MapContainer center={[12.97, 77.59]} zoom={12} className="w-full h-[400px] rounded-xl z-0" scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds errands={errands} />
      {errands.map(e => (
        <Marker key={e.id} position={[e.latitude, e.longitude]} icon={icons[e.urgency] || icons.default}>
          <Popup>
            <div className="text-sm">
              <strong className="text-gray-900">{e.title}</strong><br />
              <span className="text-primary font-semibold">₹{e.reward}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function SingleMarker({ position, icon }) {
  const map = useMap();
  useEffect(() => {
    const marker = L.marker(position, { icon }).addTo(map);
    map.setView(position, 14);
    return () => { map.removeLayer(marker); };
  }, [map, position, icon]);
  return null;
}

export function SingleErrandMap({ latitude, longitude }) {
  return (
    <MapContainer center={[latitude, longitude]} zoom={14} className="w-full h-[250px] rounded-xl z-0" scrollWheelZoom={false} zoomControl={false} dragging={false} doubleClickZoom={false} touchZoom={false} keyboard={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SingleMarker position={[latitude, longitude]} icon={icons.default} />
    </MapContainer>
  );
}

function DraggableMarkerInner({ position, onDrag }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = L.marker(position, { icon: icons.default, draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const latlng = markerRef.current.getLatLng();
        onDrag(latlng.lat, latlng.lng);
      });
    } else {
      markerRef.current.setLatLng(position);
    }
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [position]);

  return null;
}

export function DraggableMap({ position, onDrag }) {
  return (
    <MapContainer center={position} zoom={14} className="w-full h-[250px] rounded-xl z-0" scrollWheelZoom={true}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DraggableMarkerInner position={position} onDrag={onDrag} />
    </MapContainer>
  );
}
