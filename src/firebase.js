import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // You'll need to replace this
  authDomain: "boltfix.firebaseapp.com",
  projectId: "boltfix",
  storageBucket: "boltfix.appspot.com",
  messagingSenderId: "507303368867",
  appId: "1:507303368867:web:XXXXXXXXXXXXXXXXXXXX" // You'll need to replace this
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 