import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/user";
import { useState, useEffect } from "react";

const TeacherLogin = ({title}) => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [roleTitle, setRoleTitle] = useState(title || "Teacher Login");
    
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        // Determine role based on path
        const path = location.pathname;
        if (path.includes('librarian')) {
            setRoleTitle("Librarian Login");
        } else if (path.includes('lab-attendant')) {
            setRoleTitle("Lab Attendant Login");
        } else if (path.includes('coordinator')) {
            setRoleTitle("Coordinator Login");
        } else {
            setRoleTitle("Teacher Login");
        }
    }, [location]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(identifier, password)); 
        // The redirection to dashboard will be handled by the login action
    };

    return (
        <section className="w-full h-screen">
            <div className="row w-full h-full flex justify-between items-center gap-[64px]">
                <div className="form-col w-[30%] h-full flex items-center">
                    <form
                        onSubmit={submitHandler}
                        className="flex flex-col gap-[8px] w-full"
                    >
                        <div>
                            <h2 className="text-4xl font-clemente-regular">{roleTitle}</h2>
                            <p className="text-left !text-[16px]">
                                Enter Your Email and Password to Login
                            </p>
                        </div>

                        <label>
                            <span className="input-label mb-[4px]">Email</span>
                            <input
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className=""
                                type="text"
                                placeholder="Enter Your Email"
                                maxLength={50} // Increase length to accommodate email addresses
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
                            <Link className="text-accent font-[600]" to={'/register'}>Create Account</Link>
                        </p>
                        
                        <hr />
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-sm text-center text-gray-600">Other Login Options</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Link to={'/login'} className="primary-btn !w-full !bg-gray-700">
                                    Student Login
                                </Link>
                                {!location.pathname.includes('teacher') && (
                                    <Link to={'/login/teacher'} className="primary-btn !w-full !bg-black">
                                        Teacher Login
                                    </Link>
                                )}
                                {!location.pathname.includes('librarian') && (
                                    <Link to={'/login/librarian'} className="primary-btn !w-full !bg-[#003b7e]">
                                        Librarian Login
                                    </Link>
                                )}
                                {!location.pathname.includes('lab-attendant') && (
                                    <Link to={'/login/lab-attendant'} className="primary-btn !w-full !bg-[#0e345a]">
                                        Lab Attendant
                                    </Link>
                                )}
                            </div>
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

export default TeacherLogin;
