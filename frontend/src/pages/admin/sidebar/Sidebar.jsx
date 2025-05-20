import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaHome, 
  FaBook, 
  FaComments, 
  FaSignOutAlt, 
  FaUser, 
  FaThLarge,
  FaChevronRight
} from 'react-icons/fa';
import logo from '../../../assets/images/computer-science-1331579_1280.png';
import { logout } from '../../../redux/actions/user';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(logout());
    navigate('/login'); // Redirect to login page
  };

  const menuItems = [
    {
      path: '/desk',
      name: 'Overview',
      icon: <FaHome />
    },
    {
      path: '/library-items',
      name: 'Library Items',
      icon: <FaBook />
    },
    {
      path: '/discussion-room',
      name: 'Discussion Rooms',
      icon: <FaComments />
    },
    {
      path: '/student-lab-resources',
      name: 'Lab Resources',
      icon: <FaThLarge />
    },
    {
      path: '/user-profile',
      name: 'Profile',
      icon: <FaUser />
    }
  ];

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -250 },
    visible: { 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30 
      } 
    }
  };

  return (
    <motion.aside 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="bg-white fixed top-0 left-0 w-[250px] h-full shadow-lg pt-[80px] border-r border-gray-100 flex flex-col justify-between z-30"
    >
      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <nav className="px-4">
          <div className="px-2 mb-8">
            <h2 className="text-xs font-medium tracking-wider text-gray-400 uppercase">Main Menu</h2>
          </div>
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            {menuItems.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 py-3 px-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-lg ${location.pathname === item.path ? 'text-white' : 'text-blue-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <FaChevronRight className="ml-auto text-xs text-white" />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Profile + Logout Section */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <div className="px-4 py-3 mx-2 rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user?.avatar?.url ? (
                <img className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-sm" src={user.avatar.url} alt={user?.name || 'User'} />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 font-medium text-white rounded-full shadow-sm bg-gradient-to-r from-blue-400 to-indigo-500">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.rollNo || user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-500 hover:bg-red-50"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        </div>
        <div className="px-6 py-3 text-center">
          <p className="text-xs text-gray-400">Resourcify v1.0.0</p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
