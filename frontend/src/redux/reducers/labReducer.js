import { createReducer } from "@reduxjs/toolkit";

export const labReducer = createReducer(
  {},
  {
    createLabResourceRequest: (state) => {
      state.loading = true;
    },

    createLabResourceSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    createLabResourceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getLabResourcesRequest: (state) => {
      state.loading = true;
    },

    getLabResourcesSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.labResources;
    },

    getLabResourcesFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getLabResourceByIdRequest: (state) => {
      state.loading = true;
    },

    getLabResourceByIdSuccess: (state, action) => {
      state.loading = false;
      state.item = action.payload.labResource;
    },

    getLabResourceByIdFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateLabResourceRequest: (state) => {
      state.loading = true;
    },

    updateLabResourceSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    updateLabResourceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteLabResourceRequest: (state) => {
      state.loading = true;
    },

    deleteLabResourceSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },

    deleteLabResourceFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createLendLabResourceRequest: (state) => {
      state.loading = true;
    },

    createLendLabResourceRequestSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    createLendLabResourceRequestFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    changeLendLabResourceRequestStatusRequest: (state) => {
      state.loading = true;
    },
    changeLendLabResourceRequestStatusSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    changeLendLabResourceRequestStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getAllLabResourcesRequestsRequest: (state) => {
      state.loading = true;
    },
    getAllLabResourcesRequestsSuccess: (state, action) => {
      state.loading = false;
      state.lendItems = action.payload.requests;
    },
    getAllLabResourcesRequestsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getMyLabResourceRequestsRequest: (state) => {
      state.loading = true;
    },
    getMyLabResourceRequestsSuccess: (state, action) => {
      state.loading = false;
      state.myRequests = action.payload;
    },
    getMyLabResourceRequestsFail: (state, action) => {
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
