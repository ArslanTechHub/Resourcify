import { Link } from "react-router-dom";
import { assets } from "../../assets";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/user";
import { useState } from "react";

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();



    const submitHandler = (e) => {
        e.preventDefault();
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
                            <h2 className="text-4xl font-clemente-regular">Forgot Password</h2>
                            <p className="text-left !text-[16px]">
                                Enter Your Email to receive reset link
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


                        <button className="primary-btn !w-full">Submit</button>
                        <p className="!text-[16px] text-center">
                            <Link to={'/login'} className="text-accent font-[600]">Back to Login</Link>
                        </p>
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

export default ForgotPassword;
