import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  "Parsing natural language safety query & location intent...",
  "Querying Open-Meteo live atmospheric & wind sensors...",
  "Fetching USGS real-time seismic monitoring feed...",
  "Evaluating hazard metrics & computing risk assessment..."
];

export default function LoadingScreen({ query }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(1), 600);
    const timer2 = setTimeout(() => setActiveStep(2), 1200);
    const timer3 = setTimeout(() => setActiveStep(3), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flat-card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)' }}>Verifying Environmental Telemetry</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Processing query: "{query}"
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="step-list" style={{ marginTop: 'var(--space-2)' }}>
        {STEPS.map((stepText, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              className="step-item"
              style={{
                borderColor: isCurrent ? 'var(--accent-primary)' : 'var(--surface-alt)',
                opacity: idx > activeStep ? 0.6 : 1
              }}
            >
              <div className="step-icon">
                {isDone ? (
                  <CheckCircle2 size={18} style={{ color: '#4CAF50' }} />
                ) : isCurrent ? (
                  <Loader2 size={18} style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Circle size={18} style={{ color: 'var(--text-secondary)' }} />
                )}
              </div>
              <span style={{ fontWeight: isCurrent ? '600' : 'normal' }}>{stepText}</span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
        Connecting to Open-Meteo & USGS APIs • Strict Flat Safety Engine
      </div>
    </div>
  );
}
