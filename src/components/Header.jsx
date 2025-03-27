import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/AuthProvider";
import {
  ArrowRightEndOnRectangleIcon,
  PowerIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
const Header = () => {
  const { setAuthFlag, setUser, user, authFlag } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const initialsName = user?.name.split(" ").map((word) => word.charAt(0));

  const navigate = useNavigate();

  const loginHandler = async () => {
    console.log("loginHandler Click");
    navigate("/login");
  };

  const logoutHandler = () => {
    console.log("logoutHandler Click");
    localStorage.removeItem("token");
    setUser(null);
    setAuthFlag(false);
    setIsOpen(false)
    navigate("/");
  };

  const homeHandler = () => {
    console.log("HomeHandler Click");
   /*  localStorage.removeItem("token");
    setUser(null);
    setAuthFlag(false);
    setIsOpen(false) */
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <HomeIcon className="h-6 w-6 text-white" onClick={homeHandler} />
          <span className="text-md md:text-xl font-bold ml-2">
            Wedding Expense Tracker
          </span>
        </div>
        <div className="text-sm">
          {!authFlag ? (
            <button
              className="flex items-center justify-end border border-white px-1 py-0 rounded-lg text-lg space-x-1 text-white hover:cursor-pointer"
              onClick={loginHandler}
            >
              <ArrowRightEndOnRectangleIcon className="h-5 w-6 text-white" />
              Login
            </button>
          ) : (
            <div className="relative inline-block">
              <button
                className="flex items-center justify-center border-2 border-white px-3 text-md md:text-lg space-x-2 text-white rounded-full hover:cursor-pointer"
                onClick={() => setIsOpen(!isOpen)} 
              >
                 {initialsName}
              </button>
              {/* Logout Button (Dropdown) */}
              {isOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg border p-1 w-20">
                  <button
                    onClick={logoutHandler}
                    className="flex items-center justify-center w-full px-4 py-1 text-md text-red-600 cursor-pointer hover:bg-gray-100 rounded-lg space-x-1"
                  >
                    <PowerIcon className="h-6 w-6 text-red-600" title="Logout"/>
                  </button>
                </div>
              )}
            </div>
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
