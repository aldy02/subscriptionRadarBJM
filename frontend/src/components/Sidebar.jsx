import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Wallet,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Data User", icon: Users, path: "/admin/data-user" },
  { name: "Koran", icon: Newspaper, path: "/admin/koran" },
  { name: "Iklan", icon: Megaphone, path: "/admin/iklan" },
  {
    name: "Berita",
    icon: FileText,
    submenu: [
      { name: "Data berita", path: "/admin/berita/data" },
      { name: "Upload Berita", path: "/admin/berita/upload" },
    ],
  },
   { name: "Transaksi", icon: Wallet, path: "/admin/transaksi" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("berita");
  const [user, setUser] = useState({
    name: "Guest",
    email: "guest@example.com",
    avatar: "https://ui-avatars.com/api/?name= ",
  });

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Toggle submenu
  const toggleSubmenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-72 bg-white shadow-lg flex flex-col">
      {/* Top: User profile */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">

          <img
            src={user.profile_photo || `https://ui-avatars.com/api/?name=${user.name}`}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover border" />

          <div>
            <p className="font-semibold text-gray-900 text-base">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

        </div>
      </div>
      {/* Top: user profile */}

      {/* Menu items */}
      <nav className="flex-1 px-4 py-6 space-y-1">

        {/* Mapping menu item */}
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <div key={idx}>
              {item.submenu ? (
                <>
                  {/* Parent */}
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${openMenu === item.name
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}>

                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-gray-500" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform duration-200 text-gray-400 ${openMenu === item.name ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {/* Parent */}

                  {/* Sub from submenu (expand) */}
                  {openMenu === item.name && (
                    <div className="ml-8 mt-2 mb-3 space-y-1">
                      {item.submenu.map((sub, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sub.path}
                          className={`block px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${location.pathname === sub.path
                            ? "text-blue-600 font-medium bg-blue-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >

                          {sub.name}

                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Single menu
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >

                  <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-500"} />
                  <span className="font-medium">{item.name}</span>

                </Link>
              )}
            </div>
          )
        })}
      </nav>
      {/* Menu items */}

      {/* Bottom: Settings & Logout */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-1">

        {/* Pengaturan */}
        <Link
          to="/admin/pengaturan"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === "/admin/pengaturan"
            ? "bg-blue-50 text-blue-600 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >

          <Settings size={20} className={location.pathname === "/admin/pengaturan" ? "text-blue-600" : "text-gray-500"} />
          <span className="font-medium">Pengaturan</span>

        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left">

          <LogOut size={20} className="text-red-500" />
          <span className="font-medium">Logout</span>
        </button>

      </div>
      {/* Bottom: Settings & Logout */}

    </div>
  );
}