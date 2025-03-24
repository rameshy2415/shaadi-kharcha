//import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRightEndOnRectangleIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
const Header = () => {
  const token = localStorage.getItem("token");
  //const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loginHandler = async () => {
    console.log("loginHandler Click");
    navigate("/login");
    //setUser({ user: "ramesh" });
  };

  const logoutHandler = () => {
    console.log("logoutHandler Click");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <WeddingRingIcon />
          <span className="text-xl font-bold ml-2">
            Wedding Expense Tracker
          </span>
        </div>
        <div className="text-sm">
          {/* <p className="opacity-90">Planning your special day made easier</p> */}
          {token == null ? (
            <button
              className="flex items-center text-lg space-x-1 text-white hover:cursor-pointer"
              onClick={loginHandler}
            >
              {" "}
              <ArrowRightEndOnRectangleIcon className="h-6 w-6 text-white" />{" "}
              <span className="hidden md:inline">Login</span>{" "}
            </button>
          ) : (
            <button
              className="flex items-center text-lg space-x-1 text-white hover:cursor-pointer"
              onClick={logoutHandler}
            >
              <PowerIcon className="h-6 w-6 text-white" />{" "}
              <span className="hidden md:inline">Logout</span>{" "}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

// Icon component for the brand logo
const WeddingRingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8"
  >
    <circle cx="8" cy="12" r="4" />
    <circle cx="16" cy="12" r="4" />
  </svg>
);
