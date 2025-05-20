import Lottie from "lottie-react";
import loading from "../../assets/loading.json"
const Loading = () => {
    return (
        <section className="w-full h-screen bg-accent flex justify-center items-center fixed top-0 left-0 z-50">
            <Lottie animationData={loading} loop={true} />
        </section>
    );
};

export default Loading;
