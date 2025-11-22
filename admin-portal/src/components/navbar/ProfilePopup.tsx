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
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.username || "Admin"}</p>
            <p className="text-xs text-slate-600 truncate">{user?.email || ""}</p>
            {user?.businessName && (
              <p className="text-xs text-slate-500 truncate">{user.businessName}</p>
            )}
          </div>
        </div>
        <button
          className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700 mb-1"
          onClick={() => {}}
        >
          <FiSettings className="mr-2 w-4 h-4" />
          Settings
        </button>
        <button
          className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
          onClick={onLogout}
        >
          <FiLogOut className="mr-2 w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
