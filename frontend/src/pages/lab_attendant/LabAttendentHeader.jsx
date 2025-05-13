import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import logo from '../../assets/images/logo.png';


const LabAttendentHeader = () => {
  return (
    <header className="bg-[#397eff] text-white fixed top-0 left-0 w-full h-[80px] px-6 flex items-center justify-between z-50 shadow-md">
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <img
          className="w-[40px] h-[40px] rounded-full"
          src={logo}
          alt="Logo"
        />
        <h2 className="text-xl font-semibold">Resourcify</h2>
      </Link>
      <div className="flex items-center gap-6">
        <nav className="hidden gap-6 md:flex">
          <Link to="/desk" className="hover:underline">Dashboard</Link>
          <Link to="/settings" className="hover:underline">Settings</Link>
          <Link to="/help" className="hover:underline">Help & Center</Link>
        </nav>
        <div className="relative">
          <button className="flex items-center gap-2">
            {/* <img
              src="https://placehold.co/32x32"
              alt="User"
              className="w-8 h-8 rounded-full"
            /> */}
            {/* <IoIosArrowDown /> */}
          </button>
          {/* Dropdown - add JS logic for toggling if needed */}
        </div>
      </div>
    </header>
  );
};

export default LabAttendentHeader;
