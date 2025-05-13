import React, { useEffect } from "react";
import LibraryItem from "../../components/LibraryItem";
import LabResource from "../../components/LabResource";
import { assets } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { getLabResources } from "../../redux/actions/lab";

const FeaturedLabResources = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.lab);
  useEffect(() => {
    dispatch(getLabResources());
  }, []);
  return (
    <section className="flex flex-col w-full sec-section">
      <div className="flex items-center justify-between row">
        <h2>Lab Resources</h2>
      </div>

      <div className="w-full grid grid-cols-4 xl:grid-cols-5 mt-[16px] gap-[16px]">
        {items &&
          items.length > 0 &&
          items
            .slice(0, 5)
            .map((i, index) => (
              <LabResource
                key={index}
                image={i.image.url}
                title={i.title}
                status={i.status || "available"}
                description={i.instructions}
                id={i._id}
              />
            ))}
      </div>
    </section>
  );
};

export default FeaturedLabResources;
