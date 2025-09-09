import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

import { FaYoutube } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export default function YouTubeAnalysis() {
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
          `${import.meta.env.VITE_BACKEND_URL}/auth/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching YouTube data", err);
        setError(
          "Failed to fetch data. Try again and make sure YouTube is connected."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#FF0000",
  ];

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    try {
      setAiLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/analytics`,
        { query: aiQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiResponse(res.data.message);
    } catch (err) {
      console.error("AI request failed", err);
      setAiResponse("AI could not generate advice. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
          theme === "dark"
            ? "text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            : "text-black bg-gradient-to-r from-white via-gray-100 to-cyan-100"
        }`}
      >
        <p className="text-lg animate-pulse">Loading YouTube Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-r from-white via-gray-100 to-cyan-100 text-black"
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

  const { channel, topVideos, insights } = data;

  const trafficData = Array.isArray(insights?.audienceInsights?.trafficSources)
    ? insights.audienceInsights.trafficSources
    : [];

  const growthData = insights?.growthTrends
    ? Object.entries(insights.growthTrends).map(([metric, values]) => ({
        metric,
        current: values.current,
        previous: values.previous,
      }))
    : [];

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 relative ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-white via-gray-100 to-cyan-100 text-black"
      }`}
    >
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Channel Overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <div className="flex items-center space-x-4">
          {channel.thumbnail && (
            <img
              src={channel.thumbnail}
              alt="thumbnail"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {channel.title}
              <a
                href={`https://www.youtube.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-2xl"
              >
                <FaYoutube />
              </a>
            </h1>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              {channel.description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Subscribers", value: channel.subscribers },
            { label: "Views", value: channel.views },
            { label: "Videos", value: channel.videos },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800"
                  : "bg-cyan-50 border border-cyan-600"
              }`}
            >
              <h2 className="text-xl">{item.label}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          className={`rounded-2xl p-6 shadow-lg ${
            theme === "dark"
              ? "bg-gray-800"
              : "bg-cyan-50 border border-cyan-600"
          }`}
        >
          <h2 className="text-xl mb-4">Engagement Rate</h2>
          <p className="text-3xl font-bold">{insights.engagementRate}%</p>
        </div>

       <div
  className={`rounded-2xl p-6 shadow-xl border backdrop-blur-md ${
    theme === "dark" ? "bg-gray-800/80 border-gray-700" : "bg-cyan-50 border border-cyan-600"
  }`}
>
  <h2 className="text-xl mb-4 font-semibold">Top Videos Performance</h2>
  {topVideos.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={topVideos}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        barCategoryGap="20%"
      >
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
          width={150}
        />
        <Tooltip
          cursor={{ fill: theme === "dark" ? "#1f2937" : "#e0f2fe" }}
          contentStyle={{
            backgroundColor: theme === "dark" ? "#0f172a" : "#f9fafb",
            border: "1px solid #0ea5e9",
            color: theme === "dark" ? "#fff" : "#000",
            borderRadius: "8px",
            padding: "8px",
          }}
        />
        <Bar
          dataKey="views"
          name="Views"
          radius={[10, 10, 10, 10]}
          fill="url(#viewsGradient)"
        />
        <Bar
          dataKey="likes"
          name="Likes"
          radius={[10, 10, 10, 10]}
          fill="url(#likesGradient)"
        />
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C49F" />
            <stop offset="100%" stopColor="#00FFAB" />
          </linearGradient>
          <linearGradient id="likesGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF8042" />
            <stop offset="100%" stopColor="#FFAA6B" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
      No video data available
    </p>
  )}
</div>

      </div>

      {/* Traffic Sources */}
      {trafficData.length > 0 && (
        <div
          className={`rounded-2xl p-6 shadow-lg mb-8 ${
            theme === "dark"
              ? "bg-gray-800"
              : "bg-cyan-50 border border-cyan-600"
          }`}
        >
          <h2 className="text-xl mb-4">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficData}
                dataKey="views"
                nameKey="source"
                outerRadius={100}
              >
                {trafficData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#0f172a" : "#f9fafb",
                  border: "1px solid #0ea5e9",
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Videos */}
      <div
        className={`rounded-2xl p-6 shadow-lg mb-8 ${
          theme === "dark"
            ? "bg-gray-800"
            : "bg-cyan-50 border border-cyan-600"
        }`}
      >
        <h2 className="text-xl mb-4">Top Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topVideos.map((video, idx) => (
            <a
              key={idx}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xl flex items-center space-x-4 transition ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-cyan-100 border border-cyan-600"
              } p-4`}
            >
              {video.thumbnail && (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-16 rounded"
                />
              )}
              <div>
                <h3 className="text-lg font-bold">{video.title}</h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Views: {video.views}
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Likes: {video.likes}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <div
        className={`rounded-2xl p-6 shadow-xl border backdrop-blur-md ${
          theme === "dark"
            ? "bg-gray-800/80 border-gray-700"
            : "bg-cyan-50 border border-cyan-600"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-400" />
          AI Assistant
        </h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 placeholder-gray-400 ${
              theme === "dark"
                ? "bg-gray-900/60 text-white border-gray-700 focus:ring-blue-500"
                : "bg-white text-black border-cyan-600 focus:ring-cyan-500"
            }`}
            placeholder="Ask AI about your channel..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
          />
          <button
            onClick={handleAiAsk}
            disabled={aiLoading}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg font-semibold transition disabled:opacity-50 text-white"
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
                : "bg-white border border-cyan-600 text-gray-800"
            }`}
          >
            {aiResponse}
          </motion.div>
        )}
      </div>
    </div>
  );
}
