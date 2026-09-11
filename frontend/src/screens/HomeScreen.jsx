import React, { useState, useEffect } from 'react';
import { Search, Compass, ShieldAlert, ArrowRight, Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

export default function HomeScreen({ onSubmitQuery, t, lang }) {
  const [queryInput, setQueryInput] = useState('');
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechToText(
    lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : lang === 'ja' ? 'ja-JP' : lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US'
  );

  useEffect(() => {
    if (transcript) {
      setQueryInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSubmitQuery(queryInput);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const samplePresets = [
    t.preset1,
    t.preset2,
    t.preset3,
    t.preset4
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Query Form Flat Card */}
      <div className="flat-card" style={{ padding: 'var(--space-4)', background: 'rgba(239, 231, 224, 0.96)', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--accent-primary)', fontSize: 'var(--text-xs)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Compass size={16} /> {t.heroBadge}
        </div>

        <h2 style={{ fontSize: 'var(--text-lg)', marginTop: 'var(--space-1)', marginBottom: '6px', fontWeight: '800', lineHeight: '1.3' }}>
          {t.heroTagline}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)', lineHeight: '1.6' }}>
          {t.heroDescription}
        </p>

        {/* Natural Language Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-textarea"
              placeholder={t.placeholder}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              rows={3}
            />

            {isListening && (
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', fontSize: 'var(--text-xs)', color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                <Volume2 size={14} className="spin-slow" /> {t.listening}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-1)' }}>
            {/* Voice Input Mic Button */}
            <button
              type="button"
              className={`btn-mic ${isListening ? 'listening' : ''}`}
              onClick={toggleMic}
              title={isSupported ? t.speakButton : "Voice input not supported"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? t.stopButton : t.speakButton}</span>
            </button>

            {/* Submit Action */}
            <button type="submit" className="btn-primary" disabled={!queryInput.trim()}>
              {t.verifySafety} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Preset Questions Card */}
      <div className="flat-card" style={{ padding: 'var(--space-3)', background: 'rgba(239, 231, 224, 0.96)', backdropFilter: 'blur(8px)' }}>
        <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={15} style={{ color: 'var(--accent-primary)' }} />
          {t.sampleQuestions}
        </h3>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.5' }}>
          {t.presetDesc}
        </p>

        <div className="chip-grid" style={{ marginTop: 'var(--space-2)' }}>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="chip-item"
              onClick={() => {
                setQueryInput(preset);
                onSubmitQuery(preset);
              }}
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Notice */}
      <div style={{ background: 'var(--surface)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
        <ShieldAlert size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: '1.5' }}>
          <strong>{t.emergencyNoticeTitle}</strong> {t.emergencyNoticeBody}
        </div>
      </div>
    </div>
  );
}
