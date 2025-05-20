import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteRoom, getAllRooms, updateRoom } from "../../redux/actions/room";
import Loading from "../other/Loading";
import { useAlert } from "../../utils/alert";
import LibrarianSidebar from "./sideNav";
import LibrarianHeader from "./header";
import { toast } from 'react-toastify';

const EditRoomDialog = ({ room, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (room) {
      setName(room.name);
      setCapacity(room.capacity);
      setStartTime(room.availabilityHours?.start || "");
      setEndTime(room.availabilityHours?.end || "");
      setFile(null);
    }
  }, [room]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("capacity", capacity);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    if (file) formData.append("file", file);
  
    try {
      await dispatch(updateRoom(room._id, formData)); // Await the update
      await dispatch(getAllRooms()); // Fetch updated list
      onClose(); // Close the dialog
      toast.success("Library item updated successfully"); // ✅ Fix message
    } catch (error) {
      toast.error("Failed to update library item");
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Room</h2>
        <form onSubmit={submitHandler} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border p-2 rounded"
          />
          <input
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            type="number"
            placeholder="Capacity"
            className="w-full border p-2 rounded"
          />
          <input
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            type="time"
            className="w-full border p-2 rounded"
          />
          <input
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            type="time"
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AllRooms = () => {
  const dispatch = useDispatch();
  const { loading, error, message, rooms } = useSelector((state) => state.room);
  const alert = useAlert();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllRooms());
    
  }, [dispatch]);

  useEffect(() => {
    alert(message, error, "/librarian/rooms");
  }, [error, message]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteRoom(deleteId));
      await dispatch(getAllRooms());
  
      // Clear both confirm state and ID
      setShowConfirm(false);
      setDeleteId(null);
  
      toast.success("Room deleted successfully");
    } catch (error) {
      toast.error("Failed to delete library item");
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 fixed top-0 left-0 h-screen z-10">
        <LibrarianSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white shadow">
          <LibrarianHeader />
        </div>

        <main className="flex-1 overflow-y-auto bg-white">
          {loading || deleting ? (
            <Loading />
          ) : (
            <section className="w-full overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Sr</th>
                    <th className="p-2 border">Cover</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Capacity</th>
                    <th className="p-2 border">Availability Hours</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms && rooms.length > 0 ? (
                    rooms.map((room, index) => (
                      <tr key={room._id} className="text-center">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">
                          <img
                            src={room.coverImage?.url}
                            alt={room.name}
                            width="100"
                            className="rounded mx-auto"
                          />
                        </td>
                        <td className="p-2 border">{room.name}</td>
                        <td className="p-2 border">{room.capacity}</td>
                        <td className="p-2 border">
                          {room.availabilityHours?.start} to{" "}
                          {room.availabilityHours?.end}
                        </td>
                        <td className="p-2 border space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              setEditOpen(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                                
                              setDeleteId(room._id);
                              setShowConfirm(true);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center">
                        No rooms found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}
        </main>
      </div>

      {/* Edit Room Dialog */}
      <EditRoomDialog
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        room={selectedRoom}
      />

      {/* Delete Confirmation Modal (Your custom version) */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this library item?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  deleting
                    ? "bg-red-300 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRooms;
