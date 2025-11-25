import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { FiLock, FiUser, FiLoader } from "react-icons/fi";

const LoginCard: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      showToast("Login successful", "success");
      navigate('/dashboard');
    } catch (error: any) {
      showToast(error.message || "Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101a2c] border border-[#1f2b40] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-10 text-white">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#20b368] rounded-2xl mb-5 shadow-lg shadow-black/30">
          <FiLock className="w-7 h-7 text-[#05120a]" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
        <p className="text-sm text-[#94a3b8]">Access the CIBF administration portal</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Username</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold bg-[#20b368] text-[#04110a] shadow-lg shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#94a3b8]">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-[#e4b63f] font-semibold underline decoration-dotted"
          disabled={loading}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
