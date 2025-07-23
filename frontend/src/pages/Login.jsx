import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', formData);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-grid-small-white/[0.1] text-white font-['Orbitron']">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#101f2e] border border-cyan-500 shadow-[0_0_15px_#0ff3,0_0_30px_#00f3ff40] backdrop-blur"
      >
        <h1 className="text-2xl md:text-3xl text-center font-extrabold text-cyan-400 mb-6 tracking-widest">
          AI-POWERED SOCIAL MEDIA ANALYTICS
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-sm text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 rounded-md bg-black border border-cyan-700 placeholder-gray-500 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="robot@ai.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 pr-10 rounded-md bg-black border border-cyan-700 placeholder-gray-500 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 bottom-2.5 text-cyan-300 hover:text-cyan-200"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0px 0px 12px #00f3ff' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition-all duration-200"
          >
            Log In
          </motion.button>
        </form>

        <div className="mt-6 border-t border-gray-600 pt-4 text-center text-sm text-gray-400">
          OR
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          className="mt-4 w-full bg-white text-black py-2 rounded-md flex items-center justify-center gap-2 font-semibold hover:bg-gray-200 transition-all"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <a href="/signup" className="text-cyan-400 hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
