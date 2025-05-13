import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from "../../redux/actions/room";
import { formatDateAndTime } from "../../utils/date";
import LibrarianSidebar from "./sideNav";
import LibrarianHeader from "./header";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AllBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.room);
  const [processingBookings, setProcessingBookings] = useState({});

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  const handleApprove = async (id) => {
    // Set this specific booking as processing
    setProcessingBookings(prev => ({ ...prev, [id]: 'approve' }));
    
    try {
      await dispatch(approveBooking(id));
    } finally {
      // Remove processing state after completion (success or failure)
      setProcessingBookings(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleReject = async (id) => {
    // Set this specific booking as processing
    setProcessingBookings(prev => ({ ...prev, [id]: 'reject' }));
    
    try {
      await dispatch(rejectBooking(id));
    } finally {
      // Remove processing state after completion (success or failure)
      setProcessingBookings(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  // Function to get action buttons based on status
  const getActionButtons = (item) => {
    const id = item._id;
    const isProcessing = processingBookings[id];
    const currentStatus = item.status || "pending";
    
    return (
      <div className="flex flex-wrap gap-2">
        {/* Approve button - show unless already approved or currently being processed as approval */}
        {(currentStatus !== "approved" || isProcessing === 'reject') && (
          <button
            onClick={() => handleApprove(id)}
            disabled={isProcessing || loading}
            className={`px-3 py-1 text-white rounded transition flex items-center ${
              isProcessing === 'approve'
                ? 'bg-green-600 opacity-80'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isProcessing === 'approve' ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                <span>Approving...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-1" />
                <span>{currentStatus === "rejected" ? "Change to Approved" : "Approve"}</span>
              </>
            )}
          </button>
        )}

        {/* Reject button - show unless already rejected or currently being processed as rejection */}
        {(currentStatus !== "rejected" || isProcessing === 'approve') && (
          <button
            onClick={() => handleReject(id)}
            disabled={isProcessing || loading}
            className={`px-3 py-1 text-white rounded transition flex items-center ${
              isProcessing === 'reject'
                ? 'bg-red-600 opacity-80'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isProcessing === 'reject' ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                <span>Rejecting...</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="mr-1" />
                <span>{currentStatus === "approved" ? "Change to Rejected" : "Reject"}</span>
              </>
            )}
          </button>
        )}

        {/* Status badge */}
        {!isProcessing && currentStatus !== "pending" && (
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            currentStatus === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className="mr-1">
              {currentStatus === 'approved' ? 'Currently Approved' : 'Currently Rejected'}
            </span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-64">
        <LibrarianSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 h-16">
          <LibrarianHeader />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          <h2 className="mb-4 text-2xl font-semibold">All Room Bookings</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="px-3 py-2 border">Sr</th>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">Requested By</th>
                  <th className="px-3 py-2 border">Role</th>
                  <th className="px-3 py-2 border">Room</th>
                  <th className="px-3 py-2 border">Time Duration</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings && bookings.length > 0 ? (
                  bookings.map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="px-3 py-2 border">{index + 1}</td>
                      <td className="px-3 py-2 border">
                        {formatDateAndTime(item.createdAt)?.formattedDate || "-"}
                      </td>
                      <td className="px-3 py-2 border">
                        <div className="flex items-center gap-2">
                          {/* <img
                            src="https://via.placeholder.com/36"
                            alt="User"
                            className="w-[36px] h-[36px] rounded-full object-cover"
                          /> */}
                          <span>{item?.user?.name || item?.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 capitalize border">
                        {item?.user?.role || "-"}
                      </td>
                      <td className="px-3 py-2 border">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              item?.roomId?.coverImage?.url ||
                              "https://via.placeholder.com/100x72"
                            }
                            alt="Room"
                            className="w-[100px] h-[72px] rounded object-cover object-center"
                          />
                          <span>{item?.roomId?.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 border">
                        {formatDateAndTime(item.startTime)?.formattedTime} to{" "}
                        {formatDateAndTime(item.endTime)?.formattedTime}
                      </td>
                      <td className="px-3 py-2 capitalize border">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          (item?.status || "pending") === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : (item?.status || "pending") === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item?.status || "pending"}
                        </span>
                      </td>
                      <td className="px-3 py-2 border">
                        {getActionButtons(item)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-4 text-center" colSpan={8}>
                      {loading ? "Loading..." : "No bookings found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
