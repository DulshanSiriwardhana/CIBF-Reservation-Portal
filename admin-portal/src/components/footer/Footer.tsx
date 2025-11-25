import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040812] border-t border-[#111d30] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#94a3b8] text-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#20b368] flex items-center justify-center text-[#04110a] font-semibold">
              C
            </div>
            <div>
              <p className="font-semibold text-white">
                © {new Date().getFullYear()} CIBF Admin Portal
              </p>
              <p className="text-xs">All rights reserved</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="font-semibold text-white">Colombo International Book Fair</p>
            <p className="text-xs mt-1 text-[#cbd5f5]">Reservation Management System</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
