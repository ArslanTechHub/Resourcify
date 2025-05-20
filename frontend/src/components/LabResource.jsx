import React from "react";
import { Link } from "react-router-dom";

const LabResource = ({ image, title, status, description, id }) => {
  return (
    <div
      className="w-full border bg-white border-zinc-300 p-[16px] flex flex-col rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <img
        src={image}
        alt=""
        className="w-[72px] h-[72px] object-cover object-center mb-[8px] rounded-md transition-opacity duration-300 hover:opacity-90"
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
      <p className="mb-[8px] transition-colors duration-300 hover:text-zinc-600">
        {description}
      </p>
      <Link
        className="primary-btn !w-full transition-transform duration-300 hover:scale-105"
        to={`/lab-resource/${id}/request`}
      >
        Request Now
      </Link>
    </div>
  );
};

export default LabResource;
