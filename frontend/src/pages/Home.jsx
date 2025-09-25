// src/pages/Home.jsx
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bot, BarChart3, Users } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle"; 
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Footer from "../components/Footer";

const sampleData = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 65 },
  { name: "Wed", value: 52 },
  { name: "Thu", value: 78 },
  { name: "Fri", value: 90 },
];

const handleClick = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login`;
};

export default function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
    <div
      className={`min-h-screen flex flex-col items-center px-6 py-12 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-cyan-100 text-black"
      }`}
    >
      {/* Toggle in top-right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl"
      >
        <h1
          className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-10 bg-clip-text text-transparent drop-shadow-lg ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-400 to-cyan-300"
              : "bg-gradient-to-r from-blue-600 to-cyan-500"
          }`}
        >
          AI Powered Social Media Analytics
        </h1>
        <p
          className={`text-lg mb-6 mt-6 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Track engagement, monitor trends, and unlock deep insights with
          our next-gen AI assistant.
        </p>
        <button
          onClick={handleClick}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-[0_0_20px_rgba(0,200,255,0.6)] hover:scale-105 transition-transform"
        >
          🚀 Get Started
        </button>
      </motion.div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-8 mt-20 w-full max-w-6xl">
        {[
          {
            icon: <BarChart3 className="w-10 h-10 text-cyan-500" />,
            title: "Advanced Analytics",
            desc: "Gain multi-platform insights with detailed charts and metrics.",
          },
          {
            icon: <Users className="w-10 h-10 text-cyan-500" />,
            title: "Cross-Platform",
            desc: "Track Reddit, YouTube,  — all in one dashboard.",
          },
          {
            icon: <Bot className="w-10 h-10 text-cyan-500" />,
            title: "AI Assistant",
            desc: "Chat with your AI assistant to understand trends instantly.",
          },
        ].map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform ${
              theme === "dark"
                ? "bg-white/5 border border-white/20 text-white"
                : "bg-cyan-50 border border-cyan-600 text-black"
            }`}
          >
            <div className="flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ANALYTICS PREVIEW */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className={`w-full max-w-5xl mt-20 rounded-2xl shadow-xl p-8 transition-colors duration-500 ${
          theme === "dark"
            ? "bg-white/5 border border-cyan-500 text-white"
            : "bg-cyan-50 border border-cyan-600 text-black"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 ${
            theme === "dark" ? "text-cyan-300" : "text-cyan-600"
          }`}
        >
          📊 Engagement Overview
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={sampleData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
            />
            <XAxis dataKey="name" stroke={theme === "dark" ? "#aaa" : "#333"} />
            <YAxis stroke={theme === "dark" ? "#aaa" : "#333"} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#0f172a" : "#f9fafb",
                border: "1px solid #0ea5e9",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00e0ff"
              strokeWidth={3}
              dot={{ r: 6, fill: "#00e0ff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
      <Footer />
      </>
  );
}
