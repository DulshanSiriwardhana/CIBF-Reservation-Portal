import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-white/80">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center font-semibold">
                C
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">CIBF</p>
                <p className="font-semibold text-white">Admin Portal</p>
              </div>
            </div>
            <p>
              Operational platform for the Colombo International Book Fair: stalls, reservations, vendors, and QR validations managed from one secure workspace.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Navigation</p>
            <ul className="space-y-2">
              <li>Dashboard</li>
              <li>Stall Management</li>
              <li>Reservations</li>
              <li>QR Verification</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Contact</p>
            <ul className="space-y-2">
              <li>support@cibf.lk</li>
              <li>+94 11 555 9000</li>
              <li>Colombo, Sri Lanka</li>
              <li>Service Window: 08:00 – 22:00</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">System Status</p>
            <div className="space-y-2 text-sm">
              <p>API Gateway — Operational</p>
              <p>RabbitMQ bus — Operational</p>
              <p>Notification Service — Monitoring</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 text-xs text-white/50 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Colombo International Book Fair. All rights reserved.</p>
          <p>Built for the Book Sellers’ Association • Admin Operations Suite</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
