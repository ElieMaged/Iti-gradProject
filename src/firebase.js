import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Debug environment variables
console.log('=== FIREBASE CONFIG DEBUG ===');
console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'NOT SET');
console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'SET' : 'NOT SET');
console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('MODE:', import.meta.env.MODE);

// Firebase config - use .env values if available, otherwise fallback to project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCge8apwznA8qhYMAUSaUltkYMnmYbBKv4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "iti-grad-a4054.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "iti-grad-a4054",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "iti-grad-a4054.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "486586289668",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:486586289668:web:daae46733ed16d2fe5ef51",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K6004N4Y0B"
};

console.log('Firebase config:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'NOT SET',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? 'SET' : 'NOT SET',
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase
let app, auth, provider, db, storage;

try {
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
  storage = getStorage(app);

  // Enable authentication persistence
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase auth persistence enabled');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
    
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

// Export Firebase instances
export { auth, provider, db, storage };
export default app; 