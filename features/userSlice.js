import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    username: null,
    data: null,
    userLat: null,
    userLon: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    setUserLat: (state, action) => {
      state.userLat = action.payload;
    },
    setUserLon: (state, action) => {
      state.userLon = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setUsername, setData, setUserLat, setUserLon } =
  userSlice.actions;

export const selectuser = (state) => state.user.user;
export const selectusername = (state) => state.user.username;
export const selectdata = (state) => state.user.data;
export const selectUserLat = (state) => state.user.userLat;
export const selectUserLon = (state) => state.user.userLon;

export default userSlice.reducer;
