import React from "react";

const LoginCard: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  return (
    <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-96 max-w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-md font-semibold hover:bg-primary/80 transition cursor-pointer"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-primary font-medium hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
