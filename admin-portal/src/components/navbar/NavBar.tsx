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
  { name: "QR Scanner", href: "/qr-scanner" },
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
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    
    // Use setTimeout to ensure button click completes first
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    // Close popup first to prevent visual glitch
    setProfileOpen(false);
    // Clear auth state
    logout();
    // Force full page reload to ensure state is cleared and app re-initializes
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black text-white border-b border-[#141f35] backdrop-blur-xl shadow-[0_12px_45px_rgba(3,7,18,0.55)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-lg font-semibold">
              C
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50 mb-1">CIBF</p>
              <p className="text-xl font-semibold text-white">Admin Operations</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                  isActive(item.href)
                    ? "bg-white text-[#0c1428] shadow-lg shadow-black/30"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div ref={profileRef} className="ml-4 relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProfile();
                }}
                className="w-11 h-11 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-white/60 transition-colors"
              >
                <FiUser className="w-5 h-5" />
              </button>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProfile();
                }}
                className="w-11 h-11 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-white/60 transition-colors"
              >
                <FiUser className="w-5 h-5" />
              </button>
              {profileOpen && <ProfilePopup onLogout={handleLogout} user={user} />}
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl border border-white/20 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0c1428] text-white border-t border-white/10 px-4 py-4 space-y-2 backdrop-blur-xl">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`block py-2.5 px-4 text-sm font-semibold rounded-xl ${
                isActive(item.href)
                  ? "bg-white text-[#0c1428]"
                  : "text-white bg-white/10"
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
