// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCge8apwznA8qhYMAUSaUltkYMnmYbBKv4",
  authDomain: "iti-grad-a4054.firebaseapp.com",
  projectId: "iti-grad-a4054",
  storageBucket: "iti-grad-a4054.firebasestorage.app",
  messagingSenderId: "486586289668",
  appId: "1:486586289668:web:daae46733ed16d2fe5ef51",
  measurementId: "G-K6004N4Y0B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
