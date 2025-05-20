import React, { useEffect } from "react";
import DiscussionRoom from "../../components/DiscussionRoom";
import { assets } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { getAllRooms } from "../../redux/actions/room";


const FeaturedDiscussionRooms = () => {

  const dispatch = useDispatch();
  const { rooms } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  return (
    <section className="flex flex-col w-full sec-section">
      <div className="flex items-center justify-between row">
        <h2>Discussion Rooms</h2>
      </div>

      <div className="w-full grid grid-cols-4 xl:grid-cols-6 mt-[16px] gap-[16px]">
        {rooms && rooms.length > 0 && rooms.map((room) => (
          <DiscussionRoom key={room._id} id={room._id} image={room.coverImage.url} title={room.name} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDiscussionRooms;
