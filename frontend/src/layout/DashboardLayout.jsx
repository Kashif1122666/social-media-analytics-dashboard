import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex-1  bg-gradient-to-br from-black via-[#0a0a0a] to-[#050505]">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block fixed w-64 h-full z-40">
        <Sidebar isOpen={true} />
      </div>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-60 md:hidden">
          <div className="w-64 bg-black h-full">
            <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile topbar */}
        <div className="md:hidden px-4 py-3 border-b border-cyan-700 flex items-center justify-between">
          <button onClick={toggleSidebar} className="text-cyan-400">
            <FaBars size={22} />
          </button>
          <h1 className="text-lg font-bold text-cyan-300">AI Dashboard</h1>
        </div>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;