// src/pages/YouTubeAnalysis.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { toast } from "react-toastify";
import { FaRobot } from "react-icons/fa";

export default function YouTubeAnalysis() {
  const { theme } = useContext(ThemeContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState([
    { role: "assistant", content: "Hi — ask me about your channel, videos, or growth." },
  ]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to fetch analytics");
        }
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error("Analytics load error:", err);
        toast.error("Failed to load analytics. Make sure YouTube is connected.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    const userMsg = { role: "user", content: message.trim() };
    setChat((c) => [...c, userMsg]);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMsg.content }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Assistant error");
      }
      const json = await res.json();
      const reply = json.reply || json.answer || json.data || "No answer";
      setChat((c) => [...c, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Assistant error:", err);
      setChat((c) => [...c, { role: "assistant", content: "Sorry — assistant failed to respond." }]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-xl">Loading your channel analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold">No analytics available</h2>
            <p className="mt-2 text-sm text-gray-500">Connect your YouTube channel first.</p>
          </div>
        </div>
      </div>
    );
  }

  const { channel, topVideos } = analytics;

  // Chart data
  const chartData = (topVideos || []).map((v) => ({
    title: v.title,
    views: Number(v.views || 0),
    likes: Number(v.likes || 0),
  }));

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-cyan-50 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">YouTube Dashboard</h1>
        <ThemeToggle />
      </div>

      {/* channel card */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 p-6 rounded-2xl shadow-xl mb-6 bg-white/5 border"
      >
        <img
          src={channel.thumbnail}
          alt="channel"
          className="w-20 h-20 rounded-full border-2 border-cyan-500"
        />
        <div>
          <h2 className="text-2xl font-semibold">{channel.title}</h2>
          <p className="text-sm text-gray-300 max-w-xl">{channel.description}</p>
          <div className="flex gap-6 mt-3 text-sm flex-wrap">
            <div>👥 <span className="font-semibold">{channel.subscribers}</span> subs</div>
            <div>▶ <span className="font-semibold">{channel.views}</span> views</div>
            <div>🎬 <span className="font-semibold">{channel.videos}</span> videos</div>
            {channel.country && (
              <div>🌍 <span className="font-semibold">{channel.country}</span></div>
            )}
            {channel.publishedAt && (
              <div>📅 Joined {new Date(channel.publishedAt).toLocaleDateString()}</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: charts */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`p-4 rounded-2xl shadow-lg ${
              theme === "dark" ? "bg-white/5" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Top Videos by Views & Likes</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="likes" stroke="#f97316" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl shadow-lg ${
              theme === "dark" ? "bg-white/5" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">Top Videos List</h3>
            <div className="space-y-3">
              {(topVideos || []).map((v) => (
                <div
                  key={v.videoId}
                  className="flex gap-4 items-center p-3 rounded-lg hover:bg-gray-100/20 transition"
                >
                  <img
                    src={v.thumbnail}
                    alt=""
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{v.title}</div>
                    <div className="text-xs opacity-70">
                      Views: {v.views} • Likes: {v.likes} • Uploaded:{" "}
                      {new Date(v.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm px-3 py-1 rounded-md bg-cyan-600 text-white"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Assistant */}
        <div
          className={`p-4 rounded-2xl shadow-lg ${
            theme === "dark" ? "bg-white/5" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-cyan-600 text-white">
              <FaRobot />
            </div>
            <div>
              <h4 className="font-semibold">AI Assistant</h4>
              <div className="text-xs text-gray-400">
                Ask questions about this channel (insights, growth tips, content ideas)
              </div>
            </div>
          </div>

          <div className="h-72 overflow-y-auto p-3 mb-3 rounded-md border bg-transparent">
            {chat.map((m, i) => (
              <div
                key={i}
                className={`mb-3 flex ${
                  m.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-xs rounded-2xl shadow-md ${
                    m.role === "assistant"
                      ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg bg-transparent border outline-none"
              placeholder="Ask about your channel..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
