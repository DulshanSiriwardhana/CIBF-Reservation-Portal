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
    <div className="bg-white/95 backdrop-blur-xl text-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border-2 border-white/30 transform transition-all hover:scale-[1.02]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
          <FiUser className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600 font-medium">Join the CIBF Admin Portal</p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <FiBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number (10 digits)"
            value={formData.contactNumber}
            onChange={handleChange}
            maxLength={10}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
            disabled={loading}
          />
        </div>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
          disabled={loading}
        >
          <option value="VENDOR">Vendor</option>
          <option value="EMPLOYEE">Employee</option>
        </select>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
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
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 font-medium">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-indigo-600 font-bold hover:text-purple-600 hover:underline transition-colors"
          disabled={loading}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupCard;
