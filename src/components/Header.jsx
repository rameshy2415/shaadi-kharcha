import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/AuthProvider";
import {
  ArrowRightEndOnRectangleIcon,
  PowerIcon,
  HomeIcon,
  UserCircleIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import brandImage  from "../assets/white_groom_bride.png"
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

  const managePasswordHnadler = () => {
    alert("Feature will be available in next release");
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
        <div className="flex items-center cursor-pointer">
          <div onClick={homeHandler}>
            <img className="size-7 object-cover" src={brandImage} alt="Brand" />
          </div>
          <span className="text-md md:text-xl font-bold ml-2">
            Wedding Expense Tracker
          </span>
        </div>
        <div className="text-sm">
          {!authFlag ? (
            <button
              className="flex items-center justify-end border-1 border-white px-3 py-0 rounded-sm text-lg space-x-1 text-white cursor-pointer"
              onClick={loginHandler}
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center size-8 rounded-full border-2 border-white cursor-pointer">
                <button
                  className="flex items-center justify-center cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {initialsName}
                </button>
              </div>

              {/* Logout Button (Dropdown) */}
              {isOpen && (
                <div className="absolute -bottom-35 -left-48 bg-white shadow-lg rounded-lg border pt-1 w-60">
                  <div className="flex items-center justify-center w-full px-2 py-2 space-x-4 border-b-1 border-gray-200 ">
                    <div>
                      <UserCircleIcon className="size-8 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-md md:text-md text-pink-500 font-bold ">
                        {user?.name}
                      </p>
                      <p className="text-sm md:text-md text-pink-500  ">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center px-2 py-1 hover:bg-gray-100 border-b-1 border-gray-200 ">
                    <button
                      onClick={managePasswordHnadler}
                      className="flex float-left w-full px-2 py-1 text-md text-pink-500 cursor-pointer space-x-2"
                    >
                      <Cog6ToothIcon className="h-5 w-5 text-pink-500  rounded-full" />
                      <span>Manage Password</span>
                    </button>
                    <ChevronRightIcon className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="flex items-center px-2 py-1 hover:bg-gray-100">
                    <button
                      onClick={logoutHandler}
                      className="flex float-left w-full px-2 py-1 text-md text-pink-500 cursor-pointer space-x-2"
                    >
                      <PowerIcon className="h-5 w-5 text-pink-500  rounded-full" />
                      <span>Logout</span>
                    </button>
                    <ChevronRightIcon className="h-5 w-5 text-pink-500" />
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
