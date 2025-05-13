import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLabResourceById,
  updateLabResource,
} from "../../redux/actions/lab";
import Loading from "../other/Loading";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateLabResource = () => {
  const [formData, setFormData] = useState({
    title: "",
    version: "",
    link: "",
    instructions: "",
    os: "",
    publisher: "",
    size: "",
    icon: null,
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { message, error, loading, item } = useSelector((state) => state.lab);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, icon: file }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.version ||
      !formData.link ||
      !formData.os ||
      !formData.publisher ||
      !formData.size
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const updatedData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedData.append(key, formData[key]);
    });

    dispatch(updateLabResource(id, updatedData));
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
  }, [message, error, dispatch, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(getLabResourceById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        version: item.version || "",
        link: item.link || "",
        instructions: item.instructions || "",
        os: item.os || "",
        publisher: item.publisher || "",
        size: item.size || "",
        icon: null,
      });
    }
  }, [item]);

  return loading ? (
    <Loading />
  ) : (
    <section className="!p-0">
      <form
        className="bg-white rounded-lg flex flex-col gap-4 shadow-lg"
        onSubmit={submitHandler}
      >

        <label>
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Title"
            className="input-field"
          />
        </label>

        <label>
          <span>Version</span>
          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleChange}
            placeholder="Enter Version"
            className="input-field"
          />
        </label>

        <label>
          <span>Link</span>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="Enter Link"
            className="input-field"
          />
        </label>

        <label>
          <span>Instructions (comma-separated)</span>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Enter Instructions"
            className="input-field"
          />
        </label>

        <label>
          <span>Tested OS</span>
          <input
            type="text"
            name="os"
            value={formData.os}
            onChange={handleChange}
            placeholder="Enter OS"
            className="input-field"
          />
        </label>

        <label>
          <span>Publisher</span>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Enter Publisher"
            className="input-field"
          />
        </label>

        <label>
          <span>Size</span>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Enter Size"
            className="input-field"
          />
        </label>

        <label>
          <span>Icon</span>
          <input
            type="file"
            onChange={handleFileChange}
            className="input-field"
          />
        </label>

        <button type="submit" className="primary-btn">
          Submit
        </button>
      </form>
    </section>
  );
};

export default UpdateLabResource;
