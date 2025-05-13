import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { getLabResources } from '../../../redux/actions/lab';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import 'react-toastify/dist/ReactToastify.css';
import LabResource from '../../../components/LabResource';
import { toast } from 'react-toastify';
import { createLendLabResourceRequest } from '../../../redux/actions/lab'; // Make sure this is correctly imported

ChartJS.register(ArcElement, Tooltip, Legend);

const LabResources = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.lab);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [bookingReason, setBookingReason] = useState('');
  const { user, isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getLabResources());
      setLoading(false);
    };
    fetchData();
    console.log('Fetching data...', items);
  }, [dispatch]);

  const filteredItems = items?.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const statusCounts = {
    available: 0,
    unavailable: 0,
    unknown: 0,
  };

 
  const handlelabResourceRequestSubmit = async () => {
    try {
      await dispatch(
        createLendLabResourceRequest(
          user.name,
          user.rollNo,
          user.email,
          '0',
          'N/A',
          selectedResource._id,
          bookingReason
        )
      );
      
      toast.success('Lab resource request submitted successfully!');
      setIsDialogOpen(false); // Close the modal
      setBookingReason(''); // Clear the textarea
    } catch (error) {
      toast.error('Failed to submit the request. Please try again.');
      console.error(error);
    }
  };
  

  items?.forEach((item) => {
    const status = (item.status || 'unknown').toLowerCase();
    if (status === 'available') statusCounts.available++;
    else if (status === 'unavailable') statusCounts.unavailable++;
    else statusCounts.unknown++;
  });

  const donutData = {
    labels: ['Available', 'Unavailable', 'Unknown'],
    datasets: [
      {
        label: 'Lab Resource Status',
        data: [
          statusCounts.available,
          statusCounts.unavailable,
          statusCounts.unknown,
        ],
        backgroundColor: ['#4ade80', '#f87171', '#94a3b8'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        <Header />
        <div className="pt-[100px] px-8">
          <h1 className="mb-6 text-2xl font-bold">Lab Resources</h1>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="inline-block w-12 h-12 border-4 border-current rounded-full spinner-border animate-spin border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Status Overview</h2>
                <div className="max-w-xs mx-auto">
                  <Doughnut data={donutData} />
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">All Lab Resources</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="py-2 pl-10 pr-4 border rounded-md w-72"
                      />
                      <FaSearch className="absolute text-gray-400 top-3 left-3" />
                    </div>
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
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Icon</th>
                        <th className="px-4 py-2 text-left">OS</th>
                        <th className="px-4 py-2 text-left">Version</th>
                        <th className="px-4 py-2 text-left">Size</th>

                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        
                      {filteredItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{item.title}</td>
                          <td className="px-4 py-2 capitalize"> <img className="w-10 h-10 rounded-full" src={item.image.url} /> </td>
                          <td className="px-4 py-2 capitalize">{item.os || 'unknown'}</td>
                          <td className="px-4 py-2 capitalize">{item.version || 'unknown'}</td>
                          <td className="px-4 py-2 capitalize">{item.size || 'unknown'}</td>
                          <td className="px-4 py-2">{item.instructions.slice(0, 50)}...</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => {
                                setSelectedResource(item);
                                setIsDialogOpen(true);
                              }}
                              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                              Request Now
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

      {isDialogOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {selectedResource.title}
            </h2>
            <img
              src={selectedResource.image?.url}
              alt={selectedResource.title}
              className="object-cover w-full h-48 mb-4 rounded"
            />
            <p className="mb-4"><strong>Description:</strong><br /> {selectedResource.instructions}</p>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Purpose</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your purpose..."
                value={bookingReason}
                onChange={(e) => setBookingReason(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handlelabResourceRequestSubmit} 

                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResources;
