import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZubMTEVjgTVX7IXCbT_-x72VUZjG32bs",
  authDomain: "zenspace-d29e3.firebaseapp.com",
  projectId: "zenspace-d29e3",
  storageBucket: "zenspace-d29e3.firebasestorage.app",
  messagingSenderId: "762169121131",
  appId: "1:762169121131:web:7abf77707a7d0b518e142e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

