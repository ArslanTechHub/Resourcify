import { createReducer } from "@reduxjs/toolkit";

export const roomReducer = createReducer(
  {},
  {
    createRoomRequest: (state) => {
      state.loading = true;
    },
    createRoomSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    createRoomFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAllRoomsRequest: (state) => {
      state.loading = true;
    },
    getAllRoomsSuccess: (state, action) => {
      state.loading = false;
      state.rooms = action.payload.rooms;
    },
    getAllRoomsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getRoomByIdRequest: (state) => {
      state.loading = true;
    },

    getRoomByIdSuccess: (state, action) => {
      state.loading = false;
      state.room = action.payload.room;
    },
    getRoomByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateRoomRequest: (state) => {
      state.loading = true;
    },

    updateRoomSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    updateRoomFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteRoomRequest: (state) => {
      state.loading = true;
    },
    deleteRoomSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    deleteRoomFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getAllBookingsRequest: (state) => {
      state.loading = true;
    },
    getAllBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload.bookings;
    },
    getAllBookingsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    requestBookingRequest: (state) => {
      state.loading = true;
    },

    requestBookingSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    requestBookingFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    changeBookingStatusRequest: (state) => {
      state.loading = true;
    },
    changeBookingStatusSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    changeBookingStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  }
);
