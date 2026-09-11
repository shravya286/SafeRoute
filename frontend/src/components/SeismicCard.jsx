import React from 'react';
import { Activity, AlertCircle, Layers } from 'lucide-react';

export default function SeismicCard({ seismic, t }) {
  if (!seismic) return null;

  return (
    <div className="flat-card" style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'var(--border-subtle)', paddingBottom: 'var(--space-1)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
          <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
          {t?.seismicTitle || 'Seismic Telemetry'}
        </h3>
        <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, fontWeight: '600' }}>{t?.usgsFeed || 'USGS Feed'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
        <div className="metric-box" style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)' }}>
          <div className="metric-label" style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
            <Layers size={14} /> {t?.events || 'Regional Events'}
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginTop: '4px' }}>
            {seismic.eventsCount} <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'normal', opacity: 0.8 }}>{t?.recorded || 'recorded'}</span>
          </div>
        </div>

        <div className="metric-box" style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)' }}>
          <div className="metric-label" style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
            <AlertCircle size={14} /> {t?.maxMag || 'Max Magnitude'}
          </div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginTop: '4px' }}>
            M {seismic.maxMagnitude ? seismic.maxMagnitude.toFixed(1) : '2.5'}
          </div>
        </div>
      </div>

      <div className="metric-box" style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
        <div className="metric-label" style={{ fontSize: 'var(--text-xs)', opacity: 0.8, fontWeight: '700' }}>{t?.recentEvent || 'Recent Recorded Event'}</div>
        {seismic.recentEvents && seismic.recentEvents.length > 0 ? (
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: '700', marginTop: '4px' }}>
            M{seismic.recentEvents[0].magnitude} • {seismic.recentEvents[0].place} ({new Date(seismic.recentEvents[0].time).toLocaleDateString()})
          </div>
        ) : (
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: '500', marginTop: '4px', opacity: 0.8 }}>
            {t?.noEvents || 'No major earthquakes detected in 500km radius.'}
          </div>
        )}
      </div>
    </div>
  );
}
