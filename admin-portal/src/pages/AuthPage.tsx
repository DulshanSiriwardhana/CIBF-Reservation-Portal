import React, { useState } from "react";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="surface-card hidden lg:block p-10">
          <span className="badge-dark">CIBF Admin</span>
          <h1 className="mt-6 text-4xl font-semibold text-[#0f172a] leading-tight">
            Navigate the digital landscape for success
          </h1>
          <p className="mt-4 text-[#475569]">
            Manage reservations, stalls, and vendor relationships from a single, beautifully simple workspace.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[#475569]">
            <li>• Real-time metrics and alerts</li>
            <li>• Integrated QR validation</li>
            <li>• Streamlined vendor onboarding</li>
          </ul>
        </div>
        <div className="w-full max-w-md mx-auto">
          {isLogin ? <LoginCard onSwitch={toggleForm} /> : <SignupCard onSwitch={toggleForm} />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
