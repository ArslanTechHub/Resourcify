import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/user";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import { FaRegUser, FaSignInAlt, FaUserPlus, FaChartBar, FaUserCircle } from "react-icons/fa";

const Header = ({ isAuthenticated, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Function to generate initials avatar based on user name
  const getInitialsAvatar = (name) => {
    if (!name) return null;
    const initials = name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Generate a consistent color based on the name
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500',
      'bg-yellow-500', 'bg-teal-500'
    ];
    
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div className={`flex items-center justify-center w-10 h-10 text-white rounded-full ${bgColor}`}>
        <span className="text-sm font-medium">{initials}</span>
      </div>
    );
  };

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const isActive = (path) => {
    return path === location.pathname;
  };

  const dispatch = useDispatch();

  // Always show the header, never hide it
  return (
    <header className={`${scrolled ? 'bg-[#0e345a] shadow-md' : 'bg-[#0e345a]'} lg:px-[50px] px-[25px] lg:h-[85px] h-[80px] fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out text-white`}>
      <nav className="flex items-center justify-between w-full h-full">
        <Link to="/" className="logo h-full flex items-center gap-[8px] cursor-pointer">
          <img className="w-[64px] h-[64px]" src={assets.logo} alt="" />
          <h2 className="text-2xl text-white font-clemente-regular">Resourcify</h2>
        </Link>

        <div className="links gap-[24px] lg:flex hidden">
          {[
            { path: "/", label: "Home", icon: null },
            { path: "/library", label: "Library", icon: null },
            { path: "/lab-resources", label: "Lab Resources", icon: null },
            { path: "/discussion-rooms", label: "Discussion Rooms", icon: null },
          ].map((l, index) => (
            <Link
              className={`text-md flex items-center gap-1.5 ${isActive(l.path) ? "text-white font-gilroy-semibold" : "text-gray-200 font-gilroy-medium"} hover:text-white hover:duration-200 hover:ease-in`}
              key={index}
              to={l.path}
            >
              {l.icon && <span>{l.icon}</span>}
              {l.label}
            </Link>
          ))}
        </div>

        {/* Authentication buttons */}
        {!isAuthenticated ? (
          <div className="flex gap-[12px] items-center">
            <Link to={"/login"} className="flex items-center gap-2 text-gray-200 transition-colors hover:text-white">
              <FaSignInAlt />
              <span className="hidden md:inline">Login</span>
            </Link>
            <Link to={"/register"} className="flex items-center gap-2 px-4 py-2 text-[#0e345a] transition-colors rounded-md bg-white hover:bg-gray-200">
              <FaUserPlus />
              <span className="hidden md:inline">Register</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-[12px]">
            <Link to="/desk" className="items-center hidden gap-2 text-gray-200 transition-colors md:flex hover:text-white">
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
            
            <div className="relative flex items-center gap-2">
              <div className="flex items-center gap-2">
                {user?.avatar?.url && user.avatar.url !== "temp_url" ? (
                  <img
                    className="object-cover object-center w-10 h-10 border border-gray-200 rounded-full"
                    src={user.avatar.url}
                    alt={user?.name || "User"}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.style.display = 'none'; // Hide the img element
                      e.target.parentNode.classList.add('show-fallback'); // Add class to parent to show fallback
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-200 rounded-full">
                    <FaUserCircle size={32} />
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-300 capitalize">{user?.role || "User"}</p>
                </div>
                <button onClick={() => setVisible(!visible)} className="p-1 text-white">
                  <IoIosArrowDown className={`font-[600] text-lg ${visible ? "rotate-180" : ""}`} />
                </button>
              </div>

              {visible && (
                <div className="w-[220px] bg-white border border-zinc-200 p-4 rounded-md absolute top-[50px] right-0 shadow-lg flex flex-col gap-2 z-50">
                  <Link
                    to="/desk"
                    onClick={() => setVisible(false)}
                    className=""
                  >
                    <FaChartBar className="text-gray-600" />
                    <span className="font-medium text-gray-800">Dashboard</span>
                  </Link>
                  
                  <button 
                    className="flex items-center w-full gap-2 p-2 text-white rounded-md bg-accent hover:bg-accent/90" 
                    onClick={() => { 
                      dispatch(logout());
                      setVisible(false);
                    }}
                  >
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
