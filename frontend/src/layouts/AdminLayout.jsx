import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
        {/* Sidebar desktop */}
      <div className="hidden xl:block">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <>
          {/* Overlay with blur effect */}
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar mobile when open */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 xl:hidden">
            <Sidebar />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1">
        {/* Humberger menu */}
        <div className="flex items-center justify-between p-4 bg-white shadow xl:hidden sticky top-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-700">
            Radar Banjarmasin
          </h1>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}