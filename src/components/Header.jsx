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

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <HomeIcon className="h-6 w-6 text-white" />
          <span className="text-xl font-bold ml-2">
            Wedding Expense Tracker
          </span>
         {/*  {authFlag && (
            <div className="flex items-center justify-center rounded-lg h-6 w-8  bg-purple-500 text-md font-bold ml-1">
              {initialsName}
            </div>
          )} */}
        </div>
        <div className="text-sm">
          {/* <p className="opacity-90">Planning your special day made easier</p> */}
          {!authFlag ? (
            <button
              className="flex items-center  md:borde border-white px-3 py-0 rounded-lg text-lg space-x-1 text-white hover:cursor-pointer hover:bg-amber-50 hover:text-blue-600"
              onClick={loginHandler}
            >
              <ArrowRightEndOnRectangleIcon className="md:hidden h-6 w-6 text-white" />
              <span className="hidden md:inline">Login</span>
            </button>
          ) : (
            <div className="relative inline-block">
              <button
                className="flex rounded-full items-center justify-center border border-white px-3 py-0 text-lg  space-x-1 text-white hover:cursor-pointer  hover:bg-amber-50 hover:text-blue-600"
                onClick={() => setIsOpen(!isOpen)} 
              >
                {/* <PowerIcon className="md:hidden h-6 w-6 text-white" />
                <span className="hidden md:inline">Logout</span> */}
                 {initialsName}
              </button>
              {/* Logout Button (Dropdown) */}
              {isOpen && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg border p-1 w-20">
                  <button
                    onClick={logoutHandler}
                    className="w-full px-4 py-2 text-md text-red-600 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
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
