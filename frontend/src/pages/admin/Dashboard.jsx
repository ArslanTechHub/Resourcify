import React, { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaDownload, FaBook, FaComments, FaLaptop, FaCalendarCheck, FaExclamationTriangle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import { useDispatch, useSelector } from "react-redux";
import { getMyRequests } from "../../redux/actions/user";
import { getMyLabResourceRequests } from "../../redux/actions/lab";
import { formatDateAndTime } from "../../utils/date";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { libraryItems, labResources, roomBookings } = useSelector(
    (state) => state.other
  );
  const { myRequests: myLabRequests } = useSelector((state) => state.lab);
  const [loading, setLoading] = useState(true);
  const [searchLibrary, setSearchLibrary] = useState("");
  const [searchRoomBookings, setSearchRoomBookings] = useState("");
  const [searchLab, setSearchLab] = useState("");
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("library");

  // Pagination states for each table
  const [libraryPage, setLibraryPage] = useState(1);
  const [libraryEntries, setLibraryEntries] = useState(5);

  const [roomPage, setRoomPage] = useState(1);
  const [roomEntries, setRoomEntries] = useState(5);

  const [labPage, setLabPage] = useState(1);
  const [labEntries, setLabEntries] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getMyRequests());
      await dispatch(getMyLabResourceRequests());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const formatStatus = (status) => {
    const statusConfig = {
      approved: {
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        icon: <FaCalendarCheck className="mr-2" />
      },
      pending: {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        icon: <FaExclamationTriangle className="mr-2" />
      },
      rejected: {
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        icon: <FaExclamationTriangle className="mr-2" />
      }
    };
    
    const { bgColor, textColor, icon } = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`flex items-center justify-center px-3 py-2 rounded-full ${bgColor} ${textColor} text-sm font-medium`}>
        {icon}
        {status}
      </span>
    );
  };

  const tableDataLibraryItems =
    libraryItems?.map((item) => ({
      date: formatDateAndTime(item.createdAt).formattedDate,
      borrower: item?.user?.fullName || user?.name,
      role: item?.user?.role || user?.role,
      email: item?.user?.email || user?.email,
      phone: item?.user?.phone || "N/A",
      item: item?.item?.title || "N/A",
      startDate: formatDateAndTime(item.createdAt).formattedDate,
      status: item.status || "pending",
    })) || [];

  const tableDataRoomBookings =
    roomBookings?.map((item) => ({
      date: formatDateAndTime(item.createdAt).formattedDate,
      room: item?.roomId?.name || "N/A",
      time: `${formatDateAndTime(item.startTime).formattedTime} to ${
        formatDateAndTime(item.endTime).formattedTime
      }`,
      status: item.status || "pending",
    })) || [];

  const tableDataLabResources =
    (myLabRequests || labResources)?.map((item) => ({
      date: formatDateAndTime(item.createdAt).formattedDate,
      borrower: item?.borrower?.name || user?.name,
      role: item?.borrower?.role || user?.role,
      email: item?.borrower?.email || user?.email,
      phone: item?.phone || user?.phone || "N/A",
      item: item?.item?.title || "N/A",
      status: item.status || "pending",
      image: item?.item?.image?.url || "",
      link: item?.item?.link || "",
    })) || [];

  // Filtering
  const filteredLibraryItems = tableDataLibraryItems.filter(
    (item) =>
      item.borrower.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      item.item.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      item.status.toLowerCase().includes(searchLibrary.toLowerCase())
  );

  const filteredRoomBookings = tableDataRoomBookings.filter(
    (item) =>
      item.room.toLowerCase().includes(searchRoomBookings.toLowerCase()) ||
      item.status.toLowerCase().includes(searchRoomBookings.toLowerCase())
  );

  const filteredLabResources = tableDataLabResources.filter(
    (item) =>
      item.borrower.toLowerCase().includes(searchLab.toLowerCase()) ||
      item.item.toLowerCase().includes(searchLab.toLowerCase()) ||
      item.status.toLowerCase().includes(searchLab.toLowerCase())
  );

  // Pagination helpers
  const paginate = (data, page, entries) => {
    const start = (page - 1) * entries;
    return data.slice(start, start + entries);
  };

  // Dashboard summary stats
  const stats = [
    {
      title: "Library Requests",
      count: tableDataLibraryItems.length,
      icon: <FaBook className="text-blue-500" size={24} />,
      color: "bg-blue-50 border-blue-200",
      pending: tableDataLibraryItems.filter(item => item.status === "pending").length
    },
    {
      title: "Room Bookings",
      count: tableDataRoomBookings.length,
      icon: <FaComments className="text-purple-500" size={24} />,
      color: "bg-purple-50 border-purple-200",
      pending: tableDataRoomBookings.filter(item => item.status === "pending").length
    },
    {
      title: "Lab Resources",
      count: tableDataLabResources.length,
      icon: <FaLaptop className="text-green-500" size={24} />,
      color: "bg-green-50 border-green-200",
      pending: tableDataLabResources.filter(item => item.status === "pending").length
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  // Pagination controls
  const renderPagination = (page, setPage, entries, setEntries, total, filteredTotal) => {
    const totalPages = Math.ceil(filteredTotal / entries) || 1;
    const canPrev = page > 1;
    const canNext = page < totalPages;
    const showingFrom = filteredTotal === 0 ? 0 : (page - 1) * entries + 1;
    const showingTo = Math.min(page * entries, filteredTotal);

    return (
      <div className="flex items-center justify-between mt-4">
        {/* Left: Pagination numbers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => canPrev && setPage(page - 1)}
            disabled={!canPrev}
            className={`p-2 rounded ${canPrev ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"}`}
          >
            <FaChevronLeft />
          </button>
          <span className="font-medium">{page}</span>
          <button
            onClick={() => canNext && setPage(page + 1)}
            disabled={!canNext}
            className={`p-2 rounded ${canNext ? "hover:bg-gray-200" : "opacity-50 cursor-not-allowed"}`}
          >
            <FaChevronRight />
          </button>
        </div>
        {/* Right: Showing entries and dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {showingFrom} to {showingTo} of {filteredTotal} entries
          </span>
          <select
            value={entries}
            onChange={e => {
              setEntries(Number(e.target.value));
              setPage(1);
            }}
            className="ml-2 border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        <Header />
        <div className="py-8 pt-[100px] px-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between"
          >
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Dashboard Summary Stats */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-lg border ${stat.color} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">{stat.title}</p>
                    <h3 className="mt-1 text-3xl font-bold">{stat.count}</h3>
                    {stat.pending > 0 && (
                      <p className="mt-1 text-sm text-yellow-600">
                        {stat.pending} pending
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs Navigation */}
          <div className="mb-6 border-b">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("library")}
                className={`pb-4 px-2 font-medium text-sm transition-colors ${
                  activeTab === "library"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaBook className="inline mr-2" />
                Library Requests
              </button>
              <button
                onClick={() => setActiveTab("rooms")}
                className={`pb-4 px-2 font-medium text-sm transition-colors ${
                  activeTab === "rooms"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaComments className="inline mr-2" />
                Room Bookings
              </button>
              <button
                onClick={() => setActiveTab("lab")}
                className={`pb-4 px-2 font-medium text-sm transition-colors ${
                  activeTab === "lab"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaLaptop className="inline mr-2" />
                Lab Resources
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 border-4 border-blue-300 rounded-full border-t-blue-500 border-b-blue-700 animate-spin"
                  role="status"
                ></div>
                <p className="mt-4 text-gray-600">Loading your data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Library Items */}
              {activeTab === "library" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Library Items Requests
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search library items..."
                          value={searchLibrary}
                          onChange={(e) => {
                            setSearchLibrary(e.target.value);
                            setLibraryPage(1);
                          }}
                          className="w-64 py-2 pl-10 pr-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        <FaSearch className="absolute text-gray-400 top-3 left-3" />
                      </div>
                      <button className="flex items-center px-4 py-2 text-sm transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
                        <FaFilter className="mr-2" /> Filter
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="text-sm text-gray-600 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-left">Date</th>
                          <th className="px-4 py-3 font-medium text-left">Borrower</th>
                          <th className="px-4 py-3 font-medium text-left">Role</th>
                          <th className="px-4 py-3 font-medium text-left">Email</th>
                          <th className="px-4 py-3 font-medium text-left">Item</th>
                          <th className="px-4 py-3 font-medium text-left">Start Date</th>
                          <th className="px-4 py-3 font-medium text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginate(filteredLibraryItems, libraryPage, libraryEntries).length > 0 ? (
                          paginate(filteredLibraryItems, libraryPage, libraryEntries).map((row, index) => (
                            <tr 
                              key={index} 
                              className="transition-colors hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm">{row.date}</td>
                              <td className="px-4 py-3 text-sm font-medium">{row.borrower}</td>
                              <td className="px-4 py-3 text-sm capitalize">{row.role}</td>
                              <td className="px-4 py-3 text-sm">{row.email}</td>
                              <td className="px-4 py-3 text-sm">{row.item}</td>
                              <td className="px-4 py-3 text-sm">{row.startDate}</td>
                              <td className="px-4 py-3 text-sm">
                                {formatStatus(row.status)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                              No library items found matching your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(
                    libraryPage,
                    setLibraryPage,
                    libraryEntries,
                    setLibraryEntries,
                    tableDataLibraryItems.length,
                    filteredLibraryItems.length
                  )}
                </motion.div>
              )}

              {/* Room Bookings */}
              {activeTab === "rooms" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Discussion Room Bookings
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search room bookings..."
                          value={searchRoomBookings}
                          onChange={(e) => {
                            setSearchRoomBookings(e.target.value);
                            setRoomPage(1);
                          }}
                          className="w-64 py-2 pl-10 pr-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        />
                        <FaSearch className="absolute text-gray-400 top-3 left-3" />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="text-sm text-gray-600 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-left">Date</th>
                          <th className="px-4 py-3 font-medium text-left">Room</th>
                          <th className="px-4 py-3 font-medium text-left">Time</th>
                          <th className="px-4 py-3 font-medium text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginate(filteredRoomBookings, roomPage, roomEntries).length > 0 ? (
                          paginate(filteredRoomBookings, roomPage, roomEntries).map((row, index) => (
                            <tr 
                              key={index} 
                              className="transition-colors hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm">{row.date}</td>
                              <td className="px-4 py-3 text-sm font-medium">{row.room}</td>
                              <td className="px-4 py-3 text-sm">{row.time}</td>
                              <td className="px-4 py-3 text-sm">
                                {formatStatus(row.status)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                              No room bookings found matching your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(
                    roomPage,
                    setRoomPage,
                    roomEntries,
                    setRoomEntries,
                    tableDataRoomBookings.length,
                    filteredRoomBookings.length
                  )}
                </motion.div>
              )}

              {/* Lab Resources */}
              {activeTab === "lab" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Lab Resources Requests
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search lab resources..."
                          value={searchLab}
                          onChange={(e) => {
                            setSearchLab(e.target.value);
                            setLabPage(1);
                          }}
                          className="w-64 py-2 pl-10 pr-4 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                        />
                        <FaSearch className="absolute text-gray-400 top-3 left-3" />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="text-sm text-gray-600 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 font-medium text-left">Date</th>
                          <th className="px-4 py-3 font-medium text-left">Borrower</th>
                          <th className="px-4 py-3 font-medium text-left">Role</th>
                          <th className="px-4 py-3 font-medium text-left">Email</th>
                          <th className="px-4 py-3 font-medium text-left">Phone</th>
                          <th className="px-4 py-3 font-medium text-left">Item</th>
                          <th className="px-4 py-3 font-medium text-left">Status</th>
                          <th className="px-4 py-3 font-medium text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginate(filteredLabResources, labPage, labEntries).length > 0 ? (
                          paginate(filteredLabResources, labPage, labEntries).map((row, index) => (
                            <tr 
                              key={index} 
                              className="transition-colors hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm">{row.date}</td>
                              <td className="px-4 py-3 text-sm font-medium">{row.borrower}</td>
                              <td className="px-4 py-3 text-sm capitalize">{row.role}</td>
                              <td className="px-4 py-3 text-sm">{row.email}</td>
                              <td className="px-4 py-3 text-sm">{row.phone}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-3">
                                  {row.image && (
                                    <img
                                      src={row.image}
                                      alt={row.item}
                                      className="object-cover w-10 h-10 rounded-md"
                                    />
                                  )}
                                  <span>{row.item}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {formatStatus(row.status)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {row.status === "approved" && row.link && (
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={row.link}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md shadow-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                  >
                                    Access
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                              No lab resources found matching your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(
                    labPage,
                    setLabPage,
                    labEntries,
                    setLabEntries,
                    tableDataLabResources.length,
                    filteredLabResources.length
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;