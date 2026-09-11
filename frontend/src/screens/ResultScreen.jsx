import React, { useState } from 'react';
import RiskBadge from '../components/RiskBadge';
import WeatherCard from '../components/WeatherCard';
import SeismicCard from '../components/SeismicCard';
import RescuerHelpGroupCard from '../components/RescuerHelpGroupCard';
import { RotateCcw, MapPin, Share2, Check, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ResultScreen({ assessment, onReset, t }) {
  const [copied, setCopied] = useState(false);

  if (!assessment) return null;

  const { query, location, coordinates, riskAssessment, riskFactors, recommendations, telemetry, timestamp } = assessment;

  const handleShare = () => {
    const text = `AbhayaSetu Risk Assessment for "${location}": ${riskAssessment.boldTextLabel}. Verified via Open-Meteo & USGS telemetry.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Action Buttons Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" className="btn-secondary" onClick={onReset}>
          <RotateCcw size={14} /> {t.askAnother}
        </button>

        <button type="button" className="btn-secondary" onClick={handleShare}>
          {copied ? <Check size={14} style={{ color: '#4CAF50' }} /> : <Share2 size={14} />}
          {copied ? 'Copied' : t.shareAssessment}
        </button>
      </div>

      {/* Main Assessment Flat Card */}
      <div className="flat-card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              <MapPin size={14} style={{ color: 'var(--accent-primary)' }} /> {location}
            </div>
            <h1 style={{ fontSize: 'var(--text-lg)', marginTop: '4px', lineHeight: '1.3', fontWeight: '800' }}>
              "{query}"
            </h1>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Verified: {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {t.confidenceLabel || 'Confidence'}: {riskAssessment.confidenceScore}
            </div>
          </div>

          <RiskBadge level={riskAssessment.level} customLabel={riskAssessment.boldTextLabel} />
        </div>

        {/* Executive Summary */}
        <div style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px', letterSpacing: '0.04em' }}>
            {t.execSummary}
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {riskAssessment.summary}
          </p>
        </div>

        {/* Identified Risk Factors */}
        <div style={{ marginTop: 'var(--space-2)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-1)' }}>
            <AlertCircle size={16} style={{ color: 'var(--accent-primary)' }} />
            {t.identifiedFactors}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {riskFactors && riskFactors.map((factor, idx) => (
              <li key={idx} style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.5' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: riskAssessment.badgeColor, flexShrink: 0 }} />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div style={{ marginTop: 'var(--space-2)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-1)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-primary)' }} />
            {t.recommendedMeasures}
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendations && recommendations.map((rec, idx) => (
              <li key={idx} style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.5' }}>
                <span style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>{idx + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* EMERGENCY RESCUER DISPATCH & COMMUNITY HELP GROUP PANEL */}
      <RescuerHelpGroupCard
        location={location}
        coordinates={coordinates}
        riskAssessment={riskAssessment}
        query={query}
        t={t}
      />

      {/* Live Telemetry Grid */}
      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginTop: 'var(--space-1)' }}>
        {t.weatherTitle} & {t.seismicTitle}
      </h2>
      <div className="telemetry-grid">
        <WeatherCard weather={telemetry?.weather} t={t} />
        <SeismicCard seismic={telemetry?.seismic} t={t} />
      </div>
    </div>
  );
}
