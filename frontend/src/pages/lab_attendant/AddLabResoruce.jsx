import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLabResource } from "../../redux/actions/lab";
import Loading from "../other/Loading";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LabAttendentSidebar from "./LabAttendentSideNav";
import LabAttendentHeader from "./LabAttendentHeader";

const AddLabResource = () => {
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [link, setLink] = useState("");
  const [instructions, setInstructions] = useState("");
  const [os, setOS] = useState("");
  const [publisher, setPublisher] = useState("");
  const [size, setSize] = useState("");
  const [icon, setIcon] = useState("");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("version", version);
    myForm.append("link", link);
    myForm.append("instructions", instructions.split(","));
    myForm.append("os", os);
    myForm.append("publisher", publisher);
    myForm.append("size", size);
    myForm.append("file", icon);

    dispatch(createLabResource(myForm));
  };

  const { message, error, loading } = useSelector((state) => state.lab);
  const navigate = useNavigate();

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setIcon(file);
    };
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      navigate("/lab_attendant");
    }

    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
  }, [error, message]);

  return loading ? (
    <Loading />
  ) : (
    <section className="flex h-screen">
  <LabAttendentSidebar />
  <div className="flex-1 flex flex-col ml-60 overflow-hidden">
    <LabAttendentHeader />
    <div className="p-4 ml-8 flex-1 overflow-auto max-h-screen">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg flex flex-col gap-4 shadow-lg"
      >
        {/* Form Title */}
        <h2 className="text-2xl font-semibold mb-4">Add New Lab Resource</h2>

        {/* Title */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Title</span>
          <input
            type="text"
            placeholder="Enter Title"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        {/* Version */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Version</span>
          <input
            type="text"
            placeholder="Enter Version"
            className="input-field"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </label>

        {/* Link */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Link</span>
          <input
            type="text"
            placeholder="Enter Link"
            className="input-field"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </label>

        {/* Installation Instructions */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Installation Instructions (comma separated)</span>
          <textarea
            placeholder="Enter Instructions"
            className="resize-none input-field"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
          ></textarea>
        </label>

        {/* Tested OS */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Tested OS</span>
          <input
            type="text"
            placeholder="Enter OS"
            className="input-field"
            value={os}
            onChange={(e) => setOS(e.target.value)}
          />
        </label>

        {/* Publisher */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Publisher</span>
          <input
            type="text"
            placeholder="Enter Publisher"
            className="input-field"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />
        </label>

        {/* Size */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Size</span>
          <input
            type="text"
            placeholder="Enter Size"
            className="input-field"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </label>

        {/* Icon */}
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Icon</span>
          <input
            type="file"
            className="input-field"
            onChange={changeImageHandler}
          />
        </label>

        {/* Submit Button */}
        <button className="primary-btn w-full mt-4">Submit</button>
      </form>
    </div>
  </div>
</section>

  );
};

export default AddLabResource;
