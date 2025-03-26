import React, { useState } from 'react';
import { Menu, X, Home, User, LogOut, Bell, Search } from 'lucide-react';

const HeaderWithSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <Home />, text: 'Home', action: () => {} },
    { icon: <User />, text: 'Manage Profile', action: () => {} },
    { icon: <LogOut />, text: 'Logout', action: () => {} }
  ];

  return (
    <div className="relative">
      {/* Header */}
      <header className="flex items-center justify-between  bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-100">
        {/* Hamburger Menu Icon */}
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu />
        </button>

        {/* App Title or Logo */}
        <div className="text-xl font-bold">MyApp</div>

        {/* Header Icons */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Search />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <Bell />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed top-13 left-0 h-full w-1/5 min-w-[200px] bg-white 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          z-50 shadow-lg pt-16
        `}
      >
        {/* Close Button */}
        <button 
          onClick={toggleSidebar} 
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X />
        </button>

        {/* User Profile Section */}
        <div className="px-4 pb-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500" />
            </div>
            <div>
              <div className="font-semibold">John Doe</div>
              <div className="text-sm text-gray-500">john.doe@example.com</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="pt-4 px-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="
                w-full flex items-center space-x-3 
                p-3 hover:bg-gray-100 rounded-md 
                text-left transition-colors mb-2
              "
            >
              {item.icon}
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
     {/*  <main className="pt-16 p-4">
       
      </main> */}
    </div>
  );
};

export default HeaderWithSidebar;