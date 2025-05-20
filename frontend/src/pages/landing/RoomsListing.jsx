import Select from "react-select";
import { styles } from "../../utils/selectStyles";
import DiscussionRoom from "../../components/DiscussionRoom";
import { assets } from "../../assets";
const RoomsListing = () => {
  return (
    <section className="w-full min-h-screen bg-gray-100">
      <div className="flex items-center justify-between title-row">
        <h3 className="text-3xl text-black font-clemente-regular">
          Discussion Rooms
        </h3>
      </div>

      <div className="w-full grid grid-cols-4 xl:grid-cols-6 mt-[16px] gap-[16px]">
        <DiscussionRoom
          id={1}
          image={assets.discussion_room_home}
          title={"Room Title"}
        />
        <DiscussionRoom
          id={1}
          image={assets.discussion_room_home}
          title={"Room Title"}
        />
        <DiscussionRoom
          id={1}
          image={assets.discussion_room_home}
          title={"Room Title"}
        />
        <DiscussionRoom
          id={1}
          image={assets.discussion_room_home}
          title={"Room Title"}
        />
        <DiscussionRoom
          id={1}
          image={assets.discussion_room_home}
          title={"Room Title"}
        />
        <DiscussionRoom
          id={1}
          image={assets.discussion_room_home}
          title={"Room Title"}
        />
      </div>
    </section>
  );
};

export default RoomsListing;
