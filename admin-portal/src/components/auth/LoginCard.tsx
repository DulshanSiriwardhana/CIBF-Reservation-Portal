import React from "react";
import { useNavigate } from "react-router-dom";

const LoginCard: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("logged in");
    navigate("/dashboard");
  };

  return (
    <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl max-w-96 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-cyan-600 text-white p-3 rounded-md font-semibold transition cursor-pointer"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-teal-600 font-medium hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
