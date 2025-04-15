// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Persistent Login
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

// Firestore
const db = getFirestore(app);

/**
 * 🔍 Fetch current user details from Firebase Auth + Firestore
 * @returns {Promise<{ name: string, email: string, uid: string } | null>}
 */
const fetchUserDetails = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.warn('No user is currently logged in.');
    return null;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        name: userData.name || user.displayName || 'User',
        email: user.email,
        uid: user.uid,
      };
    } else {
      // Return basic auth data if no Firestore doc found
      return {
        name: user.displayName || 'User',
        email: user.email,
        uid: user.uid,
      };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

export { app, auth, db, fetchUserDetails };
