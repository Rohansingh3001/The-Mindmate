// src/firebaseAuth.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const signup = async (email, password, fullName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    email,
    fullName,
    createdAt: new Date(),
  });

  return user;
};

export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
