import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found</p>
      <p className="mb-8 text-gray-300">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
