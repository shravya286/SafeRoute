import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, CheckCircle, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, isFirebaseConfigured } from '../config/firebase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, t }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();
      setSuccessMsg(t.authSuccess || 'Successfully authenticated with Google!');
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handle1TapDemoLogin = (role) => {
    setLoading(true);
    setError('');
    const demoUser = {
      uid: 'demo_user_' + Date.now(),
      displayName: role === 'rescuer' ? 'Capt. Sarah Connor (Rescuer)' : 'Alex Mercer (Resident)',
      email: role === 'rescuer' ? 'rescuer.captain@abhayasetu.org' : 'resident.alex@abhayasetu.org',
      photoURL: null,
      role: role,
      isDemo: true
    };
    localStorage.setItem('abhayasetu_demo_user', JSON.stringify(demoUser));
    setSuccessMsg(`Logged in as ${demoUser.displayName}!`);
    setTimeout(() => {
      onAuthSuccess(demoUser);
      setLoading(false);
      onClose();
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let user;
      if (mode === 'login') {
        user = await loginWithEmail(email, password);
        setSuccessMsg(t.welcomeBack || 'Welcome back!');
      } else {
        user = await registerWithEmail(email, password, displayName);
        setSuccessMsg(t.accountCreated || 'Account created successfully!');
      }
      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--bg-base)',
        border: '1.5px solid var(--accent-primary)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
        position: 'relative',
        padding: 'var(--space-4)',
        animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'var(--text-secondary)',
            padding: '4px',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
          <div style={{
            background: 'var(--surface)',
            border: 'var(--border-subtle)',
            borderRadius: '50%',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', lineHeight: '1.2' }}>
              {mode === 'login' ? (t.signInTitle || 'Sign In to AbhayaSetu') : (t.signUpTitle || 'Create SafeRoute Account')}
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              {t.authSubtitle || 'Firebase Encrypted Access & Emergency Identity'}
            </span>
          </div>
        </div>

        {/* Firebase Config Mode Notice */}
        <div style={{
          fontSize: '11px',
          background: isFirebaseConfigured ? 'rgba(113, 136, 159, 0.1)' : 'rgba(203, 174, 140, 0.15)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--border-radius)',
          padding: '8px 12px',
          marginBottom: 'var(--space-2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-primary)'
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span>
            {isFirebaseConfigured
              ? 'Firebase Live Auth Enabled'
              : 'Firebase Auth Active (1-Tap Fast Login Available Below)'}
          </span>
        </div>

        {/* 1-Tap Quick Demo Authentication */}
        <div style={{ background: 'var(--surface)', border: 'var(--border-subtle)', borderRadius: 'var(--border-radius)', padding: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            ⚡ 1-Tap Instant Demo Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handle1TapDemoLogin('rescuer')}
              className="btn-secondary"
              style={{ fontSize: '11px', fontWeight: '700', gap: '4px', padding: '6px 8px' }}
            >
              <UserCheck size={14} style={{ color: 'var(--accent-primary)' }} />
              Log In (Rescuer)
            </button>

            <button
              type="button"
              onClick={() => handle1TapDemoLogin('resident')}
              className="btn-secondary"
              style={{ fontSize: '11px', fontWeight: '700', gap: '4px', padding: '6px 8px' }}
            >
              <UserCheck size={14} style={{ color: 'var(--risk-moderate)' }} />
              Log In (Resident)
            </button>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div style={{
            fontSize: 'var(--text-xs)',
            background: 'rgba(156, 117, 104, 0.15)',
            border: '1px solid var(--risk-high)',
            color: 'var(--risk-high)',
            borderRadius: 'var(--border-radius)',
            padding: '8px 12px',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {successMsg && (
          <div style={{
            fontSize: 'var(--text-xs)',
            background: 'rgba(140, 160, 188, 0.2)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--border-radius)',
            padding: '8px 12px',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}>
            <CheckCircle size={16} style={{ color: 'var(--accent-primary)' }} /> {successMsg}
          </div>
        )}

        {/* Google 1-Tap Auth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-secondary"
          style={{
            width: '100%',
            padding: '10px 16px',
            justifyContent: 'center',
            gap: '10px',
            fontSize: 'var(--text-sm)',
            fontWeight: '700',
            marginBottom: 'var(--space-2)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {t.googleSignIn || 'Continue with Google'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 'var(--space-2) 0', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--surface-alt)' }} />
          <span>{t.orEmail || 'OR EMAIL'}</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--surface-alt)' }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                {t.fullNameLabel || 'Full Name / Call Sign'}
              </label>
              <input
                type="text"
                className="input-textarea"
                style={{ minHeight: '40px', height: '40px', padding: '0 12px' }}
                placeholder="e.g. Capt. Sarah Connor"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              {t.emailLabel || 'Email Address'}
            </label>
            <input
              type="email"
              required
              className="input-textarea"
              style={{ minHeight: '40px', height: '40px', padding: '0 12px' }}
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              {t.passwordLabel || 'Password'}
            </label>
            <input
              type="password"
              required
              className="input-textarea"
              style={{ minHeight: '40px', height: '40px', padding: '0 12px' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)' }}
          >
            {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
            {loading
              ? (t.authenticating || 'Authenticating...')
              : mode === 'login'
              ? (t.signInBtn || 'Sign In to Account')
              : (t.registerBtn || 'Create Free Account')}
          </button>
        </form>

        {/* Tab Toggle */}
        <div style={{ marginTop: 'var(--space-3)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <>
              {t.noAccountPrompt || "Don't have an emergency profile yet?"}{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'underline' }}
              >
                {t.signUpLink || 'Register Now'}
              </button>
            </>
          ) : (
            <>
              {t.alreadyHaveAccountPrompt || 'Already registered?'}{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'underline' }}
              >
                {t.signInLink || 'Sign In'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
