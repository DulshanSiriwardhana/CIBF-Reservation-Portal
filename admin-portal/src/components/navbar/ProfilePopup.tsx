import React from "react";
import { FiLogOut, FiUser } from "react-icons/fi";

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
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute right-0 mt-3 w-72 rounded-2xl border border-[#e1e7ef] bg-white text-[#0f172a] shadow-[0_18px_65px_rgba(15,23,42,0.15)] z-50"
      onClick={handleClick}
      onMouseDown={handleClick}
    >
      <div className="p-5 border-b border-[#e1e7ef]">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f0f0f] flex items-center justify-center text-white">
            <FiUser className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.username || "Admin"}</p>
            <p className="text-xs text-[#64748b] truncate">{user?.email || ""}</p>
            {user?.businessName && (
              <p className="text-xs text-[#94a3b8] truncate mt-1">{user.businessName}</p>
            )}
            <div className="mt-2">
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f1f5f9] border border-[#e1e7ef] text-[#0f172a]">
                {user?.role || "ADMIN"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button
          type="button"
          className="flex items-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onLogout();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <FiLogOut className="mr-3 w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
