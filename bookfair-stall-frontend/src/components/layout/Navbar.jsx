import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaBars, FaTimes, FaSignInAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = ({ onShowProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/stalls', label: 'Browse Stalls' },
    { path: '/map', label: 'Stall Map' },
    { path: '/genres', label: 'Genres'},
    { path: '/my-reservations', label: 'My Reservations' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <FaBook className="text-3xl group-hover:rotate-12 transition-transform duration-300" />
            <div>
              <h1 className="text-2xl font-bold">Colombo Bookfair</h1>
              <p className="text-sm text-primary-100">Stall Reservation Portal</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path) ? 'bg-white text-primary-600' : 'hover:bg-primary-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={onShowProfile}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-white text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <FaUserCircle />
                  <span>{user.username}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-all duration-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 ml-4 rounded-lg font-medium bg-white text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-500 transition-colors"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.path) ? 'bg-white text-primary-600' : 'hover:bg-primary-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <button
                  onClick={() => {
                    onShowProfile();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 mt-2 rounded-lg font-medium bg-white text-primary-600 hover:bg-primary-50 transition-all duration-200"
                >
                  <FaUserCircle />
                  <span>{user.username}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-3 mt-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-all duration-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 w-full px-4 py-3 mt-2 rounded-lg font-medium bg-white text-primary-600 hover:bg-primary-50 transition-all duration-200"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;