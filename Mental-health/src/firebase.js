// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 🔥 Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ Persistent Auth
setPersistence(auth, browserLocalPersistence).catch((err) =>
  console.error("Auth persistence error:", err)
);

/**
 * 🔍 Fetch current user details from Firebase Auth + Firestore
 * @returns {Promise<{ name: string, email: string, uid: string } | null>}
 */
const fetchUserDetails = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No user is currently logged in.");
    return null;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        name: userData.name || user.displayName || "User",
        email: user.email,
        uid: user.uid,
      };
    } else {
      return {
        name: user.displayName || "User",
        email: user.email,
        uid: user.uid,
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// ✅ Export everything needed across the app
export {
  app,
  db,
  auth,
  storage,
  // Firestore
  collection,
  query,
  orderBy,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  // Auth
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  // Storage
  ref,
  uploadBytes,
  getDownloadURL,
  // Utils
  fetchUserDetails,
};
