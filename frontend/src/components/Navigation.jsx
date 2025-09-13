import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, Settings, ShoppingBag } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-12 py-3 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="text-xl font-bold text-blue-600">Radar Banjarmasin</div>

      {/* Center: Menu */}
      <div className="hidden md:flex gap-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600 transition">
          Read News
        </Link>
        <Link to="/subscription" className="hover:text-blue-600 transition">
          Subscription
        </Link>
        <Link to="/advertisement" className="hover:text-blue-600 transition">
          Advertisement
        </Link>
      </div>

      {/* Right: Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <User className="h-6 w-6 text-gray-600" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border z-50">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/account-settings");
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/purchase-history");
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <ShoppingBag className="h-4 w-4" />
              Purchase History
            </button>
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="p-2">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </nav>
  );
}