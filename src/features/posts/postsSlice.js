import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: { items: [] },
  reducers: {},
});

export default postsSlice.reducer;