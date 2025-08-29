import React from 'react';
import {
  FaRedditAlien,
  FaYoutube,
  FaLinkedin,
  FaTachometerAlt,
  FaSignOutAlt,
  FaCog,
  FaMoon,
  FaSun,
  FaRobot,
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      credentials: 'include',
    }).then(() => navigate('/login'));
  };

  const links = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/reddit', icon: <FaRedditAlien />, label: 'Reddit' },
    { path: '/youtube', icon: <FaYoutube />, label: 'YouTube' },
    { path: '/linkedin', icon: <FaLinkedin />, label: 'LinkedIn' },
    { path: '/ai', icon: <FaRobot />, label: 'AI-Assistant' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <aside className="h-full w-64 bg-gradient-to-b from-black to-[#0a0f1c] text-white border-r border-cyan-500 shadow-xl">
      <div className="flex items-center justify-center py-5 border-b border-cyan-700">
        <h1 className="text-cyan-400 font-bold tracking-widest text-lg">AI Dashboard</h1>
      </div>

      <nav className="mt-4 flex flex-col gap-2 px-4">
        {links.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all 
              ${location.pathname === path
                ? 'bg-cyan-600 text-black font-semibold'
                : 'hover:bg-cyan-500/20'}`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

        <div className="mt-6 flex items-center justify-between px-3">
          <button className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100">
            <FaSun /> Light
          </button>
          <button className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-100">
            <FaMoon /> Dark
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;