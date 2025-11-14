import React, { useState } from "react";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white background-default">
      <div className="w-full h-full flex items-center justify-center backdrop-blur-sm backdrop-brightness-20 p-4">
        {isLogin ? <LoginCard onSwitch={toggleForm} /> : <SignupCard onSwitch={toggleForm} />}
      </div>
    </div>
  );
};

export default AuthPage;
