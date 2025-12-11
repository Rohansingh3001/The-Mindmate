import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft
} from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { signup, login, signInWithGoogle } from "../../firebaseAuth";
import { toast, ToastContainer } from 'react-toastify';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from "../../firebase";
import 'react-toastify/dist/ReactToastify.css';

const Input = ({
  icon, type, placeholder, showPassword, togglePassword, isPassword, name
}) => (
  <div className="relative w-full mb-5">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8f71ff] text-lg">
      {icon}
    </span>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/90 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8f71ff] text-black placeholder-gray-500"
      required
    />
    {isPassword && (
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={togglePassword}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    )}
  </div>
);

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setAgree(false);
    setShowPassword(false);
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const fullName = isLogin ? '' : e.target.fullName?.value;

    try {
      if (isLogin) {
        // Check for admin credentials BEFORE Firebase authentication
        if (email === 'mindmates@gmail.com' && password === 'mentalhealth@247') {
          // Store admin session in localStorage
          localStorage.setItem('adminAuthenticated', 'true');
          localStorage.setItem('adminEmail', email);
          toast.success('Admin login successful!');
          setTimeout(() => navigate('/admin'), 1000);
          return; // Exit early, don't call Firebase
        }

        // Regular user login with Firebase
        await login(email, password);
        toast.success('Login successful!');

        const snapshot = await getDocs(collection(db, 'peers'));
        const peerEmails = snapshot.docs.map((doc) => doc.data().email);
        if (peerEmails.includes(email)) {
          setTimeout(() => navigate('/peer'), 1000);
        } else {
          setTimeout(() => navigate('/user'), 1000);
        }
      } else {
        const user = await signup(email, password, fullName);
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email,
          displayName: fullName,
          createdAt: new Date()
        });

        toast.success('Account created successfully!');
        setTimeout(() => navigate('/user'), 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();

      let displayName = user.displayName;
      if (!displayName) {
        displayName = prompt("Please enter your name:");
      }

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "Anonymous",
        createdAt: new Date()
      });

      // ✅ Check if email is of a peer supporter
      const snapshot = await getDocs(collection(db, 'peers'));
      const peerEmails = snapshot.docs.map((doc) => doc.data().email);
      if (peerEmails.includes(user.email)) {
        toast.success(`Welcome Peer Supporter!`);
        setTimeout(() => navigate('/peer'), 1000);
      } else {
        toast.success(`Welcome ${displayName || 'User'}!`);
        setTimeout(() => navigate('/user'), 1000);
      }
    } catch (err) {
      toast.error(err.message || 'Google login failed!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#f0e9ff] px-6">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white/70 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/40"
      >
        <div
          className="flex items-center gap-3 text-[#8f71ff] cursor-pointer mb-4"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft />
          <span className="text-sm font-medium hover:underline">Back to Home</span>
        </div>

        <motion.h2
          className="text-3xl font-bold text-center text-[#8f71ff] mb-7"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLogin ? 'Welcome Back to Balance' : 'Unwind Your Mind – Join Us Today'}
        </motion.h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input icon={<FaUser />} type="text" placeholder="Full Name" name="fullName" />
          )}
          <Input icon={<FaEnvelope />} type="email" placeholder="Email" name="email" />
          <Input
            icon={<FaLock />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            showPassword={showPassword}
            togglePassword={togglePassword}
            isPassword
            name="password"
          />

          {!isLogin && (
            <div className="flex items-start mb-5">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 accent-[#8f71ff] mr-2"
                checked={agree}
                onChange={() => setAgree(!agree)}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
                I agree to the{' '}
                <span className="text-[#8f71ff] underline cursor-pointer">
                  terms and conditions
                </span>
              </label>
            </div>
          )}

          <motion.button
            whileHover={isLogin || agree ? { scale: 1.05 } : {}}
            className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 ${
              isLogin || agree
                ? 'bg-[#8f71ff] hover:bg-[#7b5fff]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isLogin && !agree}
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </motion.button>
        </form>

        <div className="my-4 text-center relative">
          <div className="absolute left-0 right-0 h-px bg-gray-300 top-1/2 transform -translate-y-1/2" />
          <span className="bg-white/70 relative z-10 px-3 text-gray-500 text-sm">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />
          <span className="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>

        <div className="text-center mt-5 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            onClick={toggleForm}
            className="text-[#8f71ff] font-semibold cursor-pointer hover:underline"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSignup;
