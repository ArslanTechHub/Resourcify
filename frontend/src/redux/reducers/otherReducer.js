import { createReducer } from "@reduxjs/toolkit";

export const otherReducer = createReducer(
  {},
  {
    getMyRequestsRequest: (state) => {
      state.loading = true;
    },

    getMyRequestsSuccess: (state, action) => {
      state.loading = false;
      state.libraryItems = action.payload.libraryItems;
      state.labResources = action.payload.labResources;
      state.roomBookings = action.payload.roomBookings;
    },

    getMyRequestsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  }
);
