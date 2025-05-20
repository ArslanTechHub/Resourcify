import React, { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAllLibraryItems } from '../../../redux/actions/library';
import { formatDateAndTime } from '../../../utils/date';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import { createLendItemsRequest } from '../../../redux/actions/library';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const LibraryItemsView = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { items: libraryItems } = useSelector((state) => state.library);
const currentUser = useSelector((state) => state.auth?.user || {});

  const [loading, setLoading] = useState(true);
  const [searchLibrary, setSearchLibrary] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

 
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllLibraryItems());
      setLoading(false);
    };
    console.log("Library Items:", libraryItems)
    fetchData();
    
  }, [dispatch]);

  const tableDataLibraryItems = libraryItems?.map((item) => ({
    id: item._id,
    date: formatDateAndTime(item.createdAt).formattedDate,
    title: item.title,
    status: item.status || 'N/A',
    subtitle: item.subtitle,
    uploadedBy: item?.uploadedBy?.fullName || 'N/A',
    email: item?.uploadedBy?.email || 'N/A',
  })) || [];

  const filteredLibraryItems = tableDataLibraryItems.filter((item) =>
    item.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
    item.status.toLowerCase().includes(searchLibrary.toLowerCase()) ||
    item.uploadedBy.toLowerCase().includes(searchLibrary.toLowerCase())
  );

  const statusCounts = {
    available: 0,
    pending: 0,
    rejected: 0,
    unknown: 0,
  };

  tableDataLibraryItems.forEach((item) => {
    const status = item.status?.toLowerCase();
    if (status === 'available') statusCounts.available += 1;
    else if (status === 'pending') statusCounts.pending += 1;
    else if (status === 'rejected') statusCounts.rejected += 1;
    else statusCounts.unknown += 1;
  });

  const donutData = {
    labels: ['Available', 'Pending', 'Rejected', 'Unknown'],
    datasets: [
      {
        label: 'Status',
        data: [
          statusCounts.available,
          statusCounts.pending,
          statusCounts.rejected,
          statusCounts.unknown,
        ],
        backgroundColor: ['#4ade80', '#facc15', '#f87171', '#94a3b8'],
        borderWidth: 1,
      },
    ],
  };

  const submitHandler = async ({
  id,
  name,
  regNo,
  department,
  email,
  phone,
  startDate,
  endDate,
}) => {
  try {
    console.log("Submitting lend request with details:", id, name, regNo, 'N/A', email, '0', startDate, endDate);
    const response =  dispatch(
      createLendItemsRequest(id, name, regNo, 'N/A', email, 'N/A', startDate, endDate)
    );
    toast.success("Lend request submitted successfully!");
    
  } catch (error) {
    console.error("Error submitting lend request:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setIsDialogOpen(false);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        <Header />
        <div className="pt-[100px] px-8">
          <h1 className="mb-6 text-2xl font-bold">Library Items View</h1>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="inline-block w-12 h-12 border-4 border-current rounded-full spinner-border animate-spin border-t-transparent" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Donut Chart */}
              <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Library Item Status Overview</h2>
                <div className="max-w-xs mx-auto">
                  <Doughnut data={donutData} />
                </div>
              </div>

              {/* Table Section */}
              <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">All Library Items</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchLibrary}
                      onChange={(e) => setSearchLibrary(e.target.value)}
                      className="py-2 pl-10 pr-4 border rounded-md w-72"
                    />
                    <FaSearch className="absolute text-gray-400 top-3 left-3" />
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                      <FaFilter className="mr-2" /> Filter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                      <FaDownload className="mr-2" /> Export
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Subtitle</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Uploaded By</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredLibraryItems.map((row, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{row.date}</td>
                          <td className="px-4 py-2">{row.title}</td>
                          <td className="px-4 py-2">{row.subtitle}</td>
                          <td className="px-4 py-2">
                            <span className={`px-3 py-1 rounded-full text-sm 
                              ${row.status === 'available' ? 'text-green-700 bg-green-100' :
                                row.status === 'pending' ? 'text-yellow-700 bg-yellow-100' :
                                  row.status === 'rejected' ? 'text-red-700 bg-red-100' : 'text-gray-600 bg-gray-100'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{row.uploadedBy}</td>
                          <td className="px-4 py-2">{row.email}</td>
                          <td className="px-4 py-2">
                            <button
                            //   className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                            className="px-4 py-2 text-white rounded-lg shadow bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"

                              onClick={() => {
                                setSelectedItem({
                                  ...row,
                                  fromDate: '',
                                  toDate: '',
                                });
                                setIsDialogOpen(true);
                              }}
                            >
                              Lend Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </>
          )}
        </div>
      </div>

      {/* Lend Dialog Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Lend Library Item</h2>
            <p className="mb-2"><strong>Title:</strong> {selectedItem?.title}</p>
            <p className="mb-2"><strong>Subtitle:</strong> {selectedItem?.subtitle}</p>
            <p className="mb-4"><strong>Uploaded By:</strong> {selectedItem?.uploadedBy}</p>

            {/* 📅 Date Range Picker */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">From Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={selectedItem?.fromDate || ''}
                onChange={(e) =>
                  setSelectedItem((prev) => ({ ...prev, fromDate: e.target.value }))
                }
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">To Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={selectedItem?.toDate || ''}
                onChange={(e) =>
                  setSelectedItem((prev) => ({ ...prev, toDate: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
               onClick={() => {
                const lendingDetails = {
                  id: selectedItem.id,
                  name: user.name,
                  regNo: user.rollNo,
                  department: user.department,
                  email: user.email,
                  phone: user.phone,
                  startDate: selectedItem.fromDate,
                  endDate: selectedItem.toDate,
                };
              
                submitHandler(lendingDetails);
              }}
              
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Confirm Lend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryItemsView;
