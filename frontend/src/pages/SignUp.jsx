import React, { useState, useContext, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { toast } from "react-toastify";
import { register } from "../api/authApi.js";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Check for Google OAuth callback token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Google signup successful 🚀");
      window.history.replaceState({}, document.title, "/dashboard"); // clean URL
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 font-['Orbitron'] ${
        theme === "dark"
          ? "bg-gradient-to-br from-black via-[#0a0f1c] to-[#050e1f] text-white"
          : "bg-gradient-to-br from-white via-gray-100 to-cyan-50 text-black"
      }`}
    >
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-md rounded-2xl p-8 shadow-lg backdrop-blur transition-colors duration-500 ${
          theme === "dark"
            ? "bg-white/5 border border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.15)]"
            : "bg-white border border-cyan-600"
        }`}
      >
        <h1
          className={`text-2xl md:text-3xl text-center font-extrabold mb-6 tracking-widest ${
            theme === "dark" ? "text-cyan-400" : "text-cyan-600"
          }`}
        >
          JOIN YOUR AI ANALYTICS COMPANION
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              theme === "dark"
                ? "bg-white/10 border-cyan-400 placeholder:text-gray-300 text-white"
                : "bg-white border-cyan-600 placeholder:text-gray-400 text-black"
            }`}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              theme === "dark"
                ? "bg-white/10 border-cyan-400 placeholder:text-gray-300 text-white"
                : "bg-white border-cyan-600 placeholder:text-gray-400 text-black"
            }`}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                theme === "dark"
                  ? "bg-white/10 border-cyan-400 placeholder:text-gray-300 text-white"
                  : "bg-white border-cyan-600 placeholder:text-gray-400 text-black"
              }`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-600 hover:text-cyan-800"
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                theme === "dark"
                  ? "bg-white/10 border-cyan-400 placeholder:text-gray-300 text-white"
                  : "bg-white border-cyan-600 placeholder:text-gray-400 text-black"
              }`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === "dark" ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-600 hover:text-cyan-800"
              }`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full font-semibold py-2 rounded-xl transition duration-300 shadow-md ${
              theme === "dark" ? "bg-cyan-500 hover:bg-cyan-600 text-black" : "bg-cyan-600 hover:bg-cyan-700 text-white"
            }`}
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center mt-6">
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>OR</span>
        </div>

        <motion.a
          href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
          className={`flex items-center justify-center gap-3 w-full mt-4 font-semibold py-2 rounded-xl shadow-md transition-transform duration-200 hover:scale-105 ${
            theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-cyan-100 text-black hover:bg-cyan-200"
          }`}
        >
          <FcGoogle size={20} />
          Sign up with Google
        </motion.a>

        <p className={`text-sm mt-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
          Already have an account?{" "}
          <a href="/login" className={`hover:underline ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
