import axios from "axios";
import { server } from "../store";

export const createRoom = (formdata) => async (dispatch) => {
  dispatch({ type: "createRoomRequest" });
  try {
    const { data } = await axios.post(`${server}/room`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    dispatch({ type: "createRoomSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "createRoomFail",
      payload: error.response?.data?.message || "Create room failed",
    });
  }
};

export const getAllRooms = () => async (dispatch) => {
  dispatch({ type: "getAllRoomsRequest" });
  try {
    const { data } = await axios.get(`${server}/rooms`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "getAllRoomsSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getAllRoomsFail",
      payload: error.response?.data?.message || "Failed to fetch rooms",
    });
  }
};

export const getRoomById = (id) => async (dispatch) => {
  dispatch({ type: "getRoomByIdRequest" });
  try {
    const { data } = await axios.get(`${server}/room/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "getRoomByIdSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getRoomByIdFail",
      payload: error.response?.data?.message || "Failed to get room",
    });
  }
};

export const updateRoom = (id, formdata) => async (dispatch) => {
  dispatch({ type: "updateRoomRequest" });
  try {
    const { data } = await axios.put(`${server}/room/${id}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    dispatch({ type: "updateRoomSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "updateRoomFail",
      payload: error.response?.data?.message || "Failed to update room",
    });
  }
};

export const deleteRoom = (id) => async (dispatch) => {
  dispatch({ type: "deleteRoomRequest" });
  try {
    const { data } = await axios.delete(`${server}/room/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "deleteRoomSuccess", payload: data.message });
    return data.message;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete room";
    dispatch({ type: "deleteRoomFail", payload: message });
    throw new Error(message);
  }
};

export const getAllBookings = () => async (dispatch) => {
  dispatch({ type: "getAllBookingsRequest" });
  try {
    const { data } = await axios.get(`${server}/bookings`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "getAllBookingsSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getAllBookingsFail",
      payload: error.response?.data?.message || "Failed to fetch bookings",
    });
  }
};

export const approveBooking = (id) => async (dispatch) => {
  dispatch({ type: "BOOKING_UPDATE_REQUEST" });
  try {
    const { data } = await axios.put(`${server}/booking/${id}`, {
      status: "approved",
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "BOOKING_UPDATE_SUCCESS", payload: data });
    dispatch(getAllBookings());
  } catch (error) {
    dispatch({
      type: "BOOKING_UPDATE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const rejectBooking = (id) => async (dispatch) => {
  dispatch({ type: "BOOKING_UPDATE_REQUEST" });
  try {
    const { data } = await axios.put(`${server}/booking/${id}`, {
      status: "rejected",
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "BOOKING_UPDATE_SUCCESS", payload: data });
    dispatch(getAllBookings());
  } catch (error) {
    dispatch({
      type: "BOOKING_UPDATE_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const changeBookingStatus = (id, status) => async (dispatch) => {
  dispatch({ type: "changeBookingStatusRequest" });
  try {
    const { data } = await axios.put(`${server}/booking/${id}`, { status }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "changeBookingStatusSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "changeBookingStatusFail",
      payload: error.response?.data?.message || "Failed to update booking",
    });
  }
};

export const requestBooking =
  (roomId, name, rollNo, email, startTime, endTime, purpose) =>
  async (dispatch) => {
    dispatch({ type: "requestBookingRequest" });
    try {
      const { data } = await axios.post(`${server}/booking`, {
        roomId,
        name,
        rollNo,
        email,
        startTime,
        endTime,
        purpose,
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      dispatch({ type: "requestBookingSuccess", payload: data });
    } catch (error) {
      dispatch({
        type: "requestBookingFail",
        payload: error.response?.data?.message || "Booking request failed",
      });
    }
  };