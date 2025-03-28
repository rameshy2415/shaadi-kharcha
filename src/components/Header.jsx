import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/AuthProvider";
import {
  ArrowRightEndOnRectangleIcon,
  PowerIcon,
  HomeIcon,
  UserCircleIcon,
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
    setIsOpen(false);
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
            <div className="relative">
              <button
                className="flex items-center justify-center border-2 border-white px-3 text-md md:text-lg space-x-2 text-white rounded-full hover:cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                {initialsName}
              </button>
              {/* Logout Button (Dropdown) */}
              {isOpen && (
                <div className="absolute -bottom-25 -left-45 bg-white shadow-lg rounded-lg border pt-1 w-60">
                  <div className="flex items-center justify-center w-full px-2 py-2 space-x-4 border-b-1 border-gray-200 ">
                    <div>
                      <UserCircleIcon className="size-8 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-md md:text-md text-pink-600 font-bold ">
                        {user?.name}
                      </p>
                      <p className="text-sm md:text-md text-pink-600  ">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={logoutHandler}
                      className="flex items-center justify-center w-full px-4 py-1 text-md text-pink-600 cursor-pointer hover:bg-gray-100 space-x-2"
                    >
                      <PowerIcon className="h-5 w-5 text-pink-600 mr-2" />
                      Logout
                    </button>
                  </div>
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
