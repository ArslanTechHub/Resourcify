import React, { useEffect, useState } from 'react';
import { FaSearch, FaComment, FaFilter, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms, requestBooking } from '../../../redux/actions/room';
import { formatDateAndTime } from '../../../utils/date';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DiscussionRoomView = () => {
  const dispatch = useDispatch();
  const { rooms } = useSelector((state) => state.room);
  const currentUser = useSelector((state) => state.auth?.user || {});

  const [loading, setLoading] = useState(true);
  const [searchLibrary, setSearchLibrary] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  // Pagination states
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllRooms());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleBookingSubmit = async () => {
    try {
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);

      if (startDateObj.toDateString() !== endDateObj.toDateString()) {
        toast.error('Start and End date must be on the same day!');
        return;
      }

      const availabilityStartTime = new Date(
        `${startDateObj.toDateString()} ${selectedRoom.availabilityHours.start}`
      );
      const availabilityEndTime = new Date(
        `${startDateObj.toDateString()} ${selectedRoom.availabilityHours.end}`
      );

      if (startDateObj < availabilityStartTime || startDateObj > availabilityEndTime) {
        toast.error(
          `Start time must be within availability: ${selectedRoom.availabilityHours.start} - ${selectedRoom.availabilityHours.end}`
        );
        return;
      }

      if (endDateObj < availabilityStartTime || endDateObj > availabilityEndTime) {
        toast.error(
          `End time must be within availability: ${selectedRoom.availabilityHours.start} - ${selectedRoom.availabilityHours.end}`
        );
        return;
      }

      await dispatch(
        requestBooking(
          selectedRoom._id,
          currentUser.fullName,
          currentUser.registrationNumber,
          currentUser.email,
          startDateTime,
          endDateTime,
          bookingReason
        )
      );

      toast.success('Booking request submitted successfully!');
      setIsDialogOpen(false);
      setStartDateTime('');
      setEndDateTime('');
      setBookingReason('');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book room.');
    }
  };

  const tableDataRooms = rooms?.map((room) => ({
    _id: room._id,
    date: formatDateAndTime(room.createdAt).formattedDate,
    name: room.name,
    status: room.status || 'N/A',
    availabilityHours: room.availabilityHours || { start: 'N/A', end: 'N/A' },
    capacity: room.capacity || 'N/A',
  })) || [];

  const filteredRooms = tableDataRooms.filter((room) =>
    room.name.toLowerCase().includes(searchLibrary.toLowerCase()) ||
    room.status.toLowerCase().includes(searchLibrary.toLowerCase())
  );

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

  const statusCounts = {
    available: 0,
    pending: 0,
    rejected: 0,
    unknown: 0,
  };

  tableDataRooms.forEach((room) => {
    const status = room.status?.toLowerCase();
    if (status === 'available') statusCounts.available += 1;
    else if (status === 'pending') statusCounts.pending += 1;
    else if (status === 'rejected') statusCounts.rejected += 1;
    else statusCounts.unknown += 1;
  });

  const donutData = {
    labels: ['Available', 'Pending', 'Rejected', 'Unknown'],
    datasets: [
      {
        label: 'Room Status',
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-[250px]">
        <Header />
        <div className="pt-[100px] px-8">
          <h1 className="mb-6 text-2xl font-bold">Discussion Room</h1>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="inline-block w-12 h-12 border-4 border-current rounded-full spinner-border animate-spin border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Room Status Overview</h2>
                <div className="max-w-xs mx-auto">
                  <Doughnut data={donutData} />
                </div>
              </div>

              <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">All Discussion Rooms</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search rooms..."
                      value={searchLibrary}
                      onChange={(e) => {
                        setSearchLibrary(e.target.value);
                        setPage(1);
                      }}
                      className="py-2 pl-10 pr-4 border rounded-md w-72"
                    />
                    <FaSearch className="absolute text-gray-400 top-3 left-3" />
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                      <FaFilter className="mr-2" /> Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Room Name</th>
                        <th className="px-4 py-2 text-left">Availability</th>
                        <th className="px-4 py-2 text-left">Capacity</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginate(filteredRooms, page, entries).length > 0 ? (
                        paginate(filteredRooms, page, entries).map((room, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{room.date}</td>
                            <td className="px-4 py-2">{room.name}</td>
                            <td className="px-4 py-2">
                              {room.availabilityHours.start} - {room.availabilityHours.end}
                            </td>
                            <td className="px-4 py-2">{room.capacity}</td>
                            <td className="px-4 py-2">
                              <span className={`px-3 py-1 rounded-full text-sm 
                                ${room.status === 'available' ? 'text-green-700 bg-green-100' :
                                  room.status === 'pending' ? 'text-yellow-700 bg-yellow-100' :
                                    room.status === 'rejected' ? 'text-red-700 bg-red-100' : 'text-gray-600 bg-gray-100'}`}>
                                {room.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => setSelectedRoom(room) || setIsDialogOpen(true)}
                                className="px-4 py-2 text-white rounded-lg shadow bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                              >
                                Book Now
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                            No rooms found matching your search.
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
                  filteredRooms.length
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isDialogOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Book Room: {selectedRoom.name}</h2>
            <div className="mb-2 text-sm text-gray-700">
              <p><strong>Status:</strong> {selectedRoom.status}</p>
              <p><strong>Availability:</strong> {selectedRoom.availabilityHours.start} - {selectedRoom.availabilityHours.end}</p>
              <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
              <p><strong>Date Added:</strong> {selectedRoom.date}</p>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Start Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">End Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Reason for Booking</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your reason..."
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
                onClick={handleBookingSubmit}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Submit Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionRoomView;