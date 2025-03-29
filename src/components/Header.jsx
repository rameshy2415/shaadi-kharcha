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
//bg-gradient-to-r from-pink-500 to-purple-600
  return (
    <header className="bg-pink-500  text-white p-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
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
              className="flex items-center justify-center py-1 border-1 border-white px-3  rounded-sm md:text-lg md:py-0 space-x-1 text-white cursor-pointer"
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

              {/*Profile & Logout Button (Dropdown) */}
              {isOpen && (
                <div className="absolute -bottom-35 -left-48 bg-white shadow-lg rounded-lg border pt-1 w-60">
                  <div className="flex items-center justify-center w-full px-2 py-2 text-pink-700 space-x-4 border-b-1 border-pink-200 ">
                    <div>
                      <UserCircleIcon className="size-8" />
                    </div>
                    <div>
                      <p className="text-md md:text-md  font-bold">
                        {user?.name}
                      </p>
                      <p className="text-sm md:text-md ">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center px-2 py-1 text-pink-700 hover:bg-gray-100 border-b-1 border-pink-200 ">
                    <button
                      onClick={managePasswordHnadler}
                      className="flex float-left w-full px-2 py-1 text-md  cursor-pointer space-x-2"
                    >
                      <Cog6ToothIcon className="h-5 w-5   rounded-full" />
                      <span>Manage Password</span>
                    </button>
                    <ChevronRightIcon className="h-5 w-5 " />
                  </div>
                  <div className="flex items-center px-2 py-1 text-pink-700 hover:bg-gray-100">
                    <button
                      onClick={logoutHandler}
                      className="flex float-left w-full px-2 py-1 text-md cursor-pointer space-x-2"
                    >
                      <PowerIcon className="h-5 w-5  rounded-full" />
                      <span>Logout</span>
                    </button>
                    <ChevronRightIcon className="h-5 w-5" />
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
