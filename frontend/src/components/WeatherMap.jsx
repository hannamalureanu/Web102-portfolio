import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Rezolvă problema iconițelor Leaflet în Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const locations = [
  { name: "București", lat: 44.4268, lon: 26.1025 },
  { name: "Câmpulung", lat: 45.2667, lon: 25.05 },
  { name: "Ploiești", lat: 44.9367, lon: 26.0225 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Orléans", lat: 47.9025, lon: 1.9090 },
  { name: "Toulouse", lat: 43.6045, lon: 1.4442 }
];

const WeatherMap = () => {
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCity, setActiveCity] = useState(null);

  const fetchWeather = async (lat, lon, cityName) => {
    setLoading(true);
    setActiveCity(cityName);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setSelectedWeather({ name: cityName, ...data });
    } catch (err) {
      console.error(err);
      setSelectedWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const closeWeather = () => {
    setSelectedWeather(null);
    setActiveCity(null);
  };

  return (
    <section className="weathermap-section">
      <div className="container">
        <h2>Harta noastră – vremea în locații importante</h2>
        <MapContainer center={[46.0, 25.0]} zoom={6} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map(loc => (
            <Marker
              key={loc.name}
              position={[loc.lat, loc.lon]}
              eventHandlers={{
                click: () => fetchWeather(loc.lat, loc.lon, loc.name)
              }}
            >
              <Popup>
                <strong>{loc.name}</strong>
                {loading && activeCity === loc.name && <p>Se încarcă vremea...</p>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {selectedWeather && (
          <div className="weather-popup">
            <button className="close-weather-btn" onClick={closeWeather}>✕</button>
            <h3>Vremea în {selectedWeather.name}</h3>
            <div className="weather-details">
              <p>🌡️ Temperatură: <strong>{selectedWeather.temperature}°C</strong></p>
              <p>💧 Umiditate: {selectedWeather.humidity}%</p>
              <p>🌥️ {selectedWeather.description}</p>
              <p>💨 Vânt: {selectedWeather.wind_speed} m/s</p>
              {selectedWeather.icon && (
                <img src={`https://openweathermap.org/img/wn/${selectedWeather.icon}@2x.png`} alt="icon" />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeatherMap;