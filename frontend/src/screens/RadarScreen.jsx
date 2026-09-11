import React, { useState } from 'react';
import { Globe, RefreshCw } from 'lucide-react';
import WeatherCard from '../components/WeatherCard';
import SeismicCard from '../components/SeismicCard';

export default function RadarScreen({ t }) {
  const [loading, setLoading] = useState(false);
  const [telemetryData, setTelemetryData] = useState({
    weather: {
      locationName: 'San Francisco Bay Area',
      temperatureC: 18,
      temperatureF: 64,
      windSpeedKmh: 22,
      windSpeedMph: 14,
      condition: 'Partly Cloudy',
      hazardLevel: 'low'
    },
    seismic: {
      eventsCount: 3,
      maxMagnitude: 3.2,
      recentEvents: [
        { magnitude: 3.2, place: '42 km W of San Jose, CA', time: new Date().toISOString() },
        { magnitude: 2.7, place: '18 km E of Berkeley, CA', time: new Date(Date.now() - 86400000).toISOString() }
      ]
    }
  });

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} className="slide-page">
      {/* Control Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button type="button" className="btn-secondary" onClick={handleRefresh} disabled={loading} style={{ background: '#382A1C', color: '#FFF', borderColor: '#4A3D40' }}>
          <RefreshCw size={14} className={loading ? 'spin-slow' : ''} />
          {t?.refreshBtn || 'Refresh'}
        </button>
      </div>

      {/* Sensor Metrics Overview (Responsive Grid) */}
      <div className="telemetry-grid">
        <WeatherCard weather={telemetryData.weather} t={t} />
        <SeismicCard seismic={telemetryData.seismic} t={t} />
      </div>

      {/* Regional Radar Station Status */}
      <div className="flat-card" style={{ backgroundColor: '#382A1C', color: '#F7F4F1', borderColor: '#4A3D40' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF' }}>
          <Globe size={16} style={{ color: 'var(--accent-primary-hover)' }} />
          {t?.globalFeedStatus || 'Global Environmental Feed Status'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <div style={{ background: '#2D2325', border: '1px solid #4A3D40', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: '#CCC1BC', fontWeight: '700' }}>{t?.openMeteoApi || 'Open-Meteo API'}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '800', color: '#4CAF50', marginTop: '4px' }}>{t?.onlineStatus || '● ONLINE'}</div>
          </div>

          <div style={{ background: '#2D2325', border: '1px solid #4A3D40', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: '#CCC1BC', fontWeight: '700' }}>{t?.usgsSeismic || 'USGS Seismic'}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '800', color: '#4CAF50', marginTop: '4px' }}>{t?.activeStatus || '● ACTIVE'}</div>
          </div>

          <div style={{ background: '#2D2325', border: '1px solid #4A3D40', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: '#CCC1BC', fontWeight: '700' }}>{t?.wmoHazardSync || 'WMO Hazard Sync'}</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: '800', color: 'var(--accent-primary-hover)', marginTop: '4px' }}>{t?.readyStatus || 'READY'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
