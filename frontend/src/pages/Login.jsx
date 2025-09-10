import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { toast } from "react-toastify";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Check for Google OAuth callback token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
         
    const existing = localStorage.getItem("token");
    if (existing) {
      localStorage.removeItem("token");
    }

    // Always set the new token
    localStorage.setItem("token", token);


      toast.success("Google login successful 🚀");
      window.history.replaceState({}, document.title, "/dashboard"); // clean URL
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      localStorage.setItem("token", res.token);
      toast.success("Login successful 🚀");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong while logging in"
      );
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 font-['Orbitron'] ${
      theme === "dark"
        ? "bg-black bg-grid-small-white/[0.1] text-white"
        : "bg-gradient-to-br from-white via-gray-100 to-cyan-50 text-black"
    }`}>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#101f2e] border border-cyan-500 shadow-[0_0_15px_#0ff3,0_0_30px_#00f3ff40]"
            : "bg-white border border-cyan-600"
        }`}
      >
        <h1 className={`text-2xl md:text-3xl text-center font-extrabold mb-6 tracking-widest ${
          theme === "dark" ? "text-cyan-400" : "text-cyan-600"
        }`}>
          AI-POWERED SOCIAL MEDIA ANALYTICS
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 rounded-md border outline-none focus:ring-2 focus:ring-cyan-500 ${
                theme === "dark"
                  ? "bg-black border-cyan-700 placeholder-gray-500 text-white"
                  : "bg-white border-cyan-600 placeholder-gray-400 text-black"
              }`}
              placeholder="robot@ai.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-1 pr-10 rounded-md border outline-none focus:ring-2 focus:ring-cyan-500 ${
                theme === "dark"
                  ? "bg-black border-cyan-700 placeholder-gray-500 text-white"
                  : "bg-white border-cyan-600 placeholder-gray-400 text-black"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className={`absolute right-3 bottom-2.5 ${theme === "dark" ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-600 hover:text-cyan-800"}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 12px #00f3ff" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className={`w-full py-2 font-semibold rounded-md transition-all duration-200 ${
              theme === "dark" ? "bg-cyan-500 hover:bg-cyan-600 text-black" : "bg-cyan-600 hover:bg-cyan-700 text-white"
            }`}
          >
            Log In
          </motion.button>
        </form>

        <div className={`mt-6 border-t pt-4 text-center text-sm ${theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-600"}`}>
          OR
        </div>

        <motion.a
          href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
          className={`mt-4 w-full py-2 rounded-md flex items-center justify-center gap-2 font-semibold transition-all ${
            theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-cyan-100 text-black hover:bg-cyan-200"
          }`}
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.a>

        <p className={`mt-4 text-sm text-center ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
          Don’t have an account?{" "}
          <a href="/signup" className={`hover:underline ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
