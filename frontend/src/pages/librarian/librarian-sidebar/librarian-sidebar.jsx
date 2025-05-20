import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLibraryItem, getAllLibraryItems, updateLibraryItem, createLibraryItem } from '../../../redux/actions/library';
import { FaBook, FaDoorOpen, FaUsers, FaBoxOpen, FaCheckCircle, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdLibraryBooks, MdEventAvailable } from 'react-icons/md';
import { toast } from 'react-toastify';
import LibrarianHeader from '../header';
import LibrarianSidebar from '../sideNav';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LibraryItems = () => {
  const dispatch = useDispatch();
  const { loading, error, message, items } = useSelector(state => state.library);
  const { user } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    subtitle: '',
    type: '',
    author: '',
    edition: '',
    location: '',
    isbn: '',
    publisherCode: '',
    copyright: '',
  });

  const [newItem, setNewItem] = useState({
    title: '',
    subtitle: '',
    type: '',
    author: '',
    edition: '',
    location: '',
    isbn: '',
    publisherCode: '',
    copyright: '',
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);

  useEffect(() => {
    dispatch(getAllLibraryItems());
  }, [dispatch]);

  useEffect(() => {
    if (message) toast.success(message);
    if (error) toast.error(error);
  }, [message, error]);

  const openConfirmDialog = (id) => {
    setSelectedItemId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteLibraryItem(selectedItemId));
      setShowConfirm(false);
      await dispatch(getAllLibraryItems());
      toast.success("Library item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete library item");
    }
  };

  const openEditDialog = (item) => {
    setEditData(item);
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddChange = (e) => {
    setNewItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEdit = async () => {
    try {
      await dispatch(updateLibraryItem(editData._id, editData));
      await dispatch(getAllLibraryItems());
      toast.success("Library item updated successfully");
      setShowEdit(false);
    } catch (error) {
      toast.error("Failed to update library item");
    }
  };

  const submitAdd = async () => {
    try {
      await dispatch(createLibraryItem(newItem));
      await dispatch(getAllLibraryItems());
      toast.success("Library item added successfully");
      setShowAdd(false);
      setNewItem({
        title: '',
        subtitle: '',
        type: '',
        author: '',
        edition: '',
        location: '',
        isbn: '',
        publisherCode: '',
        copyright: '',
      });
    } catch (error) {
      toast.error("Failed to add library item");
    }
  };

  const typeCounts = items?.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentItems = items?.filter(item => new Date(item.createdAt) > thirtyDaysAgo) || [];

  const stats = [
    {
      title: "Total Items",
      count: items?.length || 0,
      icon: <MdLibraryBooks className="text-blue-500" size={24} />,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      title: "Books",
      count: typeCounts?.["Book"] || 0,
      icon: <FaBook className="text-indigo-500" size={24} />,
      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
    {
      title: "Journals",
      count: typeCounts?.["Journal"] || 0,
      icon: <FaBoxOpen className="text-purple-500" size={24} />,
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      title: "Recently Added",
      count: recentItems.length || 0,
      icon: <MdEventAvailable className="text-green-500" size={24} />,
      color: "bg-green-50 border-green-200 text-green-700",
    }
  ];

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

  const filteredItems = items?.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  const itemTypes = [...new Set(items?.map(item => item.type))];

  // Pagination helpers
  const paginate = (data, page, entries) => {
    const start = (page - 1) * entries;
    return data.slice(start, start + entries);
  };

  // Pagination controls
  const renderPagination = (page, setPage, entries, setEntries, filteredTotal) => {
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

  // Reset page if filteredItems changes and page is out of range
  useEffect(() => {
    const totalPages = Math.ceil(filteredItems.length / entries) || 1;
    if (page > totalPages) setPage(1);
  }, [filteredItems, entries, page]);

  return loading ? (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-semibold">Loading...</h1>
    </div>
  ) : (
    <div className="flex flex-col h-screen">
      <div className="h-16"><LibrarianHeader /></div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r"><LibrarianSidebar /></div>
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between"
          >
            <h1 className="text-2xl font-bold text-gray-800">Librarian Dashboard</h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>

          {/* Dashboard Stats */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-lg border ${stat.color} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">{stat.title}</p>
                    <h3 className="mt-1 text-3xl font-bold">{stat.count}</h3>
                  </div>
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/librarian/add" className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-2 mr-3 text-white bg-blue-500 rounded-lg">
                    <FaBook size={18} />
                  </div>
                  <span>Add New Item</span>
                </div>
              </Link>
              
              <Link to="/librarian/requests" className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-2 mr-3 text-white bg-green-500 rounded-lg">
                    <FaCheckCircle size={18} />
                  </div>
                  <span>Manage Requests</span>
                </div>
              </Link>
              
              <Link to="/librarian/room/add" className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-2 mr-3 text-white bg-purple-500 rounded-lg">
                    <FaDoorOpen size={18} />
                  </div>
                  <span>Add Discussion Room</span>
                </div>
              </Link>
              
              <Link to="/librarian/bookings" className="flex items-center justify-between p-4 transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-2 mr-3 text-white bg-yellow-500 rounded-lg">
                    <FaUsers size={18} />
                  </div>
                  <span>Room Bookings</span>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Library Items Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="overflow-hidden bg-white shadow-sm rounded-xl"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-bold text-gray-800">Library Items Management</h2>
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                    />
                    <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                  </div>
                  
                  <select
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">All Types</option>
                    {itemTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setShowAdd(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add New Item
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Sr</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Author</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">ISBN</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginate(filteredItems, page, entries).length > 0 ? (
                    paginate(filteredItems, page, entries).map((i, index) => (
                      <tr key={i._id} className="transition-colors bg-white hover:bg-gray-50">
                        <td className="px-4 py-3">{(page - 1) * entries + index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          <div className="flex flex-col">
                            <span>{i.title}</span>
                            {i.subtitle && <span className="text-xs text-gray-500">{i.subtitle}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">{i.author}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                            {i.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">{i.location}</td>
                        <td className="px-4 py-3">{i.isbn}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditDialog(i)}
                              className="px-4 py-1 text-sm font-normal text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                              title="Edit"
                              style={{ fontWeight: 'normal' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openConfirmDialog(i._id)}
                              className="px-4 py-1 text-sm font-normal text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                              title="Delete"
                              style={{ fontWeight: 'normal' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination(
              page,
              setPage,
              entries,
              setEntries,
              filteredItems.length
            )}
          </motion.div>
        </main>
      </div>

      {/* Add Library Item Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Library Item</h2>
              <button
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                onClick={() => setShowAdd(false)}
              >
                ✕
              </button>
            </div>
            
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newItem.title}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={newItem.subtitle}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  name="type"
                  value={newItem.type}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={newItem.author}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Edition</label>
                <input
                  type="text"
                  name="edition"
                  value={newItem.edition}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newItem.location}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={newItem.isbn}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Publisher Code</label>
                <input
                  type="text"
                  name="publisherCode"
                  value={newItem.publisherCode}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Copyright</label>
                <input
                  type="text"
                  name="copyright"
                  value={newItem.copyright}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </form>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={submitAdd}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Library Item</h2>
              <button
                className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
                onClick={() => setShowEdit(false)}
              >
                ✕
              </button>
            </div>
            
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={editData.subtitle}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  name="type"
                  value={editData.type}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={editData.author}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Edition</label>
                <input
                  type="text"
                  name="edition"
                  value={editData.edition}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={editData.isbn}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Publisher Code</label>
                <input
                  type="text"
                  name="publisherCode"
                  value={editData.publisherCode}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Copyright</label>
                <input
                  type="text"
                  name="copyright"
                  value={editData.copyright}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </form>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={submitEdit}
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this library item? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryItems;