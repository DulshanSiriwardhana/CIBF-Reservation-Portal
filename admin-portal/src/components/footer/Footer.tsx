import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} CIBF Admin Portal. All rights reserved.
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">
              Colombo International Book Fair Reservation System
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
