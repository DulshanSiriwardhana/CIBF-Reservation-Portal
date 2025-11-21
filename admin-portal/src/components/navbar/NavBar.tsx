import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ProfilePopup from "./ProfilePopup";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Stall Management", href: "/stall-management" },
  { name: "Map", href: "/map" },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl fixed w-full z-50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 hover:scale-110 transition-all duration-300">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <div>
              <div className="font-black text-2xl tracking-tight text-white">
                CIBF
              </div>
              <div className="text-xs text-white/80 font-semibold tracking-wide">
                Admin Portal
              </div>
            </div>
          </Link>

          <div className="hidden md:flex space-x-1 items-center relative">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-sm backdrop-blur-sm hover:scale-105 active:scale-95 text-white border border-white/10 hover:border-white/30"
              >
                {item.name}
              </Link>
            ))}
            <div ref={profileRef} className="ml-2 relative">
              <div
                className="bg-gradient-to-br from-white to-gray-100 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 border-2 border-white/20"
                onClick={toggleProfile}
              >
                <FiUser className="w-5 h-5 text-emerald-600" />
              </div>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div
              className="bg-gradient-to-br from-white to-gray-100 rounded-full p-2.5 shadow-lg cursor-pointer border-2 border-white/20"
              onClick={toggleProfile}
            >
              <FiUser className="w-5 h-5 text-emerald-600" />
            </div>
            {profileOpen && <ProfilePopup onLogout={handleLogout} />}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-700/95 via-purple-700/95 to-pink-700/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-2 shadow-2xl border-t border-white/10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold text-base backdrop-blur-sm hover:translate-x-2 text-white border border-white/10"
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
