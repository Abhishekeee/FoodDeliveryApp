import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    data: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setData } = userSlice.actions;

export const selectuser = (state) => state.user.user;
export const selectdata = (state) => state.user.data;

export default userSlice.reducer;
