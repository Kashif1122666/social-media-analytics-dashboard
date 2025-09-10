// src/pages/RedditAnalytics.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { FaReddit } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

export default function RedditAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reddit/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching Reddit data", err);
        setError(
          "Failed to fetch data. Try again and make sure Reddit is connected."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 const handleAiAsk = async () => {
  if (!aiQuery.trim()) return;
  try {
    setAiLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/ai/ask-ai`,
      { query: aiQuery },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAiResponse(res.data.answer || "AI could not generate advice right now.");
    setAiLoading(false);
  } catch (err) {
    console.error("Reddit AI Error:", err?.response?.data || err.message);
    setAiResponse("AI could not generate advice. Try again later.");
    setAiLoading(false);
  }
};


  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
          theme === "dark"
            ? "text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            : "text-black bg-gradient-to-r from-white via-gray-100 to-orange-100"
        }`}
      >
        <p className="text-lg animate-pulse">Loading Reddit Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-r from-white via-gray-100 to-orange-100 text-black"
        }`}
      >
        <div
          className={`p-6 rounded-2xl shadow-lg text-center ${
            theme === "dark"
              ? "bg-red-600 text-white"
              : "bg-red-100 text-red-800 border border-red-400"
          }`}
        >
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { redditUsername, avatar, stats, recentPosts } = data;

  // Fallback chart data if recentPosts is empty
  const chartData =
    recentPosts && recentPosts.length > 0
      ? recentPosts.map((post) => ({
          title: post.title,
          score: post.score || 0,
        }))
      : [
          { title: "Link Karma", score: stats?.linkKarma || 0 },
          { title: "Comment Karma", score: stats?.commentKarma || 0 },
          { title: "Total Karma", score: stats?.totalKarma || 0 },
        ];

  const COLORS = ["#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#FF6347"];

  return (
    <>
    <div
      className={`min-h-screen p-6 transition-colors duration-500 relative ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-white via-gray-100 to-orange-100 text-black"
      }`}
    >
     {/* Theme Toggle + Buttons Top Right */}
<div className="absolute top-6 right-6 flex items-center gap-4">
  <ThemeToggle />

  {/* Logout Button */}
  <button
    onClick={() => {
      localStorage.removeItem("token"); // clear JWT
      window.location.href = '/';
    }}
    className={`px-3 py-2 rounded-xl font-semibold shadow-lg transition-colors text-sm ${
      theme === "dark"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-red-100 text-red-800 border border-red-400 hover:bg-red-200"
    }`}
  >
    Logout
  </button>

  {/* Back to Dashboard Button */}
  <button
    onClick={() => {
      window.location.href = `/dashboard`;
    }}
    className={`px-3 py-2 rounded-xl font-semibold shadow-lg transition-colors text-sm ${
      theme === "dark"
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-blue-100 text-blue-800 border border-blue-400 hover:bg-blue-200"
    }`}
  >
    Back
  </button>
</div>


    


      {/* Reddit Overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <div className="flex items-center space-x-4">
          {avatar && (
            <img
              src={avatar.replace(/&amp;/g, "&")}
              alt="avatar"
              className="w-16 h-16 rounded-full border-2 border-orange-500"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              u/{redditUsername}
              <a
                href={`https://www.reddit.com/user/${redditUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 text-2xl"
              >
                <FaReddit />
              </a>
            </h1>
            <p
              className={theme === "dark" ? "text-gray-300" : "text-gray-700"}
            >
              Your Reddit profile insights
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Link Karma", value: stats?.linkKarma },
            { label: "Comment Karma", value: stats?.commentKarma },
            { label: "Total Karma", value: stats?.totalKarma },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800"
                  : "bg-orange-50 border border-orange-600"
              }`}
            >
              <h2 className="text-xl">{item.label}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reddit Chart */}
      <div
        className={`rounded-2xl p-6 shadow-xl mb-8 border backdrop-blur-md ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700"
            : "bg-orange-50 border border-orange-600"
        }`}
      >
        <h2 className="text-xl mb-4 font-semibold">Reddit Activity Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 20 }} barCategoryGap="20%">
            <XAxis
              type="number"
              stroke={theme === "dark" ? "#fff" : "#333"}
              tick={{ fill: theme === "dark" ? "#fff" : "#333", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="title"
              stroke={theme === "dark" ? "#fff" : "#333"}
              tick={{ fill: theme === "dark" ? "#fff" : "#333", fontSize: 12 }}
              width={180}
            />
            <Tooltip
              cursor={{ fill: theme === "dark" ? "#1f2937" : "#ffe7d6" }}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#0f172a" : "#f9fafb",
                border: "1px solid #0ea5e9",
                color: theme === "dark" ? "#fff" : "#000",
                borderRadius: "8px",
                padding: "8px",
              }}
            />
            <Bar dataKey="score" radius={[10, 10, 10, 10]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Assistant */}
      <div
        className={`rounded-2xl p-6 shadow-xl border backdrop-blur-md ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700"
            : "bg-orange-50 border border-orange-600"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bot className="w-6 h-6 text-orange-400" />
          AI Assistant
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 placeholder-gray-400 ${
              theme === "dark"
                ? "bg-gray-900/60 text-white border-gray-700 focus:ring-orange-500"
                : "bg-white text-black border-orange-600 focus:ring-orange-500"
            }`}
            placeholder="Ask AI about your Reddit activity..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />
          <button
            onClick={handleAiAsk}
            disabled={aiLoading}
            className="px-5 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl shadow-lg font-semibold transition disabled:opacity-50 text-white"
          >
            {aiLoading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 p-5 rounded-xl shadow-inner leading-relaxed whitespace-pre-line ${
              theme === "dark"
                ? "bg-gray-900/70 border border-gray-700 text-gray-100"
                : "bg-white border border-orange-600 text-gray-800"
            }`}
          >
            {aiResponse}
          </motion.div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
