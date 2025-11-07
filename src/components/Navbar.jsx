import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  // Base URL for backend (update for production)
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950 text-white py-4 px-6 flex flex-col md:flex-row items-center justify-between border-b border-zinc-800 shadow-md">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 text-xl font-semibold">
        <span className="text-indigo-500">💬</span>
        <Link to="/">AccessLense</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 mt-3 md:mt-0 text-sm items-center">
        {isAuthenticated ? (
          <>
            {!user?.isVerified && (
              <Link
                to="/verify-email"
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Verify Email
              </Link>
            )}

            {/* 👇 Profile Icon / Image */}
            <button
              onClick={() => navigate("/profile-update")}
              className="p-1 rounded-full hover:bg-zinc-800 transition cursor-pointer"
              title="Profile"
            >
              {user?.profilePic ? (
                <img
                  src={
                    user.profilePic.startsWith("http")
                      ? user.profilePic
                      : `${API_BASE_URL}${user.profilePic}`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <img
                  src={`${API_BASE_URL}/Userimage.png`}
                  alt="Default Profile"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                />
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-white hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-md text-white hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 rounded-md text-white hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
