import React from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function HistoryScreen({ savedAssessments, onSelectAssessment, onClearHistory, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {t.sectionHistorySubtitle}
        </span>

        {savedAssessments && savedAssessments.length > 0 && (
          <button type="button" className="btn-secondary" onClick={onClearHistory}>
            <Trash2 size={14} style={{ color: 'var(--risk-high)' }} />
            {t.clearHistory}
          </button>
        )}
      </div>

      {(!savedAssessments || savedAssessments.length === 0) ? (
        <div className="flat-card" style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: 'var(--text-sm)' }}>{t.historyEmpty}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-2)' }}>
          {savedAssessments.map((item, idx) => (
            <div
              key={idx}
              className="flat-card"
              style={{ cursor: 'pointer', transition: 'border-color 0.15s ease' }}
              onClick={() => onSelectAssessment(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {item.location} • {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-xs)', marginTop: '2px' }}>
                    "{item.query}"
                  </h3>
                </div>

                <RiskBadge level={item.riskAssessment?.level} customLabel={item.riskAssessment?.boldTextLabel} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-1)', pt: 'var(--space-1)', borderTop: 'var(--border-subtle)', fontSize: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {t.confidenceLabel || 'Confidence'}: {item.riskAssessment?.confidenceScore || '95%'}
                </span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t.viewAssessment || 'View Report'} <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
