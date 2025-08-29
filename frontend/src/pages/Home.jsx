import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Selamat Datang, {user?.name || "User"}
      </h1>
      <p className="text-gray-600 mb-6">Role: {user?.role || "guest"}</p>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
}