import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ProfilePopup from "./ProfilePopup";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Stall Management", href: "/stall-management" },
  { name: "Reservations", href: "/reservations" },
  { name: "Vendors", href: "/vendors" },
  { name: "Map", href: "/map" },
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
    <nav className="fixed w-full z-50 border-b border-[#121e32] bg-[#050a15]/95 backdrop-blur-sm shadow-[0_5px_30px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#a3e635] flex items-center justify-center shadow-lg shadow-[#22c55e]/40">
              <span className="text-black font-semibold text-base">C</span>
            </div>
            <div>
              <div className="font-semibold text-base text-white tracking-wide">CIBF</div>
              <div className="text-[11px] uppercase text-[#94a3b8] tracking-[0.2em]">Admin Portal</div>
            </div>
          </Link>

          <div className="hidden md:flex space-x-2 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-[#22c55e] text-black"
                    : "text-[#cbd5f5] hover:text-white hover:bg-[#0f172a]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div ref={profileRef} className="ml-4 relative">
              <button
                onClick={toggleProfile}
                className="w-10 h-10 rounded-xl border border-[#1f2b40] bg-[#0b1320] flex items-center justify-center text-[#e2e8f0]"
              >
                <FiUser className="w-4 h-4" />
              </button>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div ref={profileRef} className="relative">
              <button
                onClick={toggleProfile}
                className="w-10 h-10 rounded-xl border border-[#1f2b40] bg-[#0b1320] flex items-center justify-center text-[#e2e8f0]"
              >
                <FiUser className="w-4 h-4" />
              </button>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg border border-[#1f2b40] text-[#cbd5f5]"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#050a15] border-t border-[#121e32] px-4 py-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block py-2 px-3 text-sm font-medium rounded ${
                isActive(item.href)
                  ? "bg-[#22c55e] text-black"
                  : "text-[#cbd5f5]"
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
