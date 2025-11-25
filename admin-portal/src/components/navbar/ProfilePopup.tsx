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
    <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-[#1f2b40] bg-[#0c1525] text-white shadow-2xl shadow-black/40 z-50">
      <div className="p-5 border-b border-[#1f2b40]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#facc15] flex items-center justify-center text-black">
            <FiUser className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.username || "Admin"}</p>
            <p className="text-xs text-[#94a3b8] truncate">{user?.email || ""}</p>
            {user?.businessName && (
              <p className="text-xs text-[#94a3b8] truncate mt-1">{user.businessName}</p>
            )}
            <div className="mt-2">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#111f33] border border-[#1f2b40] text-[#facc15]">
                {user?.role || "ADMIN"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#e2e8f0] hover:bg-[#111f33]"
          onClick={() => {}}
        >
          <FiSettings className="mr-3 w-4 h-4" />
          Settings
        </button>
        <button
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#f87171] hover:bg-[#18111f]"
          onClick={onLogout}
        >
          <FiLogOut className="mr-3 w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
