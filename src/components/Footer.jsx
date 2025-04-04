import React from "react";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

import { ArrowUpIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col justify-between items-center space-y-4 gap-y-2">
        <div
          className="flex items-center flex-col md:flex-row space-x-2 cursor-pointer text-gray-600"
          onClick={scrollToTop}
        >
          <ArrowUpIcon className="size-5 animate-bounce" />{" "}
          <span>Back to Top</span>
        </div>

        <div className="flex text-gray-600 text-center mx-2 md:mx-0">
          <span className="text-sm">
            Registered Address: Techinsights LTD, Magnus House, 3 LowerThames
            Street, Mumbai, IND
          </span>
        </div>

        <div className="flex space-x-4 text-center text-gray-600 mx-2 md:mx-0">
          <span className="text-sm">
            © {new Date().getFullYear()} Techinsights Community. All Rights
            Reserved
          </span>
        </div>

        <div className="flex space-x-2 md:space-x-20">
          <Link
            to="/terms-conditions"
            className="font-small md:font-medium  text-gray-800 hover:text-pink-500 bg-gray-200 py-1 px-2 rounded-md"
          >
            Privacy & Terms
          </Link>
          <Link
            to="/about"
            className="hidden md:block font-small  md:font-medium text-gray-800 hover:text-pink-500 bg-gray-200 py-1 px-2 rounded-md"
          >
            About Techinsights
          </Link>

          <Link
            to="/privacy-policy"
            className="font-small md:font-medium text-gray-800  hover:text-pink-500 bg-gray-200 py-1 px-2 rounded-md"
          >
            Why Trust Us
          </Link>

          <Link
            to="/"
            className="hidden md:block font-small  md:font-medium text-gray-800 hover:text-pink-500 bg-gray-200 py-1 px-2 rounded-md"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="hidden md:block font-small  md:font-medium text-gray-800 hover:text-pink-500 bg-gray-200 py-1 px-2 rounded-md"
          >
            Login
          </Link>

          <Link
            to="/email"
            className="font-small  md:font-medium text-gray-800  hover:text-pink-500 bg-gray-200 py-1 px-2 rounded-md"
          >
            Email us
          </Link>
        </div>

        <div className="flex space-x-4">
          <a
            href="#"
            className="text-pink-500 hover:text-pink-600 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            className="text-pink-500 hover:text-pink-600 transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a
            href="#"
            className="text-pink-500 hover:text-pink-600 transition-colors"
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
