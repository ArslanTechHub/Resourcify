import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLabResources,
  deleteLabResource,
  updateLabResource,
  getLabResourceById,
} from "../../redux/actions/lab";
import toast from "react-hot-toast";
import { FaRegEdit, FaSearch, FaPlus, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import LabAttendentSidebar from "./LabAttendentSideNav";
import LabAttendentHeader from "./LabAttendentHeader";

const LabResourcesScreen = () => {
  const dispatch = useDispatch();
  const { items, item, loading } = useSelector((state) => state.lab);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    version: "",
    link: "",
    instructions: "",
    os: "",
    publisher: "",
    size: "",
  });

  // Pagination states
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);

  useEffect(() => {
    dispatch(getLabResources());
  }, [dispatch]);

  useEffect(() => {
    if (item && isEditOpen) {
      setFormData({
        title: item.title || "",
        version: item.version || "",
        link: item.link || "",
        instructions: item.instructions || "",
        os: item.os || "",
        publisher: item.publisher || "",
        size: item.size || "",
      });
    }
  }, [item, isEditOpen]);

  const openEditDialog = (id) => {
    setSelectedId(id);
    dispatch(getLabResourceById(id));
    setIsEditOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditOpen(false);
    setFormData({
      title: "",
      version: "",
      link: "",
      instructions: "",
      os: "",
      publisher: "",
      size: "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated data
    const updatedData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      updatedData.append(key, value);
    });

    // Dispatch the update action
    try {
      await dispatch(updateLabResource(selectedId, updatedData));

      // Show success toast
      toast.success("Resource updated!");

      // Close the edit dialog
      closeEditDialog();

      // Reload updated data
      dispatch(getLabResources());
    } catch (error) {
      toast.error("Failed to update resource.");
    }
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    dispatch(deleteLabResource(selectedId));
    toast.success("Resource deleted!");
    setIsDeleteConfirmOpen(false);
    dispatch(getLabResources());
  };

  // Filter items based on search term
  const filteredItems = items?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.os.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  return (
    <section className="flex h-screen bg-gray-50">
      <LabAttendentSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <LabAttendentHeader />

        <div className="p-6 ml-64 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Lab Resources</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
                <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
              <Link
                to="/lab_attendant/add"
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaPlus />
                <span>Add Resource</span>
              </Link>
            </div>
          </div>

          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "4%" }} /> {/* No. */}
                  <col style={{ width: "18%" }} /> {/* Software */}
                  <col style={{ width: "7%" }} /> {/* Version */}
                  <col style={{ width: "7%" }} /> {/* Link */}
                  <col style={{ width: "14%" }} /> {/* Instructions */}
                  <col style={{ width: "7%" }} /> {/* OS */}
                  <col style={{ width: "13%" }} /> {/* Publisher */}
                  <col style={{ width: "10%" }} /> {/* Size */}
                  <col style={{ width: "20%" }} /> {/* Actions */}
                </colgroup>
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="px-2 py-3 text-sm font-semibold uppercase">No.</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Software</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Version</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Link</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Instructions</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">OS</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Publisher</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Size</th>
                    <th className="px-2 py-3 text-sm font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginate(filteredItems, page, entries).length > 0 ? (
                    paginate(filteredItems, page, entries).map((i, index) => (
                      <tr 
                        key={i._id} 
                        className="transition-colors border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-2 py-3 text-gray-700">{(page - 1) * entries + index + 1}</td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-8 h-8 overflow-hidden bg-gray-100 border border-gray-200 rounded">
                              <img
                                src={i.image?.url}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium text-gray-800 truncate" title={i.title}>
                                {i.title}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <p className="text-sm text-gray-700 truncate" title={i.version}>
                            {i.version}
                          </p>
                        </td>
                        <td className="px-2 py-3">
                          {i.link ? (
                            <a 
                              href={i.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 truncate hover:underline"
                              title={i.link}
                            >
                              <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                              Link
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <p className="text-sm text-gray-700 truncate" title={i.instructions}>
                            {i.instructions || "-"}
                          </p>
                        </td>
                        <td className="px-2 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {i.os || "-"}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <p className="text-sm text-gray-700 truncate" title={i.publisher}>
                            {i.publisher || "-"}
                          </p>
                        </td>
                        <td className="px-2 py-3">
                          <p className="text-sm text-gray-700 truncate" title={i.size}>
                            {i.size || "-"}
                          </p>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openEditDialog(i._id)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                              title="Edit resource"
                            >
                              <FaRegEdit className="text-xs" />
                              <span>Edit</span>
                            </button>
                            <button
                              disabled={loading}
                              onClick={() => confirmDelete(i._id)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete resource"
                            >
                              <MdDeleteOutline className="text-xs" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-4 text-center text-gray-500">
                        {searchTerm ? "No resources match your search." : "No resources available."}
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

        {/* Edit Modal with Scrollbar */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl animate-fade-in">
              <h2 className="mb-4 text-xl font-bold text-gray-800">Edit Resource</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div
                  className="max-h-72 overflow-y-auto pr-2"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="space-y-1 mb-3">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key}
                      </label>
                      <input
                        type="text"
                        name={key}
                        placeholder={`Enter ${key}`}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={value}
                        onChange={(e) =>
                          setFormData({ ...formData, [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditDialog}
                    className="px-4 py-2 text-gray-800 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl animate-fade-in">
              <h2 className="mb-2 text-xl font-bold text-gray-800">Delete Resource</h2>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete this resource? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-gray-800 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LabResourcesScreen;