import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="pt-12 pb-8 text-white bg-[#003b7e]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and About */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={assets.logo} alt="Resourcify Logo" className="w-12 h-12" />
              <h2 className="text-xl font-bold">Resourcify</h2>
            </div>
            <p className="mb-6 text-gray-100 text-[15px] leading-relaxed">
              Your complete library and resource management system for educational institutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-white transition-all bg-[#0049a3] rounded-full hover:bg-[#00377c]">
                <FaFacebookF />
              </a>
              <a href="#" className="p-2 text-white transition-all bg-[#0049a3] rounded-full hover:bg-[#00377c]">
                <FaTwitter />
              </a>
              <a href="#" className="p-2 text-white transition-all bg-[#0049a3] rounded-full hover:bg-[#00377c]">
                <FaInstagram />
              </a>
              <a href="#" className="p-2 text-white transition-all bg-[#0049a3] rounded-full hover:bg-[#00377c]">
                <FaLinkedinIn />
              </a>
              <a href="#" className="p-2 text-white transition-all bg-[#0049a3] rounded-full hover:bg-[#00377c]">
                <FaGithub />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-bold border-b border-[#1d4f8e] pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/library" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Library
                </Link>
              </li>
              <li>
                <Link to="/lab-resources" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Lab Resources
                </Link>
              </li>
              <li>
                <Link to="/discussion-rooms" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Discussion Rooms
                </Link>
              </li>
            </ul>
          </div>
          
          {/* User Access */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-bold border-b border-[#1d4f8e] pb-2">User Access</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/login/teacher" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Teacher Login
                </Link>
              </li>
              <li>
                <Link to="/login/librarian" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Librarian Login
                </Link>
              </li>
              <li>
                <Link to="/login/lab-attendant" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Lab Attendant Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="inline-block text-gray-100 transition-all hover:text-white hover:translate-x-1">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-bold border-b border-[#1d4f8e] pb-2">Contact Us</h3>
            <ul className="space-y-3 not-italic text-gray-100">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#4a8eff]" />
                <div>
                  <p>COMSATS University Islamabad</p>
                  <p>Wah Cantt Campus</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#4a8eff]" />
                <span>info@resourcify.edu</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-[#4a8eff]" />
                <span>(051) 9314381-4</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 mt-8 text-center border-t border-[#1d4f8e]">
          <p className="text-gray-100 text-[14px]">&copy; {new Date().getFullYear()} Resourcify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 