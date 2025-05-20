import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLendItemsRequestStatus,
  getAllLendItemsRequests,
} from "../../redux/actions/library";
import { formatDateAndTime } from "../../utils/date";
import Loading from "../other/Loading";
import { useAlert } from "../../utils/alert";
import LibrarianSidebar from "./sideNav";
import LibrarianHeader from "./header";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AllLentItemsRequests = () => {
  const dispatch = useDispatch();
  const { lentItems, loading, error, message } = useSelector(
    (state) => state.library
  );

  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState(""); // <-- search state

  const alert = useAlert();

  useEffect(() => {
    dispatch(getAllLendItemsRequests());
  }, []);

  useEffect(() => {
    alert(message, error);
  }, [message, error]);

  useEffect(() => {
    let filtered = [...(lentItems || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (selectedBook) {
      filtered = filtered.filter((i) => i?.item?.title === selectedBook);
    }
    if (startDate) {
      filtered = filtered.filter(
        (i) => new Date(i.createdAt) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (i) => new Date(i.createdAt) <= new Date(endDate)
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i?.name && i.name.toLowerCase().includes(searchLower)) ||
          (i?.item?.title && i.item.title.toLowerCase().includes(searchLower)) ||
          (i?.borrower?.role && i.borrower.role.toLowerCase().includes(searchLower)) ||
          (i?.item?.file?.url && i.item.file.url.toLowerCase().includes(searchLower))
      );
    }

    setFilteredItems(filtered);
  }, [lentItems, selectedBook, startDate, endDate, search]);

  // Donut chart data
  const statusCounts = {
    approved: 0,
    pending: 0,
    rejected: 0,
    unknown: 0,
  };

  (filteredItems || []).forEach((item) => {
    const status = (item.status || "unknown").toLowerCase();
    if (status === "approved") statusCounts.approved += 1;
    else if (status === "pending") statusCounts.pending += 1;
    else if (status === "rejected") statusCounts.rejected += 1;
    else statusCounts.unknown += 1;
  });

  const donutData = {
    labels: ['Approved', 'Pending', 'Rejected', 'Unknown'],
    datasets: [
      {
        label: 'Requests',
        data: [
          statusCounts.approved,
          statusCounts.pending,
          statusCounts.rejected,
          statusCounts.unknown,
        ],
        backgroundColor: ['#4ade80', '#facc15', '#f87171', '#94a3b8'],
        borderWidth: 1,
      },
    ],
  };

  const clearFilters = () => {
    setSelectedBook("");
    setStartDate("");
    setEndDate("");
    setSearch("");
  };

  const uniqueBookTitles = [
    ...new Set(
      (lentItems || [])
        .map((i) => i?.item?.title)
        .filter((title) => title !== undefined)
    ),
  ];

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <LibrarianSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden ml-64">
        {/* Header */}
        <div className="h-16 flex-shrink-0 shadow bg-white z-10">
          <LibrarianHeader />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
          {/* Donut Chart */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Lending Requests Status Overview</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={donutData} />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">Book</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All</option>
                {uniqueBookTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <label className="block mb-1">Search</label>
              <input
                type="text"
                placeholder="Search Requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded px-2 py-1 pl-2"
              />
            </div>
            <button
              onClick={clearFilters}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          </div>

          {/* Table or loading */}
          {loading ? (
            <Loading />
          ) : (
            <section className="overflow-auto m-0 p-0">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Sr</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Borrower</th>
                    <th className="border px-2 py-1">Role</th>
                    <th className="border px-2 py-1">Item</th>
                    <th className="border px-2 py-1">Start Date</th>
                    <th className="border px-2 py-1">End Date</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((i, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">
                        {formatDateAndTime(i.createdAt).formattedDate}
                      </td>
                      <td className="border px-2 py-1">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://placehold.co/36x36"
                            alt=""
                            className="w-[36px] h-[36px] rounded-full object-cover"
                          />
                          <span>{i?.name || "Nill"}</span>
                        </div>
                      </td>
                      <td className="border px-2 py-1 capitalize">
                        {i?.borrower?.role || "-"}
                      </td>
                      <td className="border px-2 py-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={i?.item?.file?.url}
                            alt=""
                            className="w-[36px] h-[36px] rounded object-cover"
                          />
                          <span>{i?.item?.title}</span>
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        {formatDateAndTime(i.startDate).formattedDate}
                      </td>
                      <td className="border px-2 py-1">
                        {formatDateAndTime(i.endDate).formattedDate}
                      </td>
                     
                      <td className="border px-2 py-1">
                        <div
                          className={`${
                            i.status === "pending" ? "flex gap-2" : "hidden"
                          }`}
                        >
                          <button
                            onClick={async () => {
                              await dispatch(changeLendItemsRequestStatus(i._id, "approved"));
                              dispatch(getAllLendItemsRequests());
                            }}
                            className="bg-green-600 p-1 rounded text-white"
                          >
                            Approve
                          </button>

                          <button
                            onClick={async () => {
                              await dispatch(changeLendItemsRequestStatus(i._id, "rejected"));
                              dispatch(getAllLendItemsRequests());
                            }}
                            className="bg-red-600 p-1 rounded text-white"
                          >
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllLentItemsRequests;