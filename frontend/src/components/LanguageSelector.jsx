import React from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी / संस्कृत' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' }
];

export default function LanguageSelector({ currentLang, onChangeLang }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: '4px 8px' }}>
      <Globe size={14} style={{ color: 'var(--accent-primary)' }} />
      <select
        value={currentLang}
        onChange={(e) => onChangeLang(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: 'var(--text-xs)',
          fontWeight: '600',
          cursor: 'pointer',
          outline: 'none'
        }}
        aria-label="Select Application Language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
