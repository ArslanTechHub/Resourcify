import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../../redux/actions/room";
import Loading from "../other/Loading";
import { useAlert } from "../../utils/alert";
import LibrarianSidebar from "./sideNav";
import LibrarianHeader from "./header";

const AddNewRoom = () => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [file, setFile] = useState("");
  const { loading, error, message } = useSelector((state) => state.room);

  const dispatch = useDispatch();
  const alert = useAlert();

  const changeImageHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("capacity", capacity);
    myForm.append("startTime", startTime);
    myForm.append("endTime", endTime);
    myForm.append("file", file);

    dispatch(createRoom(myForm));
  };

  useEffect(() => {
    alert(message, error, "/librarian/rooms");
  }, [message, error]);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex h-screen w-full overflow-hidden">
      <LibrarianSidebar />

      <div className="flex-1 flex flex-col h-full">
        <LibrarianHeader />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl w-full mx-auto bg-white p-6 rounded-lg shadow-md">
          <br/>
          <br/>
            <h1 className="text-2xl font-semibold mb-6">Add New Room</h1>

            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter Room Name"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Capacity</label>
                <input
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  type="number"
                  placeholder="Enter Room Capacity"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Start Time</label>
                <input
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  type="time"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">End Time</label>
                <input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  type="time"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Cover Image</label>
                <input
                  type="file"
                  onChange={changeImageHandler}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddNewRoom;
