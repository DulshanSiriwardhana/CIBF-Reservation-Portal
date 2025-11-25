import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ProfilePopup from "./ProfilePopup";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Stall Management", href: "/stall-management", icon: "🏪" },
  { name: "Reservations", href: "/reservations", icon: "📋" },
  { name: "Vendors", href: "/vendors", icon: "👥" },
  { name: "Map", href: "/map", icon: "🗺️" },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { logout, user } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900">CIBF</div>
              <div className="text-xs text-slate-600 font-medium">Admin Portal</div>
            </div>
          </Link>

          <div className="hidden md:flex space-x-1 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div ref={profileRef} className="ml-4 relative">
              <button
                onClick={toggleProfile}
                className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <FiUser className="w-5 h-5 text-slate-700" />
              </button>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div ref={profileRef} className="relative">
              <button
                onClick={toggleProfile}
                className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"
              >
                <FiUser className="w-5 h-5 text-slate-700" />
              </button>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-6 h-6 text-slate-700" /> : <FiMenu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
