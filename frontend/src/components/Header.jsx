import React from 'react';
import { Shield, Home, ShieldCheck, Radio, AlertOctagon, History, User, LogOut, Siren } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export default function Header({ user, onOpenAuthModal, onLogout, currentLang, onChangeLang, activeSection, t }) {
  const navItems = [
    { id: 'home', label: t.navHome ? t.navHome.split('&')[0].trim() : 'Home', icon: Home },
    { id: 'danger', label: t.navDangerHub ? t.navDangerHub.replace('Surrounding ', '') : 'Danger Radar', icon: Siren },
    { id: 'assessment', label: t.navAssess ? t.navAssess.split(' ')[0].trim() : 'Assessment', icon: ShieldCheck },
    { id: 'radar', label: t.navRadar ? t.navRadar.replace('Live Telemetry ', '') : 'Radar', icon: Radio },
    { id: 'sos', label: t.navSos ? t.navSos.split('&')[0].trim() : 'SOS & Tips', icon: AlertOctagon },
    { id: 'history', label: t.navHistory ? t.navHistory.replace('Saved ', '') : 'History', icon: History }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || 'Rescuer';
  };

  return (
    <header className="sticky-header">
      <div className="header-container">
        {/* Brand Logo & Badge */}
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="brand" aria-label="AbhayaSetu Home">
          <Shield size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>AbhayaSetu</span>
          <span className="brand-badge">SafeRoute Bridge</span>
        </a>

        {/* Top Navbar Links */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                style={item.id === 'danger' ? { color: isActive ? '#FFF' : 'var(--risk-high)', fontWeight: '800' } : {}}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Action Bar: Firebase Auth Profile + Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>
          <LanguageSelector currentLang={currentLang} onChangeLang={onChangeLang} />

          {/* User Profile Badge or Sign In Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                title={user.email}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--surface)',
                  border: 'var(--border-subtle)',
                  borderRadius: 'var(--border-radius)',
                  padding: '4px 10px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={14} style={{ color: 'var(--accent-primary)' }} />
                )}
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getUserDisplayName()}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="btn-secondary"
                title={t.signOut || 'Sign Out'}
                style={{ padding: '6px 10px' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontWeight: '700', gap: '6px' }}
            >
              <User size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>{t.signIn || 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
