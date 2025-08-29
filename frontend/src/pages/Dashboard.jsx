import React from 'react';
import { FaRedditAlien, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ai_dashboard from '../assets/ai_dashboard.svg';

const platforms = [
  {
    name: 'Reddit',
    icon: <FaRedditAlien className="text-3xl text-orange-500" />,
    description: 'Analyze your Reddit profile, comments, and post performance.',
  },
  {
    name: 'YouTube',
    icon: <FaYoutube className="text-3xl text-red-600" />,
    description: 'See how your videos perform and what your audience says.',
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedin className="text-3xl text-blue-500" />,
    description: 'Track your engagement, posts, and professional visibility.',
  },
];

const Dashboard = () => {
  return (
    
       <div className="space-y-10 p-6 bg-gradient-to-br from-black via-[#0a0a0a] to-[#050505] min-h-screen text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">Welcome to Your AI-Powered Dashboard</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mt-2">
          Get deep insights and trends across Reddit, YouTube, and LinkedIn — powered by AI.
        </p>
      </motion.div>

      <motion.img
        src={ai_dashboard}
        alt="AI Dashboard Hero"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mx-auto w-full max-w-4xl rounded-xl shadow-[0_0_40px_#00ffe07e]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
      >
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="bg-white/5 p-6 rounded-xl border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.1)] backdrop-blur-sm hover:scale-105 transition-transform duration-300"
          >
            <div className="mb-4">{platform.icon}</div>
            <h3 className="text-xl font-semibold text-cyan-300">{platform.name}</h3>
            <p className="text-gray-400 text-sm mt-2">{platform.description}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-10 text-center"
      >
        <h4 className="text-cyan-300 font-semibold text-xl">More Intelligence Coming Soon!</h4>
        <p className="text-sm text-gray-400">Stay tuned for real-time AI assistant chat and advanced graph analytics.</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
