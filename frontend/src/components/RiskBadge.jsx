import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

/**
 * RiskBadge Component
 * ACCESSIBILITY MANDATE:
 * Risk level is NEVER conveyed using color alone.
 * Always pairs background color + icon + bold text label.
 */
export default function RiskBadge({ level = 'LOW', customLabel }) {
  const normLevel = (level || 'LOW').toUpperCase();

  let badgeClass = 'risk-badge-low';
  let IconComponent = ShieldCheck;
  let labelText = customLabel || 'LOW RISK';

  if (normLevel === 'HIGH') {
    badgeClass = 'risk-badge-high';
    IconComponent = AlertOctagon;
    labelText = customLabel || 'HIGH RISK';
  } else if (normLevel === 'MODERATE') {
    badgeClass = 'risk-badge-moderate';
    IconComponent = AlertTriangle;
    labelText = customLabel || 'MODERATE RISK';
  }

  return (
    <div className={`risk-badge ${badgeClass}`} role="status" aria-label={`Risk Assessment Level: ${labelText}`}>
      <IconComponent size={18} strokeWidth={2.5} aria-hidden="true" />
      <span>{labelText}</span>
    </div>
  );
}
