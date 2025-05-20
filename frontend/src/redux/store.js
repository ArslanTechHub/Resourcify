import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { libraryReducer } from "./reducers/libraryReducer";
import { labReducer } from "./reducers/labReducer";
import { otherReducer } from "./reducers/otherReducer";
import { roomReducer } from "./reducers/roomReducer";

// export const server = "https://resourcify-1.onrender.com/api/v1";
export const server = "http://localhost:4000/api/v1";

const store = configureStore({
  reducer: {
    user: userReducer,
    library: libraryReducer,
    lab: labReducer,
    room: roomReducer,
    other: otherReducer,
  },
});

export default store;
