import React, { useState } from "react";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/50"></div>
      <div className="relative z-10 w-full max-w-md">
        {isLogin ? <LoginCard onSwitch={toggleForm} /> : <SignupCard onSwitch={toggleForm} />}
      </div>
    </div>
  );
};

export default AuthPage;
