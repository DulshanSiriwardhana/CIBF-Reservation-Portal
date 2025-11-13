import React from "react";

const SignupCard: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  return (
    <div className="bg-white text-black p-8 rounded-2xl shadow-xl max-w-96 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
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
          className="bg-teal-600 hover:bg-cyan-600 text-white p-3 rounded-md font-semibold hover:bg-primary/80 transition cursor-pointer"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-primary font-medium hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupCard;
