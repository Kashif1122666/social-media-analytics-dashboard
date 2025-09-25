// src/pages/OAuthPage.jsx
import { motion } from "framer-motion";
import { FaYoutube, FaLinkedin, FaReddit } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

export default function OAuthPage() {
  const { theme } = useContext(ThemeContext);

  // 🔹 Check for token in URL after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("YouTube connected successfully!");
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const oauthProviders = [
    {
      name: "YouTube",
      icon: <FaYoutube className="text-red-500 w-14 h-14" />,
      desc: "Connect your YouTube channel to analyze video performance, audience demographics, and subscriber growth trends.",
      features: [
        "Track views, likes, and comments in real-time",
        "Identify your top-performing videos",
        "AI-powered recommendations for audience growth",
      ],
      link: `${import.meta.env.VITE_BACKEND_URL}/auth/youtube`,
    },
    // {
    //   name: "LinkedIn",
    //   icon: <FaLinkedin className="text-blue-600 w-14 h-14" />,
    //   desc: "Get insights into your professional presence by analyzing posts, engagements, and network growth on LinkedIn.",
    //   features: [
    //     "Measure post reach and engagement",
    //     "Analyze company page performance",
    //     "Discover content trends in your industry",
    //   ],
    //   link: `${import.meta.env.VITE_BACKEND_URL}/auth/linkedin`,
    // },
    {
      name: "Reddit",
      icon: <FaReddit className="text-orange-500 w-14 h-14" />,
      desc: "Connect Reddit to uncover community discussions, sentiment analysis, and engagement across subreddits.",
      features: [
        "Track subreddit growth & activity",
        "Analyze user sentiment with AI",
        "Spot trending discussions early",
      ],
      link: `${import.meta.env.VITE_BACKEND_URL}/auth/reddit`,
    },
  ];

  const handleOAuthClick = (provider) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first before connecting accounts.");
        return;
      }

      // 🔹 Attach JWT in `state` query param only for YouTube
      // if (provider.name === "YouTube") {
      //   window.location.href = `${provider.link}?state=${token}`;
      // } else {
      //   window.location.href = provider.link;
      // }
      window.location.href = `${provider.link}?state=${token}`;
    } catch (err) {
      console.error(`${provider.name} OAuth error:`, err);
      toast.error(`Failed to connect ${provider.name}`);
    }
  };

  return (
    <>
    <div
      className={`min-h-screen flex flex-col items-center px-6 py-12 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-cyan-100 text-black"
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-4xl mb-16"
      >
        <h1
          className={`text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-400 to-blue-400"
              : "bg-gradient-to-r from-blue-600 to-cyan-500"
          }`}
        >
          Connect Your Platforms, Unlock Deeper Insights
        </h1>
        <p
          className={`text-lg leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Our platform empowers you to bring together your data from multiple
          social channels. By connecting YouTube, Reddit, and more coming soon, you’ll
          unlock cross-platform analytics powered by AI — helping you grow your
          audience, strengthen your brand, and stay ahead of the competition.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-7xl">
        {oauthProviders.map((provider, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            onClick={() => handleOAuthClick(provider)}
            className={`cursor-pointer rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform ${
              theme === "dark"
                ? "bg-white/5 border border-white/20 text-white hover:border-cyan-400"
                : "bg-cyan-50 border border-cyan-600 text-black hover:border-blue-600"
            }`}
          >
            <div className="flex justify-center mb-6">{provider.icon}</div>
            <h3 className="text-2xl font-bold mb-3">{provider.name}</h3>
            <p
              className={`text-sm mb-4 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {provider.desc}
            </p>
            <ul
              className={`text-left space-y-2 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {provider.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}
