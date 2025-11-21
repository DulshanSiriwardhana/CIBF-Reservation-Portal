import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { FiLock, FiUser, FiLoader } from "react-icons/fi";

const LoginCard: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      showToast("Login successful!", "success");
    } catch (error: any) {
      showToast(error.message || "Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl text-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border-2 border-white/30 transform transition-all hover:scale-[1.02]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
          <FiLock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 font-medium">Sign in to your admin account</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all font-medium"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 font-medium">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-indigo-600 font-bold hover:text-purple-600 hover:underline transition-colors"
          disabled={loading}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
