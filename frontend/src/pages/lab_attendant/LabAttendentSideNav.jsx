import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaHome,
  FaBook,
  FaComments,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../../assets/images/computer-science-1331579_1280.png";
import { logout } from "../../redux/actions/user";
import { FaThLarge } from "react-icons/fa"; // Add this with your existing icons
import { FaUser } from "react-icons/fa"; // Add this line at the top with other imports
import { FaDoorOpen } from "react-icons/fa"; // updated icons
const LabAttendentSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    console.log("Logging out...");
    dispatch(logout());
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside className="bg-white fixed top-0 left-0 w-[250px] h-full shadow-md pt-[80px] border-r flex flex-col justify-between">
      {/* Navigation Section */}
      <nav className="px-6">
        <br />
        <ul className="space-y-4 text-gray-700 text-sm font-medium">
          <li>
            <Link
              to="/lab_attendant/requests"
              className={`flex items-center gap-3 py-2 hover:text-[#397eff] ${
                location.pathname === "/lab_attendant/requests"
                  ? "text-[#397eff] font-semibold border-r-4 border-[#397eff]"
                  : ""
              }`}
            >
              <FaBook /> Lab Resources Request
            </Link>
          </li>

          <li>
            <Link
              to="/lab_attendant"
              className={`flex items-center gap-3 py-2 hover:text-[#397eff] ${
                location.pathname === "/lab_attendant"
                  ? "text-[#397eff] font-semibold border-r-4 border-[#397eff]"
                  : ""
              }`}
            >
              <FaBook /> Lab Resources
            </Link>
          </li>
          <li>
            <Link
              to="/lab_attendant/add"
              className={`flex items-center gap-3 py-2 hover:text-[#397eff] ${
                location.pathname === "/lab_attendant/add"
                  ? "text-[#397eff] font-semibold border-r-4 border-[#397eff]"
                  : ""
              }`}
            >
              <FaBook />
              Add Lab Resource
            </Link>
          </li>

          <li>
            <Link
              to="/me"
              className={`flex items-center gap-3 py-2 hover:text-[#397eff] ${
                location.pathname === "/me"
                  ? "text-[#397eff] font-semibold border-r-4 border-[#397eff]"
                  : ""
              }`}
            >
              <FaUser /> Profile
            </Link>
          </li>

          {/* <li>
            <Link
              to="/librarian-notifications"
              className={`flex items-center gap-3 py-2 hover:text-[#397eff] ${
                location.pathname === "/librarian-notifications"
                  ? "text-[#397eff] font-semibold border-r-4 border-[#397eff]"
                  : ""
              }`}
            >
              <FaBell /> Notifications
            </Link>
          </li> */}
        </ul>
      </nav>

      {/* Profile + Logout Section */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src={logo} alt="User" />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.rollNo || user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="text-gray-500 hover:text-red-500"
        >
          <FaSignOutAlt size={18} />
        </button>
      </div>
    </aside>
  );
};

export default LabAttendentSidebar;
