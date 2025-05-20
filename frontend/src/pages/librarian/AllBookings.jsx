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
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AllBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.room);
  const [processingBookings, setProcessingBookings] = useState({});
  const [search, setSearch] = useState(""); // Search state

  // Pagination states
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);

  // Donut chart state
  const [donutData, setDonutData] = useState(null);
  const [donutLoading, setDonutLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  useEffect(() => {
    setDonutLoading(true);
    // Count statuses
    const statusCounts = { approved: 0, pending: 0, rejected: 0, unknown: 0 };
    (bookings || []).forEach((item) => {
      const status = (item.status || "unknown").toLowerCase();
      if (status === "approved") statusCounts.approved += 1;
      else if (status === "pending") statusCounts.pending += 1;
      else if (status === "rejected") statusCounts.rejected += 1;
      else statusCounts.unknown += 1;
    });
    setDonutData({
      labels: ["Approved", "Pending", "Rejected", "Unknown"],
      datasets: [
        {
          label: "Bookings",
          data: [
            statusCounts.approved,
            statusCounts.pending,
            statusCounts.rejected,
            statusCounts.unknown,
          ],
          backgroundColor: ["#4ade80", "#facc15", "#f87171", "#94a3b8"],
          borderWidth: 1,
        },
      ],
    });
    setDonutLoading(false);
  }, [bookings]);

  const handleApprove = async (id) => {
    setProcessingBookings((prev) => ({ ...prev, [id]: "approve" }));
    try {
      await dispatch(approveBooking(id));
    } finally {
      setProcessingBookings((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleReject = async (id) => {
    setProcessingBookings((prev) => ({ ...prev, [id]: "reject" }));
    try {
      await dispatch(rejectBooking(id));
    } finally {
      setProcessingBookings((prev) => {
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
        {(currentStatus !== "approved" || isProcessing === "reject") && (
          <button
            onClick={() => handleApprove(id)}
            disabled={isProcessing || loading}
            className={`px-3 py-1 text-white rounded transition flex items-center ${
              isProcessing === "approve"
                ? "bg-green-600 opacity-80"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isProcessing === "approve" ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                <span>Approving...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-1" />
                <span>
                  {currentStatus === "rejected"
                    ? "Change to Approved"
                    : "Approve"}
                </span>
              </>
            )}
          </button>
        )}

        {(currentStatus !== "rejected" || isProcessing === "approve") && (
          <button
            onClick={() => handleReject(id)}
            disabled={isProcessing || loading}
            className={`px-3 py-1 text-white rounded transition flex items-center ${
              isProcessing === "reject"
                ? "bg-red-600 opacity-80"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isProcessing === "reject" ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                <span>Rejecting...</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="mr-1" />
                <span>
                  {currentStatus === "approved"
                    ? "Change to Rejected"
                    : "Reject"}
                </span>
              </>
            )}
          </button>
        )}

        {!isProcessing && currentStatus !== "pending" && (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              currentStatus === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span className="mr-1">
              {currentStatus === "approved"
                ? "Currently Approved"
                : "Currently Rejected"}
            </span>
          </span>
        )}
      </div>
    );
  };

  // Filter bookings based on search
  const filteredBookings = bookings
    ? bookings.filter(
        (item) =>
          (item?.user?.name &&
            item.user.name.toLowerCase().includes(search.toLowerCase())) ||
          (item?.user?.role &&
            item.user.role.toLowerCase().includes(search.toLowerCase())) ||
          (item?.roomId?.name &&
            item.roomId.name.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

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

  // Reset page if filteredBookings changes and page is out of range
  useEffect(() => {
    const totalPages = Math.ceil(filteredBookings.length / entries) || 1;
    if (page > totalPages) setPage(1);
  }, [filteredBookings, entries, page]);

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

          {/* Donut Chart */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="mb-4 text-xl font-semibold">
              Room Bookings Status Overview
            </h2>
            <div className="max-w-xs mx-auto min-h-[220px] flex items-center justify-center">
              {donutLoading || !donutData ? (
                <div className="flex items-center justify-center h-40">
                  <div className="inline-block w-12 h-12 border-4 border-current rounded-full spinner-border animate-spin border-t-transparent" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <Doughnut data={donutData} />
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search Bookings..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border rounded px-3 py-2 w-full max-w-xs"
            />
          </div>

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
                {paginate(filteredBookings, page, entries).length > 0 ? (
                  paginate(filteredBookings, page, entries).map((item, index) => (
                    <tr key={item._id || index}>
                      <td className="px-3 py-2 border">{(page - 1) * entries + index + 1}</td>
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
          {renderPagination(
            page,
            setPage,
            entries,
            setEntries,
            filteredBookings.length
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;