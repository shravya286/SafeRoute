import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <span>AbhayaSetu (SafeRoute Bridge) v1.0 • Flat Safety Advisory System</span>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          Open-Meteo <ExternalLink size={12} />
        </a>
        <a href="https://earthquake.usgs.gov/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          USGS Seismic <ExternalLink size={12} />
        </a>
      </div>
    </footer>
  );
}
