import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app;
let auth;
let googleProvider;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, googleProvider };

// Helper Authentication functions with graceful fallback for unconfigured env
export async function loginWithGoogle() {
  if (isFirebaseConfigured && auth && googleProvider) {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } else {
    // Simulated Demo Auth for preview environment
    const demoUser = {
      uid: 'demo_google_123',
      displayName: 'Rescuer Operator (Demo)',
      email: 'rescuer.demo@abhayasetu.org',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      isDemo: true
    };
    localStorage.setItem('abhayasetu_demo_user', JSON.stringify(demoUser));
    return demoUser;
  }
}

export async function loginWithEmail(email, password) {
  if (isFirebaseConfigured && auth) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } else {
    const nameFromEmail = email.split('@')[0];
    const demoUser = {
      uid: 'demo_email_' + Date.now(),
      displayName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: email,
      photoURL: null,
      isDemo: true
    };
    localStorage.setItem('abhayasetu_demo_user', JSON.stringify(demoUser));
    return demoUser;
  }
}

export async function registerWithEmail(email, password, displayName) {
  if (isFirebaseConfigured && auth) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } else {
    const demoUser = {
      uid: 'demo_user_' + Date.now(),
      displayName: displayName || email.split('@')[0],
      email: email,
      photoURL: null,
      isDemo: true
    };
    localStorage.setItem('abhayasetu_demo_user', JSON.stringify(demoUser));
    return demoUser;
  }
}

export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem('abhayasetu_demo_user');
}

export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    // Check initial local stored demo user
    const stored = localStorage.getItem('abhayasetu_demo_user');
    if (stored) {
      try {
        callback(JSON.parse(stored));
      } catch (e) {
        callback(null);
      }
    } else {
      callback(null);
    }
    return () => {};
  }
}
