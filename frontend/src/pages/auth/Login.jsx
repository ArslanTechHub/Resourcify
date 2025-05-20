import { Link } from "react-router-dom";
import { assets } from "../../assets";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/user";
import { useState } from "react";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Changed from rollNo to identifier
  const [password, setPassword] = useState("");
  const [isNumericId, setIsNumericId] = useState(false); // Track if it's a numeric ID

  const dispatch = useDispatch();

  const formatRollNo = (value) => {
    // If it's marked as a numeric ID, don't format it
    if (isNumericId) {
      return value;
    }

    // Remove all non-alphanumeric characters
    const cleanValue = value.replace(/[^a-z0-9]/gi, "").toLowerCase();

    // Dynamically add dashes
    if (cleanValue.length <= 4) {
      return cleanValue;
    } else if (cleanValue.length <= 7) {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
    } else if (cleanValue.length <= 10) {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(
        4,
        7
      )}-${cleanValue.slice(7)}`;
    } else {
      return `${cleanValue.slice(0, 4)}-${cleanValue.slice(
        4,
        7
      )}-${cleanValue.slice(7, 10)}`;
    }
  };

  const handleIdentifierChange = (e) => {
    const value = e.target.value.trim();
    
    // Check if input is numeric only
    const isNumeric = /^\d+$/.test(value);
    setIsNumericId(isNumeric);
    
    if (isNumeric) {
      // If it's numeric, don't format
      setIdentifier(value);
    } else {
      // Otherwise apply traditional formatting
      const cleanValue = value.replace(/[^a-z0-9]/gi, "").toLowerCase();
      setIdentifier(formatRollNo(cleanValue));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(identifier, password)); // Send identifier and password
  };

  return (
    <section className="w-full min-h-screen">
      <div className="row w-full h-full flex justify-between items-center gap-[64px]">
        <div className="form-col w-[30%] h-full flex items-center">
          <form
            onSubmit={submitHandler}
            className="flex flex-col gap-[8px] w-full"
          >
            <div>
              <h2 className="text-4xl font-clemente-regular">SignIn</h2>
              <p className="text-left !text-[16px]">
                Enter Your Roll Number/Student ID and Password to Login
              </p>
            </div>

            <label>
              <span className="input-label mb-[4px]">Roll Number / Student ID</span>
              <input
                value={identifier}
                onChange={handleIdentifierChange}
                className=""
                type="text"
                placeholder="Enter Your Roll Number or Student ID"
                maxLength={isNumericId ? 20 : 12} // Adjust max length based on type
              />
            </label>

            <label>
              <span className="input-label mb-[4px]">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter Your Password"
              />
            </label>

            <Link to={`/forgotpassword`} className="text-right font-gilroy-medium text-text">
              Forgot Password?
            </Link>
            <button className="primary-btn !w-full">Login</button>
            <p className="!text-[16px] text-center">
              New Here?{" "}
              <Link to={`/register`} className="text-accent font-[600]">Create Account</Link>
            </p>

            <hr />
            <p className="mt-2 mb-1 text-sm text-center text-gray-600">Staff Login Options</p>
            <Link to={'/login/teacher'} className="primary-btn !w-full !bg-black mt-[4px] mb-2">Teacher Login</Link>
            <div className="flex w-full gap-2">
              <Link to={'/login/librarian'} className="primary-btn !w-[50%] !bg-[#003b7e]">
                Librarian Login
              </Link>
              <Link to={'/login/lab-attendant'} className="primary-btn !w-[50%] !bg-[#0e345a]">
                Lab Attendant Login
              </Link>
            </div>
          </form>
        </div>
        <div className="image-col w-[70%] h-full">
          <img
            className="w-full h-full rounded-lg"
            src={assets.comsats_wah_2}
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
