// utils/auth.js
import { getAuth } from "firebase/auth";

// Check if the current user is the hardcoded admin
export const isAdmin = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return false;

  // Hardcoded check based on email
  return user.email === "mindmates@gmail.com";
};
