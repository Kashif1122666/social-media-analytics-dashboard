import React from 'react';
import { motion } from 'framer-motion';
import { FaReddit, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { SparklesCore } from '../components/ui/sparkles'; // optional animated background
import { Link } from 'react-router-dom';

const platforms = [
  { name: 'Reddit', icon: <FaReddit className="text-orange-400" size={28} />, description: 'Analyze posts, trends, karma growth, and user engagement.' },
  { name: 'YouTube', icon: <FaYoutube className="text-red-500" size={28} />, description: 'Track your videos, comments, and viewership analytics.' },
  { name: 'LinkedIn', icon: <FaLinkedin className="text-blue-500" size={28} />, description: 'Get insights from your posts, articles, and network stats.' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#050e1f] to-[#020c1b] text-white font-['Orbitron']">
      {/* Hero Section */}
      <section className="text-center py-20 px-6 md:px-12">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 tracking-wider"
        >
          Unleash AI on Your Social Media Data
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-gray-300 max-w-3xl mx-auto text-lg"
        >
          Dive into analytics from Reddit, YouTube, and LinkedIn – powered by a futuristic AI assistant designed to help you grow smarter, faster, and further.
        </motion.p>
        <motion.div
          className="mt-10"
          whileHover={{ scale: 1.05 }}
        >
          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
          >
            Get Started with AI
          </Link>
        </motion.div>
      </section>

      {/* Sparkles or optional glowing background */}
      <div className="relative h-20">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.5}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00ffff"
        />
      </div>

      {/* Platform Sections */}
      <section className="py-20 px-6 md:px-12 bg-white/5 backdrop-blur-sm border-y border-cyan-700">
        <h2 className="text-3xl text-center font-bold text-cyan-400 mb-12">Supported Platforms</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {platforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-black border border-cyan-600 rounded-2xl p-6 text-center shadow-md hover:shadow-cyan-500/20"
            >
              <div className="flex justify-center mb-4">{platform.icon}</div>
              <h3 className="text-xl font-semibold text-cyan-300 mb-2">{platform.name}</h3>
              <p className="text-gray-400">{platform.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#030617] via-[#040a1f] to-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl text-cyan-400 font-bold mb-6">Your Personal AI Assistant</h2>
          <p className="text-gray-300 text-lg mb-6">
            Ask anything about your analytics, get predictions, and unlock deep insights powered by cutting-edge AI (Gemini API for now, custom model coming soon).
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 px-6 rounded-xl transition-all duration-300"
          >
            Try AI Assistant
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-cyan-800 bg-black/80">
        © 2025 Social Media Analytics Dashboard. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
