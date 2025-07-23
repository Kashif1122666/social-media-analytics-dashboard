import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Validate and send data to backend
    console.log('Signing up with:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0f1c] to-[#050e1f] text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.15)] border border-cyan-500"
      >
        <h1 className="text-2xl md:text-3xl text-center font-extrabold text-cyan-400 mb-6 tracking-widest">
          JOIN YOUR AI ANALYTICS COMPANION
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/10 border border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/10 border border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
          />

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 pr-10 bg-white/10 border border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-300 hover:text-cyan-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password Field with Eye Icon */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 pr-10 bg-white/10 border border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-300"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-300 hover:text-cyan-200"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-xl transition duration-300 shadow-md"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <span className="text-gray-400 text-sm">OR</span>
        </div>

        <button
          onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
          className="flex items-center justify-center gap-3 w-full mt-4 bg-white text-black font-semibold py-2 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account? <a href="/login" className="text-cyan-400 hover:underline">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
