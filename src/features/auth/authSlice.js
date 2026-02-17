import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("currentUser");

const initialState = {
  currentUser: savedUser ? JSON.parse(savedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, logout } = authSlice.actions;  // ← مهم هادي
export default authSlice.reducer;