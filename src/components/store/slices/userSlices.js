import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",

    initialState : {
        user: null,
        accessToken: null,
        isAuthenticated: false,
    },

    reducers : {
        login: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        }
    }
});

export const {setUser, logout, login} = userSlice.actions;
export default userSlice.reducer;