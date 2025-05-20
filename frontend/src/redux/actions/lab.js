import axios from "axios";
import { server } from "../store";

export const createLabResource = (formdata) => async (dispatch) => {
  dispatch({ type: "createLabResourceRequest" });

  try {
    const { data } = await axios.post(
      `${server}/create-lab-resource`,
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    dispatch({ type: "createLabResourceSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "createLabResourceFail",
      payload: error.response.data.message,
    });
  }
};

export const getLabResources = () => async (dispatch) => {
  dispatch({ type: "getLabResourcesRequest" });

  try {
    const { data } = await axios.get(
      `${server}/lab-resources`,

      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch({ type: "getLabResourcesSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getLabResourcesFail",
      payload: error.response.data.message,
    });
  }
};

export const updateLabResource = (id, formdata) => async (dispatch) => {
  dispatch({ type: "updateLabResourceRequest" });

  try {
    const { data } = await axios.put(`${server}/lab-resource/${id}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    dispatch({ type: "updateLabResourceSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "updateLabResourceFail",
      payload: error.response.data.message,
    });
  }
};

export const getLabResourceById = (id) => async (dispatch) => {
  dispatch({ type: "getLabResourceByIdRequest" });

  try {
    const { data } = await axios.get(`${server}/lab-resource/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    dispatch({ type: "getLabResourceByIdSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getLabResourceByIdFail",
      payload: error.response.data.message,
    });
  }
};

export const deleteLabResource = (id) => async (dispatch) => {
  dispatch({ type: "deleteLabResourceRequest" });

  try {
    const { data } = await axios.delete(`${server}/lab-resource/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    dispatch({ type: "deleteLabResourceSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "deleteLabResourceFail",
      payload: error.response.data.message,
    });
  }
};

export const createLendLabResourceRequest =
  (name, regNumber, email, phoneNo, department, item, purpose) =>
    async (dispatch) => {
      console.log("Sending:", {
        name: name,
        regNumber: regNumber ? regNumber : "0",
        email: email,
        phoneNo: phoneNo ? phoneNo : '0',
        department: department ? department : 'N/A',
        item: item,
        purpose: purpose,
      });

      dispatch({ type: "createLendLabResourceRequest" });
      try {
        let { data } = await axios.post(
          `${server}/lend-lab-resource`,
          {
            name,
            regNumber: regNumber ? regNumber : "0", // or any default fallback string
            email,
            phoneNo,
            department,
            item,
            purpose,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        dispatch({ type: "createLendLabResourceRequestSuccess", payload: data });
      } catch (error) {
        console.log("Error:", error);

        dispatch({
          type: "createLendLabResourceRequestFail",
          payload: error.response.data.message,
        });
      }
    };

export const changeLendLabResourceRequestStatus =
  (id, status) => async (dispatch) => {
    dispatch({ type: "changeLendLabResourceRequestStatusRequest" });
    try {
      let { data } = await axios.put(
        `${server}/lend-lab-resource/${id}`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch({
        type: "changeLendLabResourceRequestStatusSuccess",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "changeLendLabResourceRequestStatusFail",
        payload: error.response.data.message,
      });
    }
  };

export const getAllLabResourcesRequests = () => async (dispatch) => {
  dispatch({ type: "getAllLabResourcesRequestsRequest" });
  try {
    let { data } = await axios.get(`${server}/lend-lab-resources`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    dispatch({ type: "getAllLabResourcesRequestsSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getAllLabResourcesRequestsFail",
      payload: error.response.data.message,
    });
  }
};

export const getMyLabResourceRequests = () => async (dispatch) => {
  try {
    dispatch({ type: "getMyLabResourceRequestsRequest" });

    const { data } = await axios.get(`${server}/my-lab-resource-requests`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    dispatch({
      type: "getMyLabResourceRequestsSuccess",
      payload: data.requests,
    });
  } catch (error) {
    dispatch({
      type: "getMyLabResourceRequestsFail",
      payload: error.response.data.message,
    });
  }
};
