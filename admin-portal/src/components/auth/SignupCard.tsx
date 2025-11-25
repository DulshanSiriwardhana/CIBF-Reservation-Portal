import React, { useState } from "react";
import { apiService } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiLoader } from "react-icons/fi";

const SignupCard: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    businessName: "",
    contactNumber: "",
    role: "VENDOR",
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.businessName || !formData.contactNumber) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (formData.contactNumber.length !== 10 || !/^\d+$/.test(formData.contactNumber)) {
      showToast("Contact number must be exactly 10 digits", "error");
      return;
    }

    setLoading(true);
    try {
      await apiService.register(formData);
      showToast("Registration successful! Please login.", "success");
      setTimeout(() => {
        onSwitch();
      }, 1500);
    } catch (error: any) {
      showToast(error.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101a2c] border border-[#1f2b40] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] p-10 text-white">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#20b368] rounded-2xl mb-5 shadow-lg shadow-black/30">
          <FiUser className="w-7 h-7 text-[#04110a]" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Create Account</h2>
        <p className="text-sm text-[#94a3b8]">Register for admin portal access</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Business Name</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
                disabled={loading}
              >
                <option value="VENDOR" className="bg-[#0b1320]">Vendor</option>
                <option value="EMPLOYEE" className="bg-[#0b1320]">Employee</option>
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-2">Contact Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="10 digits"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={10}
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
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#0b1320] border border-[#1f2b40] rounded-xl text-sm text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#20b368]/60 focus:border-[#20b368]"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold bg-[#20b368] text-[#04110a] shadow-lg shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90"
        >
          {loading ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#94a3b8]">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-[#e4b63f] font-semibold underline decoration-dotted"
          disabled={loading}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupCard;
