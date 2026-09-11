import React from 'react';
import { Home, ShieldCheck, Radio, AlertOctagon, History, Siren } from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab, t }) {
  const tabs = [
    { id: 'home', label: t.navHome ? t.navHome.split('&')[0].trim() : 'Home', icon: Home },
    { id: 'danger', label: 'Danger', icon: Siren },
    { id: 'assessment', label: 'Assess', icon: ShieldCheck },
    { id: 'radar', label: 'Radar', icon: Radio },
    { id: 'sos', label: 'SOS', icon: AlertOctagon },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
            style={tab.id === 'danger' && !isActive ? { color: 'var(--risk-high)' } : {}}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
