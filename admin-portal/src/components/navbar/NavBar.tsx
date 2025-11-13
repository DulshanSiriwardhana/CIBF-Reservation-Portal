import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ProfilePopup from "./ProfilePopup";
import { useNavigate } from "react-router-dom";

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

  const handleLogout = () => navigate('/');

  return (
    <nav className="bg-teal-600 to-cyan-600 text-white shadow-2xl fixed w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <div>
              <div className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
                CIBF
              </div>
              <div className="text-xs text-cyan-100 font-medium tracking-wide">
                Admin Portal
              </div>
            </div>
          </div>

          <div className="hidden md:flex space-x-2 items-center relative">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-base backdrop-blur-sm hover:scale-105 active:scale-95 text-white"
              >
                {item.name}
              </a>
            ))}
            <div ref={profileRef} className="ml-2 relative">
              <div
                className="bg-gradient-to-br from-white to-gray-100 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 border-2 border-white/20"
                onClick={toggleProfile}
              >
                <FiUser className="w-5 h-5 text-emerald-600" />
              </div>
              {profileOpen && <ProfilePopup onLogout={handleLogout} />}
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
        <div className="md:hidden bg-gradient-to-b from-emerald-700/95 to-teal-700/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-2 shadow-2xl border-t border-white/10">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 font-bold text-base backdrop-blur-sm hover:translate-x-2 text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
