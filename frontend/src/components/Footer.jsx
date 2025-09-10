// src/components/Footer.jsx
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Bot } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={` w-full px-6 py-8 ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-r from-blue-50 via-white to-blue-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-bold tracking-wide">
            AI Analytics Dashboard
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="/about" className="hover:text-blue-500 transition-colors">
            About
          </a>
          <a href="/features" className="hover:text-blue-500 transition-colors">
            Features
          </a>
          <a href="/pricing" className="hover:text-blue-500 transition-colors">
            Pricing
          </a>
          <a href="/contact" className="hover:text-blue-500 transition-colors">
            Contact
          </a>
        </div>

        {/* Socials */}
        <div className="flex gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
        </div>

        {/* Bottom Text */}
        <div className="text-center text-xs opacity-70 mt-4">
          © {new Date().getFullYear()} AI Analytics Dashboard. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
