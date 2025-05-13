import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosNotificationsOutline, IoIosSearch } from 'react-icons/io';
import { assets } from '../../assets';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { logout } from '../../redux/actions/user';

const LibrarianHeader = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-[#003b7e] text-white fixed top-0 left-0 w-full h-[80px] px-6 flex items-center justify-between z-50 shadow-md">
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <img
          className="w-[40px] h-[40px]"
          src={assets.logo}
          alt="Logo"
        />
        <h2 className="text-xl font-semibold">Resourcify</h2>
      </Link>
      
      <div className="flex items-center gap-6">
        <nav className="hidden gap-6 md:flex">
          <Link to="/librarian-view" className="text-white hover:underline">Dashboard</Link>
          <Link to="/librarian/requests" className="text-white hover:underline">Requests</Link>
          <Link to="/librarian/bookings" className="text-white hover:underline">Bookings</Link>
        </nav>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 bg-[#00347f] hover:bg-[#002e73] px-3 py-1.5 rounded-full"
            onClick={() => setVisible(!visible)}
          >
            {user?.name || 'Librarian'}
            <IoIosArrowDown />
          </button>
          
          {visible && (
            <div className="absolute right-0 w-48 py-2 text-gray-800 bg-white rounded-lg shadow-lg top-12">
              <Link 
                to="/librarian/profile" 
                className="flex items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => setVisible(false)}
              >
                <FaUser className="mr-2" /> Profile
              </Link>
              <button 
                onClick={() => {
                  setVisible(false);
                  handleLogout();
                }} 
                className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LibrarianHeader;
