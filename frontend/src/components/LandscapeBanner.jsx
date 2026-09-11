import React from 'react';
import { Radio, CloudRain, Activity, ShieldCheck } from 'lucide-react';

export default function LandscapeBanner({ t }) {
  return (
    <div className="hero-landscape-bg">
      {/* Background SVG Mountain Graphic */}
      <svg className="hero-landscape-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <rect width="800" height="600" fill="#CCC1BC" />

        {/* Sun & Weather Atmosphere */}
        <circle cx="240" cy="160" r="60" fill="#EFE7E0" opacity="0.8" />
        <circle cx="240" cy="160" r="46" fill="#F7F4F1" />

        {/* Clouds */}
        <path d="M 100 200 Q 130 170 170 185 Q 210 160 250 185 Q 280 170 310 200 Z" fill="#F7F4F1" opacity="0.8" />

        {/* Mountain Silhouettes */}
        <polygon points="0,600 160,240 340,420 520,200 680,400 800,220 800,600" fill="#71889F" />
        <polygon points="160,240 200,300 140,300" fill="#F7F4F1" opacity="0.8" />
        <polygon points="520,200 560,260 480,260" fill="#F7F4F1" opacity="0.8" />

        {/* Midground Hills */}
        <path d="M 0 400 Q 200 320 420 410 T 800 360 L 800 600 L 0 600 Z" fill="#8CA0BC" opacity="0.85" />

        {/* Foreground Slope Wave */}
        <path d="M 0 500 Q 300 420 600 520 T 800 480 L 800 600 L 0 600 Z" fill="#4A3D40" opacity="0.9" />
      </svg>

      {/* Hero Overlay Content */}
      <div className="hero-landscape-content">
        <div className="hero-tag-badge">
          <Radio size={14} style={{ color: '#4CAF50' }} />
          <span>Real-Time Environmental Protection</span>
        </div>

        <h1 className="hero-title">
          AbhayaSetu SafeRoute
        </h1>

        <p className="hero-description">
          AI-driven natural language safety advisory transforming atmospheric & seismic feeds into verified risk assessments.
        </p>

        {/* Status Tickers */}
        <div className="hero-tickers">
          <div className="hero-ticker-chip">
            <CloudRain size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>Open-Meteo Weather</span>
          </div>

          <div className="hero-ticker-chip">
            <Activity size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>USGS Seismic Grid</span>
          </div>

          <div className="hero-ticker-chip">
            <ShieldCheck size={14} style={{ color: '#4CAF50' }} />
            <span>Verified Safety</span>
          </div>
        </div>
      </div>
    </div>
  );
}
