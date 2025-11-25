import React, { useState } from "react";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-[#040812] relative flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 noise-overlay" />
      <div className="w-full max-w-md relative">
        {isLogin ? <LoginCard onSwitch={toggleForm} /> : <SignupCard onSwitch={toggleForm} />}
      </div>
    </div>
  );
};

export default AuthPage;
