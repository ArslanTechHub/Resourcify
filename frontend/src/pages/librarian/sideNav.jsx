import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaHome, 
  FaBook, 
  FaComments, 
  FaChartBar, 
  FaBell, 
  FaSignOutAlt, 
  FaUser,
  FaDoorOpen,
  FaClipboardList,
  FaCalendarCheck,
  FaPlusCircle,
  FaLayerGroup
} from 'react-icons/fa';
import { assets } from '../../assets';
import { logout } from '../../redux/actions/user';

const NavItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 mb-1 transition-colors rounded-lg ${
      active
        ? 'text-white font-medium bg-[#003b7e]'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className={`text-lg ${active ? 'text-white' : 'text-gray-500'}`}>
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

const LibrarianSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Navigation items grouped by category
  const navItems = [
    {
      category: 'Dashboard',
      items: [
        {
          path: '/librarian-view',
          label: 'Overview',
          icon: <FaChartBar />
        }
      ]
    },
    {
      category: 'Library',
      items: [
        {
          path: '/librarian-view',
          label: 'Library Items',
          icon: <FaBook />
        },
        {
          path: '/librarian/add',
          label: 'Add Item',
          icon: <FaPlusCircle />
        },
        {
          path: '/librarian/requests',
          label: 'Lent Requests',
          icon: <FaClipboardList />
        }
      ]
    },
    {
      category: 'Discussion Rooms',
      items: [
        {
          path: '/librarian/rooms',
          label: 'All Rooms',
          icon: <FaComments />
        },
        {
          path: '/librarian/room/add',
          label: 'Add Room',
          icon: <FaPlusCircle />
        },
        {
          path: '/librarian/bookings',
          label: 'Room Bookings',
          icon: <FaCalendarCheck />
        }
      ]
    },
    {
      category: 'Account',
      items: [
        {
          path: '/librarian/profile',
          label: 'Profile',
          icon: <FaUser />
        }
      ]
    }
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-full pt-[80px] bg-white border-r shadow-sm flex flex-col">
      {/* User Profile Summary */}
      <div className="p-4 mb-4 border-b">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={user?.avatar?.url || assets.logo} 
            alt="User" 
            className="object-cover w-10 h-10 bg-gray-100 rounded-full"
          />
          <div className="overflow-hidden">
            <h3 className="font-medium text-gray-800 truncate">{user?.name || 'Librarian'}</h3>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'librarian@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <h3 className="mb-2 ml-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              {group.category}
            </h3>
            {group.items.map((item, itemIndex) => (
              <NavItem
                key={itemIndex}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 mt-auto border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-left text-red-600 transition-colors rounded-lg hover:bg-red-50"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default LibrarianSidebar;
