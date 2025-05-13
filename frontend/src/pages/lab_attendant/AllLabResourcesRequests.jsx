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
import { FaSearch, FaFilter } from "react-icons/fa";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

const AllLabResourcesRequests = () => {
  const dispatch = useDispatch();
  const { loading, error, message, lendItems } = useSelector(
    (state) => state.lab
  );
  const [localLendItems, setLocalLendItems] = useState(lendItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
  });

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lab Resource Requests</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
              
              <div className="relative">
                <select
                  className="py-2 pl-10 pr-8 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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
                  {filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((request, index) => (
                      <tr key={request._id} className="transition-colors border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-2 py-3 text-gray-700">{index + 1}</td>
                        
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllLabResourcesRequests;
