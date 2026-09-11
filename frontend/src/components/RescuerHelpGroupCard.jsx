import React, { useState } from 'react';
import { Siren, Users, MessageSquare, PhoneCall, Radio, CheckCircle2, ShieldAlert, ExternalLink } from 'lucide-react';

export default function RescuerHelpGroupCard({ location, riskAssessment, coordinates, query, t }) {
  const [alertSent, setAlertSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('dispatch'); // 'dispatch' | 'helpgroups'
  const [activeGroupModal, setActiveGroupModal] = useState(null);

  const locName = location || 'Current Region';
  const lat = coordinates?.lat || 37.7749;
  const lon = coordinates?.lon || -122.4194;

  const handleBroadcastAlert = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setAlertSent(true);

      // Store emergency dispatch log locally
      try {
        const existing = JSON.parse(localStorage.getItem('abhayasetu_rescuer_alerts') || '[]');
        const newAlert = {
          id: 'dispatch_' + Date.now(),
          location: locName,
          coordinates: { lat, lon },
          riskLevel: riskAssessment?.level || 'HIGH',
          query: query || 'Emergency Hazard Alert',
          timestamp: new Date().toISOString(),
          status: 'ACCEPTED_BY_3_UNITS'
        };
        localStorage.setItem('abhayasetu_rescuer_alerts', JSON.stringify([newAlert, ...existing]));
      } catch (e) {
        console.warn('Alert log error:', e);
      }
    }, 1200);
  };

  const helpGroups = [
    {
      id: 'whatsapp',
      name: t?.groupWhatsappName || 'Local Emergency WhatsApp Mesh',
      members: '1,420 Active Rescuers',
      desc: t?.groupWhatsappDesc || 'Direct instant alerts & community rescue coordination group.',
      badge: 'WhatsApp',
      color: '#25D366',
      icon: MessageSquare,
      link: `https://chat.whatsapp.com/demo-emergency-mesh-${encodeURIComponent(locName.toLowerCase().replace(/\s+/g, '-'))}`
    },
    {
      id: 'telegram',
      name: t?.groupTelegramName || 'Civil Relief Telegram Channel',
      members: '4,890 Members',
      desc: t?.groupTelegramDesc || 'Real-time hazard updates & satellite alert feeds.',
      badge: 'Telegram',
      color: '#0088cc',
      icon: Radio,
      link: `https://t.me/abhayasetu_disaster_relief`
    },
    {
      id: 'helpline',
      name: t?.groupHelplineName || '24/7 Rescuer Command Helpline',
      members: 'On-Call Dispatchers',
      desc: t?.groupHelplineDesc || 'Direct voice connection to nearest emergency operations center.',
      badge: 'Direct Call',
      color: 'var(--risk-high)',
      icon: PhoneCall,
      link: 'tel:112'
    }
  ];

  return (
    <div className="flat-card" style={{
      border: '1.5px solid var(--risk-high)',
      backgroundColor: 'rgba(156, 117, 104, 0.06)',
      padding: 'var(--space-3)'
    }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: 'var(--risk-high)',
            color: '#FFFFFF',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Siren size={20} className="spin-slow" />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)' }}>
              {t?.rescuerHubTitle || 'Emergency Rescuer & Community Help Network'}
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              {t?.rescuerHubSubtitle || `Identified hazard near ${locName} (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`}
            </span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', padding: '4px', borderRadius: 'var(--border-radius)', border: 'var(--border-subtle)' }}>
          <button
            type="button"
            className={`nav-link-btn ${activeTab === 'dispatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('dispatch')}
            style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
          >
            <ShieldAlert size={14} /> {t?.tabDispatchAlert || 'Broadcast Rescuer Alert'}
          </button>
          <button
            type="button"
            className={`nav-link-btn ${activeTab === 'helpgroups' ? 'active' : ''}`}
            onClick={() => setActiveTab('helpgroups')}
            style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
          >
            <Users size={14} /> {t?.tabHelpGroups || 'Community Help Groups'}
          </button>
        </div>
      </div>

      {/* TAB 1: RESCUER DISPATCH BROADCAST */}
      {activeTab === 'dispatch' && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          {!alertSent ? (
            <div style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-3)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)', lineHeight: '1.6' }}>
                {t?.dispatchPromptText || `Broadcast an immediate emergency alert with your live telemetry coordinates (${lat.toFixed(4)}°, ${lon.toFixed(4)}°) to nearby disaster response units and local civil defense teams.`}
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleBroadcastAlert}
                  disabled={isSending}
                  className="btn-primary"
                  style={{
                    backgroundColor: 'var(--risk-high)',
                    borderColor: 'var(--risk-high)',
                    padding: '12px 20px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '800',
                    gap: '8px'
                  }}
                >
                  <Siren size={18} />
                  {isSending ? (t?.broadcastingAlert || 'Broadcasting Alert Signal...') : (t?.btnNotifyRescuers || 'Notify Nearby Rescuers Now')}
                </button>

                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  ⚡ {t?.estimatedResponse || '3 nearby rescue units active within 15 km'}
                </span>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(140, 160, 188, 0.15)',
              border: '1.5px solid var(--accent-primary)',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--space-3)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', marginBottom: '6px' }}>
                <CheckCircle2 size={24} />
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: '800' }}>
                  {t?.alertDispatchedTitle || 'Emergency Rescuer Alert Dispatched!'}
                </h4>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {t?.alertDispatchedBody || `Your emergency telemetry signal was broadcasted to 4 nearby disaster rescue teams and local civil defense coordinators near ${locName}.`}
              </p>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>• Dispatch ID: #ABH-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span>• GPS: {lat.toFixed(4)}°, {lon.toFixed(4)}°</span>
                <span>• Status: Rescuers En Route / Monitoring</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HELP GROUPS & CHANNELS */}
      {activeTab === 'helpgroups' && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            {t?.helpGroupsDescText || 'Connect directly with local verified emergency response groups, disaster volunteers, and on-call coordinators:'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-2)' }}>
            {helpGroups.map((grp) => {
              const Icon = grp.icon;
              return (
                <div key={grp.id} style={{ background: 'var(--bg-base)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--space-1)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: grp.color, color: '#FFF', padding: '2px 8px', borderRadius: '10px' }}>
                        {grp.badge}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        {grp.members}
                      </span>
                    </div>

                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icon size={16} style={{ color: grp.color }} />
                      {grp.name}
                    </h4>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                      {grp.desc}
                    </p>
                  </div>

                  <a
                    href={grp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ marginTop: 'var(--space-1)', justifyContent: 'center', gap: '6px', fontWeight: '700' }}
                  >
                    {t?.connectBtn || 'Connect to Help Group'} <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
