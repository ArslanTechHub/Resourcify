import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLendLabResourceRequestStatus,
  getAllLabResourcesRequests,
} from "../../redux/actions/lab";
import Loading from "../other/Loading";
import { useAlert } from "../../utils/alert";
import LabAttendentSidebar from "./LabAttendentSideNav";
import LabAttendentHeader from "./LabAttendentHeader";
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AllLabResourcesRequests = () => {
  const dispatch = useDispatch();
  const { loading, error, message, lendItems } = useSelector(
    (state) => state.lab
  );
  const [localLendItems, setLocalLendItems] = useState(lendItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination states
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);

  // Donut chart state
  const [donutData, setDonutData] = useState(null);
  const [donutLoading, setDonutLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllLabResourcesRequests());
  }, [dispatch]);

  useEffect(() => {
    if (lendItems) {
      setLocalLendItems(lendItems);
    }
  }, [lendItems]);

  const alert = useAlert();

  useEffect(() => {
    alert(message, error, "/lab_attendant/requests");
  }, [error, message]);

  // Donut chart data calculation
  useEffect(() => {
    setDonutLoading(true);
    const statusCounts = { approved: 0, pending: 0, rejected: 0, unknown: 0 };
    (localLendItems || []).forEach((item) => {
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
          label: "Requests",
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
  }, [localLendItems]);

  // Handle the update click
  const handleUpdateStatus = (requestId, newStatus) => {
    // Optimistically update the status locally first
    const updatedItems = localLendItems.map((item) =>
      item._id === requestId ? { ...item, status: newStatus } : item
    );
    setLocalLendItems(updatedItems); // Update the local state to reflect the change

    // Dispatch the action to update status
    dispatch(changeLendLabResourceRequestStatus(requestId, newStatus));
  };

  // Filter items based on search term and status filter
  const filteredItems = localLendItems?.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

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

  // Status badge styling based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <section className="flex h-screen bg-gray-50">
      <LabAttendentSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <LabAttendentHeader />
        
        <div className="p-6 ml-64 overflow-auto">
          {/* Donut Chart Section */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="mb-4 text-xl font-semibold">Lab Resource Requests Status Overview</h2>
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

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lab Resource Requests</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
                <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
              
              <div className="relative">
                <select
                  className="py-2 pl-10 pr-8 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <FaFilter className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "4%" }} /> {/* No. */}
                  <col style={{ width: "12%" }} /> {/* Borrower */}
                  <col style={{ width: "15%" }} /> {/* Email */}
                  <col style={{ width: "10%" }} /> {/* Phone */}
                  <col style={{ width: "16%" }} /> {/* Resource */}
                  <col style={{ width: "18%" }} /> {/* Purpose */}
                  <col style={{ width: "8%" }} /> {/* Status */}
                  <col style={{ width: "17%" }} /> {/* Actions */}
                </colgroup>
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="px-2 py-3 text-sm font-semibold uppercase">No.</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Borrower</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Email</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Phone</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Resource</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Purpose</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Status</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(filteredItems, page, entries).length > 0 ? (
                    paginate(filteredItems, page, entries).map((request, index) => (
                      <tr key={request._id} className="transition-colors border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-2 py-3 text-gray-700">{(page - 1) * entries + index + 1}</td>
                        
                        <td className="px-2 py-3">
                          <div className="text-sm font-medium text-gray-900 truncate" title={request.name}>
                            {request.name}
                          </div>
                        </td>
                        
                        <td className="px-2 py-3">
                          <div className="text-sm text-gray-700 truncate" title={request.email}>
                            {request.email}
                          </div>
                        </td>
                        
                        <td className="px-2 py-3">
                          <div className="text-sm text-gray-700 truncate" title={request.phone}>
                            {request.phone}
                          </div>
                        </td>
                        
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-8 h-8">
                              <img 
                                className="object-cover w-8 h-8 rounded-md"
                                src={request.item?.image?.url}
                                alt="Resource" 
                              />
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-sm font-medium text-gray-900 truncate" title={request.item?.title}>
                                {request.item?.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-2 py-3">
                          <div className="text-sm text-gray-700 truncate" title={request.purpose}>
                            {request.purpose}
                          </div>
                        </td>
                        
                        <td className="px-2 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        
                        <td className="px-2 py-3">
                          {request.status === "pending" && (
                            <div className="flex flex-wrap gap-1">
                              <button
                                onClick={() => handleUpdateStatus(request._id, "approved")}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                                disabled={loading}
                              >
                                <BsCheckCircleFill className="text-xs" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(request._id, "rejected")}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                                disabled={loading}
                              >
                                <BsXCircleFill className="text-xs" />
                                <span>Reject</span>
                              </button>
                            </div>
                          )}
                          {request.status !== "pending" && (
                            <span className="text-xs text-gray-500 truncate">
                              {request.status === "approved" ? "Request approved" : "Request rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 text-center text-gray-500">
                        {searchTerm || statusFilter !== 'all' 
                          ? "No requests match your search criteria." 
                          : "No resource requests found."}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllLabResourcesRequests;