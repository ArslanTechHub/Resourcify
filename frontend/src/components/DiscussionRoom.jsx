import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";

const DiscussionRoom = ({ title, image, status, id }) => {
  return (
    <div className="w-full h-[350px] rounded-lg overflow-hidden relative group">
      {/* Image */}
      <img
        src={image}
        alt=""
        className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute hidden group-hover:flex top-0 left-0 w-full h-full bg-gradient-to-b from-[#ffffff18] to-[#000000e5] overlay p-[16px] flex-col justify-end transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <p className="text-3xl text-white font-clemente-regular">{title}</p>
          <div className="text-3xl text-white">
            <GoArrowUpRight />
          </div>
        </div>
      </div>
      
      {/* Link wrapper - covers entire component */}
      <Link to={`/discussion-room/${id}/book`} className="absolute inset-0" aria-label={title} />
    </div>
  );
};

export default DiscussionRoom;

