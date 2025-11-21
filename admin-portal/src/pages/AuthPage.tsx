import React, { useState } from "react";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 background-default relative overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-2xl transform hover:scale-110 transition-transform">
            <span className="text-white font-black text-3xl">C</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">CIBF Portal</h1>
          <p className="text-indigo-200 font-medium">Welcome to the Admin Portal</p>
        </div>
        {isLogin ? <LoginCard onSwitch={toggleForm} /> : <SignupCard onSwitch={toggleForm} />}
      </div>
    </div>
  );
};

export default AuthPage;
