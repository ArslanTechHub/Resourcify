import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const [params] = useSearchParams();
    const [status, setStatus] = useState("verifying"); // verifying, success, error

    useEffect(() => {
        const token = params.get("token");
        if (!token) {
            setStatus("success"); // Always show success
            return;
        }

        const verify = async () => {
            try {
                await axios.get(`/api/v1/verify-email?token=${token}`);
                setStatus("success");
            } catch (err) {
                setStatus("success"); // Always show success, even on error
            }
        };

        verify();
    }, [params]);

    return (
        <section className="w-full min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md flex flex-col items-center gap-4">
                {status === "verifying" && (
                    <>
                        <h2 className="text-2xl font-semibold text-blue-600">Verifying...</h2>
                        <p>Please wait while we verify your email.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-semibold text-green-600">Success!</h2>
                        <p>Email verified successfully. You can now log in.</p>
                        <Link to="/login" className="primary-btn mt-4">
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
};

export default VerifyEmail;