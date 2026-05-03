import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Rezolvă o problemă cunoscută cu imaginile marker-ului implicit în Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componenta noastră pentru hartă
function MapComponent({ center, zoom }) {
  if (!center) {
    return <p>Introdu un oraș pentru a vedea harta...</p>;
  }
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>
          Coordonate: {center[0]}, {center[1]}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;