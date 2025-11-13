import React from "react";
import { FiSettings, FiLogOut } from "react-icons/fi";

interface ProfilePopupProps {
  onLogout: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ onLogout }) => {
  return (
    <div className="absolute right-14 mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 z-50 top-16 md:top-12 md:right-0">
      <div className="p-3 relative">
        <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200"></div>
        <p className="text-sm font-bold mb-2">Hello, Admin!</p>
        <button className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 transition" onClick={onLogout}>
          <FiLogOut className="mr-2 w-4 h-4" />
          Logout
        </button>
        <button className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 transition">
          <FiSettings className="mr-2 w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
