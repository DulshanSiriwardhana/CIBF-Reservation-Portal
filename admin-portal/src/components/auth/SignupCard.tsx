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
    <div className="surface-card p-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f0f0f] text-white shadow-lg shadow-black/25 mb-4">
          <FiUser className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-semibold text-[#0f172a] mb-2">Create account</h2>
        <p className="text-sm text-[#475569]">Register for admin portal access</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/70 focus:border-[#0f172a]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">Business Name</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/70 focus:border-[#0f172a]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/70 focus:border-[#0f172a]"
                disabled={loading}
              >
                <option value="VENDOR" className="bg-white text-[#0f172a]">Vendor</option>
                <option value="EMPLOYEE" className="bg-white text-[#0f172a]">Employee</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/70 focus:border-[#0f172a]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">Contact Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="10 digits"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/70 focus:border-[#0f172a]"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-[0.3em] mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] w-4 h-4" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-[#e1e7ef] rounded-xl text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#b7ff5e]/70 focus:border-[#0f172a]"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold bg-[#b7ff5e] text-[#0f172a] shadow-lg shadow-[#b7ff5e]/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#475569]">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-[#0f0f0f] font-semibold underline decoration-dotted"
          disabled={loading}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupCard;
