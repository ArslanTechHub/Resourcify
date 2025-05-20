import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { FaRegBell, FaUserCircle } from 'react-icons/fa';
import logo from '../../../assets/images/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  const notifications = [
    {
      id: 1,
      title: 'New book added',
      description: 'A new book "Data Structures" has been added to the library',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      title: 'Room booking approved',
      description: 'Your room booking for "Conference Room A" has been approved',
      time: '1 day ago',
      isRead: true
    }
  ];

  // Make sure header is shown on all pages, including desk/overview
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 w-full h-[80px] px-6 flex items-center justify-between z-40 shadow-sm">
      <div className="flex items-center gap-4 ml-[250px]">
        <h2 className="font-medium text-gray-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications */}
        <div className="relative">
          <button 
            className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors rounded-full hover:bg-gray-100 hover:text-blue-500"
            title="Notifications"
          >
            <FaRegBell size={18} />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            className="flex items-center gap-2" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-2 px-2 py-1 transition-colors rounded-full hover:bg-gray-100">
              {user?.avatar?.url ? (
                <img 
                  src={user.avatar.url} 
                  alt="User" 
                  className="object-cover w-8 h-8 border border-gray-200 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.querySelector('.fallback-avatar').style.display = 'flex';
                  }} 
                />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-200 rounded-full">
                  <FaUserCircle size={24} />
                </div>
              )}
              <div className="items-center justify-center hidden w-8 h-8 text-gray-500 bg-gray-200 rounded-full fallback-avatar">
                <FaUserCircle size={24} />
              </div>
              <span className="hidden text-sm font-medium text-gray-700 md:block">{user?.name}</span>
              <IoIosArrowDown className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 z-50 w-56 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Help Center
                  </Link>
                </div>
                <div className="py-1 border-t border-gray-100">
                  <Link to="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign out
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
