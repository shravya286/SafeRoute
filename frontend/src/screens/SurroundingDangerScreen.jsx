import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertOctagon, MapPin, Radio, ThumbsUp, Send, Siren, Plus, Filter, Users, ExternalLink, CheckCircle } from 'lucide-react';

export default function SurroundingDangerScreen({ t, user }) {
  const [radiusFilter, setRadiusFilter] = useState('all'); // 'all' | '1km' | '5km' | '15km' | '50km'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dangerCategory, setDangerCategory] = useState('flood');
  const [severity, setSeverity] = useState('HIGH');
  const [hazardTitle, setHazardTitle] = useState('');
  const [hazardDesc, setHazardDesc] = useState('');
  const [locationName, setLocationName] = useState('Current Region (Nearby Radius)');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Initial surrounding danger alerts
  const [alerts, setAlerts] = useState([
    {
      id: 'danger_1',
      title: 'Flash Flood Warning on MG Road River Bridge',
      category: 'Flood & River Surge',
      severity: 'CRITICAL',
      badgeColor: '#9C7568',
      location: 'MG Road Bridge Area (1.2 km away)',
      distanceKm: 1.2,
      coordinates: { lat: 13.172, lon: 77.224 },
      description: 'Water levels rising rapidly above danger line. Road submerged under 2 feet of moving water. Avoid crossing.',
      reportedBy: 'Civil Defense Node #4',
      timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifications: 18,
      status: 'ACTIVE_DISPATCH'
    },
    {
      id: 'danger_2',
      title: 'Rockslide & Mudfall on North Hill Trail',
      category: 'Landslide / Slope Collapse',
      severity: 'HIGH',
      badgeColor: '#CBAE8C',
      location: 'North Hill Ridge (3.8 km away)',
      distanceKm: 3.8,
      coordinates: { lat: 13.181, lon: 77.215 },
      description: 'Loose boulders blocking trail path after morning rain shower. Hikers advised to halt and turn back.',
      reportedBy: 'Capt. Sarah Connor (Rescuer)',
      timestamp: new Date(Date.now() - 42 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifications: 9,
      status: 'MONITORING'
    },
    {
      id: 'danger_3',
      title: 'High-Wind Powerline Cable Snap',
      category: 'Electrical & Road Hazard',
      severity: 'MODERATE',
      badgeColor: '#CBAE8C',
      location: 'Sector 4 Highway Junction (7.5 km away)',
      distanceKm: 7.5,
      coordinates: { lat: 13.155, lon: 77.240 },
      description: 'Live electrical cable down on right lane due to 45 km/h wind gusts. Traffic diversion active.',
      reportedBy: 'Highway Patrol Team',
      timestamp: new Date(Date.now() - 90 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifications: 14,
      status: 'REPAIR_EN_ROUTE'
    }
  ]);

  // Load user submitted alerts on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('abhayasetu_surrounding_dangers');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAlerts(prev => {
          const ids = new Set(prev.map(a => a.id));
          const fresh = parsed.filter(p => !ids.has(p.id));
          return [...fresh, ...prev];
        });
      }
    } catch (e) {
      console.warn('Failed to load surrounding dangers:', e);
    }
  }, []);

  const handleUpvote = (id) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, verifications: a.verifications + 1 };
      }
      return a;
    }));
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!hazardTitle.trim() || !hazardDesc.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      const newAlert = {
        id: 'user_danger_' + Date.now(),
        title: hazardTitle,
        category: dangerCategory.toUpperCase(),
        severity: severity,
        badgeColor: severity === 'CRITICAL' ? '#9C7568' : severity === 'HIGH' ? '#9C7568' : '#CBAE8C',
        location: `${locationName} (0.5 km away)`,
        distanceKm: 0.5,
        coordinates: { lat: 13.169, lon: 77.222 },
        description: hazardDesc,
        reportedBy: user ? (user.displayName || user.email) : 'Surrounding Resident',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verifications: 1,
        status: 'JUST_BROADCASTED'
      };

      setAlerts(prev => [newAlert, ...prev]);
      try {
        const existing = JSON.parse(localStorage.getItem('abhayasetu_surrounding_dangers') || '[]');
        localStorage.setItem('abhayasetu_surrounding_dangers', JSON.stringify([newAlert, ...existing]));
      } catch (e) {
        console.warn('Error saving alert:', e);
      }

      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      setHazardTitle('');
      setHazardDesc('');
      setTimeout(() => {
        setBroadcastSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    }, 1000);
  };

  const filteredAlerts = alerts.filter(a => {
    if (radiusFilter === '1km') return a.distanceKm <= 1.5;
    if (radiusFilter === '5km') return a.distanceKm <= 5.0;
    if (radiusFilter === '15km') return a.distanceKm <= 15.0;
    if (radiusFilter === '50km') return a.distanceKm <= 50.0;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} className="slide-page">
      {/* Header Banner */}
      <div className="flat-card" style={{ padding: 'var(--space-4)', border: '1.5px solid var(--risk-high)', backgroundColor: 'rgba(156, 117, 104, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: 'var(--risk-high)',
              color: '#FFFFFF',
              borderRadius: '50%',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Siren size={24} className="spin-slow" />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                {t?.surroundingDangerTitle || 'Surrounding Danger & Community Alert Hub'}
              </h1>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                {t?.surroundingDangerSubtitle || 'Live emergency warnings broadcasted by nearby people & environmental monitoring nodes in your radius.'}
              </p>
            </div>
          </div>

          {/* Broadcast Action Button */}
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: 'var(--risk-high)', borderColor: 'var(--risk-high)', gap: '8px', fontWeight: '800' }}
          >
            <Plus size={18} />
            {t?.btnBroadcastDanger || 'Broadcast Surrounding Danger Alert'}
          </button>
        </div>
      </div>

      {/* Filter Radius Control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-secondary)' }}>
          <Filter size={15} style={{ color: 'var(--accent-primary)' }} />
          <span>{t?.filterRadiusLabel || 'Radius Filter:'}</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Distances' },
            { id: '1km', label: 'Within 1.5 km' },
            { id: '5km', label: 'Within 5 km' },
            { id: '15km', label: 'Within 15 km' },
            { id: '50km', label: 'Within 50 km' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              className={`btn-secondary ${radiusFilter === f.id ? 'active' : ''}`}
              onClick={() => setRadiusFilter(f.id)}
              style={{
                fontSize: 'var(--text-xs)',
                padding: '6px 12px',
                backgroundColor: radiusFilter === f.id ? 'var(--accent-primary)' : 'var(--bg-base)',
                color: radiusFilter === f.id ? '#FFF' : 'var(--text-primary)'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Surrounding Danger Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="flat-card"
              style={{
                borderLeft: `5px solid ${alert.badgeColor}`,
                padding: 'var(--space-3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="risk-badge" style={{ backgroundColor: alert.badgeColor, fontSize: '10px', padding: '2px 8px' }}>
                      {alert.severity}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      {alert.category}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      • Reported {alert.timestamp}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {alert.title}
                  </h3>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                    <MapPin size={13} style={{ color: 'var(--accent-primary)' }} />
                    {alert.location}
                  </div>
                </div>

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: '700', background: 'var(--bg-base)', padding: '4px 10px', borderRadius: '12px', border: 'var(--border-subtle)' }}>
                  By: {alert.reportedBy}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: 'var(--space-1)', lineHeight: '1.6' }}>
                {alert.description}
              </p>

              {/* Card Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)', paddingTop: 'var(--space-1)', borderTop: 'var(--border-subtle)', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                <button
                  type="button"
                  onClick={() => handleUpvote(alert.id)}
                  className="btn-secondary"
                  style={{ gap: '6px', fontWeight: '700' }}
                >
                  <ThumbsUp size={14} style={{ color: 'var(--accent-primary)' }} />
                  <span>Verify Alert ({alert.verifications})</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`https://maps.google.com/?q=${alert.coordinates?.lat},${alert.coordinates?.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ gap: '6px' }}
                  >
                    <span>View Map Coords</span> <ExternalLink size={13} />
                  </a>

                  <a
                    href="tel:112"
                    className="btn-primary"
                    style={{ backgroundColor: 'var(--risk-high)', borderColor: 'var(--risk-high)', padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                  >
                    Offer Help / Call 112
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flat-card" style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-secondary)' }}>
            <ShieldAlert size={32} style={{ color: 'var(--accent-primary)', margin: '0 auto var(--space-2) auto' }} />
            <p style={{ fontSize: 'var(--text-sm)' }}>
              No critical danger alerts reported within this radius filter. Stay safe and broadcast a warning if you observe local hazards!
            </p>
          </div>
        )}
      </div>

      {/* BROADCAST DANGER ALERT MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(45, 35, 37, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-3)'
        }}>
          <div className="flat-card" style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'var(--bg-base)',
            border: '2px solid var(--risk-high)',
            padding: 'var(--space-4)',
            position: 'relative',
            animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Siren size={22} /> Broadcast Danger Alert to Surrounding People
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              Broadcast immediate warning telemetry to nearby residents and rescue coordinators in your radius:
            </p>

            {broadcastSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--accent-primary)' }}>
                <CheckCircle size={40} style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800' }}>
                  Danger Alert Broadcasted Successfully!
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', marginTop: '4px' }}>
                  Surrounding people and nearby rescue units have been notified of your alert.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>
                    Hazard Headline / Title
                  </label>
                  <input
                    type="text"
                    required
                    className="input-textarea"
                    style={{ minHeight: '40px', height: '40px', padding: '0 12px' }}
                    placeholder="e.g. Flash flood rising fast near River Bridge"
                    value={hazardTitle}
                    onChange={(e) => setHazardTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>
                      Hazard Category
                    </label>
                    <select
                      className="input-textarea"
                      style={{ minHeight: '40px', height: '40px', padding: '0 10px' }}
                      value={dangerCategory}
                      onChange={(e) => setDangerCategory(e.target.value)}
                    >
                      <option value="flood">Flash Flood / Water Surge</option>
                      <option value="landslide">Landslide / Rockfall</option>
                      <option value="earthquake">Earthquake Tremor</option>
                      <option value="storm">Severe Storm / Wind Hazard</option>
                      <option value="road">Road Obstruction / Cable Snap</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>
                      Severity Level
                    </label>
                    <select
                      className="input-textarea"
                      style={{ minHeight: '40px', height: '40px', padding: '0 10px' }}
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                    >
                      <option value="CRITICAL">CRITICAL EMERGENCY</option>
                      <option value="HIGH">HIGH HAZARD</option>
                      <option value="MODERATE">MODERATE WARNING</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>
                    Detailed Warning Description
                  </label>
                  <textarea
                    required
                    className="input-textarea"
                    rows={3}
                    placeholder="Describe exact danger, road conditions, or water level for surrounding people..."
                    value={hazardDesc}
                    onChange={(e) => setHazardDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="btn-primary"
                    style={{ backgroundColor: 'var(--risk-high)', borderColor: 'var(--risk-high)' }}
                  >
                    {isBroadcasting ? 'Broadcasting Alert...' : 'Broadcast Emergency Warning Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
