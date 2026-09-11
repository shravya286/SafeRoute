import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, LifeBuoy, Zap, Flame, Wind, Droplet } from 'lucide-react';
import RescuerHelpGroupCard from '../components/RescuerHelpGroupCard';

export default function SosScreen({ t }) {
  const emergencyNumbers = [
    { title: t.police, number: '112 / 911', icon: ShieldAlert, desc: t.policeDesc },
    { title: t.ambulance, number: '102 / 911', icon: PhoneCall, desc: t.ambulanceDesc },
    { title: t.fire, number: '101 / 911', icon: Flame, desc: t.fireDesc },
    { title: t.disaster, number: '108', icon: LifeBuoy, desc: t.disasterDesc }
  ];

  const survivalGuides = [
    {
      title: t.guideEarthquakeTitle,
      icon: Zap,
      steps: [
        t.guideEarthquake1,
        t.guideEarthquake2,
        t.guideEarthquake3,
        t.guideEarthquake4
      ]
    },
    {
      title: t.guideSnowTitle,
      icon: Wind,
      steps: [
        t.guideSnow1,
        t.guideSnow2,
        t.guideSnow3
      ]
    },
    {
      title: t.guideFloodTitle,
      icon: Droplet,
      steps: [
        t.guideFlood1,
        t.guideFlood2,
        t.guideFlood3
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Rescuer Dispatch & Community Help Group Hub */}
      <RescuerHelpGroupCard
        location="Current Regional Command"
        coordinates={{ lat: 37.7749, lon: -122.4194 }}
        riskAssessment={{ level: 'HIGH' }}
        query="Emergency Rescuer Alert Dispatch"
        t={t}
      />

      {/* Emergency Hotlines Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-2)' }}>
        {emergencyNumbers.map((num, idx) => {
          const Icon = num.icon;
          return (
            <a
              key={idx}
              href={`tel:${num.number.split(' ')[0]}`}
              className="flat-card"
              style={{ textDecoration: 'none', transition: 'all 0.15s ease', padding: 'var(--space-3)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={20} style={{ color: 'var(--risk-high)' }} />
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {num.title}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
                {num.number}
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                {num.desc}
              </span>
            </a>
          );
        })}
      </div>

      {/* Survival Protocol Cards */}
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', marginTop: 'var(--space-1)' }}>
        {t.sectionSosSubtitle}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2)' }}>
        {survivalGuides.map((guide, idx) => {
          const Icon = guide.icon;
          return (
            <div key={idx} className="flat-card" style={{ padding: 'var(--space-3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={18} style={{ color: 'var(--accent-primary)' }} />
                {guide.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-2)' }}>
                {guide.steps.map((step, stepIdx) => (
                  <li key={stepIdx} style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.5' }}>
                    <span style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>{stepIdx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
