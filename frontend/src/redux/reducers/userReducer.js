import { createReducer } from '@reduxjs/toolkit'

export const userReducer = createReducer(
    {},
    {
        loginRequest: (state) => {
            state.loading = true
        },

        registerRequest: (state) => {
            state.loading = true
        },

        registerSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.message = action.payload.message
        },

        registerFail: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.payload
        },

        loginSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.message = action.payload.message
        },

        loginFail: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.payload
        },

        loadUserRequest: (state) => {
            state.loading = true
        },

        loadUserSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
        },

        loadUserFail: (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
        },

        logoutRequest: (state) => {
            state.loading = true
        },

        logoutSuccess: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.message = action.payload.message
        },

        logoutFail: (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.error = action.payload
        },

        clearMessage: (state) => {
            state.message = null
        },
        clearError: (state) => {
            state.error = null
        },
    }
)
