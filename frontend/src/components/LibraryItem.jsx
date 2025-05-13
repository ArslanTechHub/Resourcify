import { Link } from "react-router-dom";
import { useState } from "react";

const LibraryItem = ({ image, title, status, description, id }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`w-full border bg-white border-zinc-300 p-[16px] flex flex-col rounded-lg transition-transform duration-300 ${hovered ? "scale-105 shadow-lg" : "scale-100"
                }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img
                src={image}
                alt=""
                className="w-full h-[250px] object-cover object-center mb-[8px] rounded-md transition-opacity duration-300 hover:opacity-90"
            />
            <div className="flex items-center justify-between mb-[4px]">
                <h3 className="text-xl font-clemente-regular line-clamp-1">{title}</h3>
                <span
                    className={`px-3 py-1.5 rounded-full ${status === "available"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                >
                    {status}
                </span>
            </div>
            <p className="mb-[8px] line-clamp-2">{description}</p>
            <Link
                className="primary-btn !w-full transition-transform duration-300 hover:scale-105"
                to={`/library/${id}/lend`}
            >
                Lend Now
            </Link>
        </div>
    );
};

export default LibraryItem;
