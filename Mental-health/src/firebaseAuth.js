// src/firebaseAuth.js
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { app, db } from './firebase';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔐 Signup with email/password
export const signup = async (email, password, fullName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set display name in Firebase Auth
  await updateProfile(user, { displayName: fullName });

  // Save user info in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email,
    fullName,
    createdAt: new Date(),
    authProvider: 'email',
  });

  return user;
};

// 🔑 Login with email/password
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// 🧠 Login with Google
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDocRef = doc(db, 'users', user.uid);
  const userDocSnap = await getDoc(userDocRef);

  // Ask for name if displayName is missing
  let displayName = user.displayName || '';
  if (!displayName) {
    displayName = prompt("Please enter your name")?.trim() || "Anonymous";
    await updateProfile(user, { displayName });
  }

  if (!userDocSnap.exists()) {
    await setDoc(userDocRef, {
      email: user.email,
      fullName: displayName,
      createdAt: new Date(),
      authProvider: 'google',
    });
  }

  return user;
};
