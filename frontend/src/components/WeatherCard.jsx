import React from 'react';
import { CloudRain, Wind, Thermometer, Compass } from 'lucide-react';

export default function WeatherCard({ weather, t }) {
  if (!weather) return null;

  return (
    <div className="flat-card" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'var(--border-subtle)', paddingBottom: 'var(--space-1)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
          <CloudRain size={18} style={{ color: 'var(--accent-primary)' }} />
          {t?.weatherTitle || 'Atmospheric Telemetry'}
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, fontWeight: '600' }}>{t?.openMeteoFeed || 'Open-Meteo Feed'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
        <div className="metric-box" style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)' }}>
          <div className="metric-label" style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
            <Thermometer size={14} /> {t?.temperature || 'Temperature'}
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginTop: '4px' }}>
            {weather.temperatureC}°C <span style={{ fontSize: 'var(--text-sm)', opacity: 0.8, fontWeight: 'normal' }}>({weather.temperatureF}°F)</span>
          </div>
        </div>

        <div className="metric-box" style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)' }}>
          <div className="metric-label" style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
            <Wind size={14} /> {t?.windSpeed || 'Wind Speed'}
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginTop: '4px' }}>
            {weather.windSpeedKmh} <span style={{ fontSize: 'var(--text-xs)' }}>km/h</span>
          </div>
        </div>
      </div>

      <div className="metric-box" style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
        <div className="metric-label" style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
          <Compass size={14} /> {t?.condition || 'Condition & Hazard Status'}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: '700', marginTop: '4px', textTransform: 'capitalize' }}>
          {weather.condition} • {(weather.hazardLevel || 'low').replace('_', ' ').toUpperCase()}
        </div>
      </div>
    </div>
  );
}
