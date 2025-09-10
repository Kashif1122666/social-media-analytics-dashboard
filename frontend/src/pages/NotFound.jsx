import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-black"
      }`}
    >
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found</p>
      <p
        className={`mb-8 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
  onClick={() => window.history.back()}
  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition duration-300 ${
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`}
>
  <ArrowLeft className="w-4 h-4" />
  Go Back
</button>
    </div>
  );
};

export default NotFound;
