import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCge8apwznA8qhYMAUSaUltkYMnmYbBKv4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "iti-grad-a4054.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "iti-grad-a4054",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "iti-grad-a4054.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "486586289668",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:486586289668:web:daae46733ed16d2fe5ef51",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K6004N4Y0B"
};


// Initialize Firestore and Storage
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
export default app;
