import React from "react";
import { FiSettings, FiLogOut, FiUser } from "react-icons/fi";

interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  businessName?: string;
}

interface ProfilePopupProps {
  onLogout: () => void;
  user: User | null;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ onLogout, user }) => {
  return (
    <div className="absolute right-14 mt-2 w-56 bg-white/95 backdrop-blur-lg text-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 z-50 top-16 md:top-12 md:right-0">
      <div className="p-4 relative">
        <div className="absolute -top-2 right-4 w-4 h-4 bg-white/95 backdrop-blur-lg rotate-45 border-l-2 border-t-2 border-gray-200"></div>
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-800">{user?.username || "Admin"}</p>
            <p className="text-xs text-gray-500 font-medium">{user?.email || ""}</p>
            {user?.businessName && (
              <p className="text-xs text-gray-400">{user.businessName}</p>
            )}
          </div>
        </div>
        <button className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm mb-1" onClick={onLogout}>
          <FiLogOut className="mr-2 w-4 h-4" />
          Logout
        </button>
        <button className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm">
          <FiSettings className="mr-2 w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
