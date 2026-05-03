import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';
import MapComponent from './MapComponent';
import { useTheme } from './ThemeContext';

function App() {
  const [city, setCity] = useState('Bucharest');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();

  // Aplică tema pe body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Funcții de încărcare pentru un oraș dat (folosite la refresh)
  const loadWeatherForCity = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setWeather(data);
      if (data.lat && data.lon) {
        setCoordinates([data.lat, data.lon]);
      } else {
        setCoordinates(null);
      }
      await saveToHistory(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  const loadForecastForCity = async (cityName) => {
    setLoadingForecast(true);
    setError('');
    try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(cityName)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setForecast(data);
        if (data.lat && data.lon) {
            setCoordinates([data.lat, data.lon]);
        }
    } catch (err) {
        setError(err.message);
        setForecast(null);
    } finally {
        setLoadingForecast(false);
    }
};

  // Încărcare automată la pornire: ultimul oraș căutat
  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      setCity(lastCity);
      loadWeatherForCity(lastCity);
      loadForecastForCity(lastCity);
    }
    // Încarcă și istoricul din CSV
    fetchHistory();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setWeather(data);
      if (data.lat && data.lon) {
        setCoordinates([data.lat, data.lon]);
      } else {
        setCoordinates(null);
      }
      // Salvează orașul în localStorage
      localStorage.setItem('lastCity', city);
      await saveToHistory(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (weatherData) => {
    try {
      await fetch('/api/save_history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: weatherData.city,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          description: weatherData.description
        })
      });
      fetchHistory();
    } catch (err) {
      console.error('Eroare la salvare istoric:', err);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/get_history');
      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Eroare la încărcare istoric:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchForecast = async () => {
    setLoadingForecast(true);
    setError('');
    try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setForecast(data);
        // Actualizează harta cu coordonatele din prognoză (dacă există)
        if (data.lat && data.lon) {
            setCoordinates([data.lat, data.lon]);
        } else {
            // Dacă din greșeală lipsesc, le poți lua din răspunsul de vreme curentă (dar facem o cerere separată)
            console.warn('Prognoza nu conține coordonate, încerc să le iau din vremea curentă...');
            const weatherRes = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
            if (weatherRes.ok) {
                const weatherData = await weatherRes.json();
                if (weatherData.lat && weatherData.lon) {
                    setCoordinates([weatherData.lat, weatherData.lon]);
                }
            }
        }
        localStorage.setItem('lastCity', city);
    } catch (err) {
        setError(err.message);
        setForecast(null);
    } finally {
        setLoadingForecast(false);
    }
};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const clearHistory = async () => {
    if (window.confirm('Sigur dorești să ștergi tot istoricul?')) {
      try {
        const response = await fetch('/api/clear_history', { method: 'DELETE' });
        if (response.ok) {
          setHistory([]);
          alert('Istoric șters cu succes!');
        } else {
          const data = await response.json();
          alert(`Eroare: ${data.error}`);
        }
      } catch (err) {
        alert('Eroare de conexiune la server');
      }
    }
  };

  const exportToCSV = () => {
    if (!history || history.length <= 1) {
      alert('Nu există date de exportat. Caută mai întâi un oraș!');
      return;
    }

    const rows = history.map(row =>
      row.map(cell => {
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    ).join('\n');

    const blob = new Blob(["\uFEFF" + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'istoric_vreme.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vremea în orașul tău</h1>
        <div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Numele orașului"
            style={{ marginRight: '10px', padding: '8px', fontSize: '16px' }}
          />
          <button onClick={fetchWeather} disabled={loading} style={{ marginRight: '10px' }}>
            {loading ? 'Se încarcă...' : 'Vezi vremea curentă'}
          </button>
          <button onClick={fetchForecast} disabled={loadingForecast} style={{ marginRight: '10px' }}>
            {loadingForecast ? 'Se încarcă...' : 'Prognoză 5 zile'}
          </button>
          <button onClick={fetchHistory} disabled={loadingHistory}>
            {loadingHistory ? 'Se încarcă...' : 'Vezi istoric căutări'}
          </button>
          <button onClick={toggleTheme} style={{ marginLeft: '10px', backgroundColor: isDarkMode ? '#f0f0f0' : '#333', color: isDarkMode ? '#333' : '#f0f0f0' }}>
            {isDarkMode ? '☀️ Mod Light' : '🌙 Mod Dark'}
          </button>
        </div>

        {error && <p style={{ color: '#ff6b6b' }}>❌ {error}</p>}

        {weather && (
          <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '12px', color: '#333', textAlign: 'left', width: '300px' }}>
            <h2>{weather.city}</h2>
            <p><strong>🌡️ Temperatură:</strong> {weather.temperature}°C</p>
            <p><strong>💧 Umiditate:</strong> {weather.humidity}%</p>
            <p><strong>⏲️ Presiune:</strong> {weather.pressure} hPa</p>
            <p><strong>🌥️ Descriere:</strong> {weather.description}</p>
            <p><strong>💨 Vânt:</strong> {weather.wind_speed} m/s</p>
            {weather.icon && <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="icon vreme" />}
          </div>
        )}

        {coordinates && (
          <div style={{ marginTop: '30px', width: '90%', maxWidth: '800px' }}>
            <MapComponent center={coordinates} zoom={10} />
          </div>
        )}

        {forecast && (
          <div style={{ marginTop: '30px', width: '90%', maxWidth: '1000px' }}>
            <h2>Prognoză 5 zile pentru {forecast.city}</h2>
            <div style={{ backgroundColor: '#f5f5f5', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
              <h3 style={{ color: '#333' }}>Evoluția temperaturii și umidității</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecast.forecast.map(day => ({
                  name: formatDate(day.date),
                  temperatură: day.temperature,
                  umiditate: day.humidity
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#333" />
                  <YAxis yAxisId="left" stroke="#333" />
                  <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                  <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temperatură" stroke="#ff7300" strokeWidth={2} dot={{ r: 5 }} name="Temperatură (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="umiditate" stroke="#82ca9d" strokeWidth={2} dot={{ r: 5 }} name="Umiditate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
              {forecast.forecast.map((day, idx) => (
                <div key={idx} style={{ backgroundColor: '#e0e0e0', padding: '15px', borderRadius: '12px', color: '#333', width: '150px', textAlign: 'center' }}>
                  <strong>{formatDate(day.date)}</strong>
                  <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="icon" />
                  <p>{day.temperature}°C</p>
                  <p>{day.description}</p>
                  <p>💧 {day.humidity}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: '30px', width: '90%', maxWidth: '800px', backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ margin: 0 }}>Istoric căutări</h2>
              <div>
                <button onClick={exportToCSV} style={{ backgroundColor: '#28a745', marginRight: '10px', padding: '8px 16px', fontSize: '14px' }}>
                  📥 Export CSV
                </button>
                <button onClick={clearHistory} style={{ backgroundColor: '#dc3545', padding: '8px 16px', fontSize: '14px' }}>
                  🗑️ Șterge tot
                </button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #61dafb' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Timestamp</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Oraș</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Temp(°C)</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Umiditate(%)</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Descriere</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(1).map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #555' }}>
                    <td style={{ padding: '8px' }}>{row[0]}</td>
                    <td style={{ padding: '8px' }}>{row[1]}</td>
                    <td style={{ padding: '8px' }}>{row[2]}</td>
                    <td style={{ padding: '8px' }}>{row[3]}</td>
                    <td style={{ padding: '8px' }}>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;