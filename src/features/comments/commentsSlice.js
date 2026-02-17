import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: { byPostId: {} },
  reducers: {},
});

export default commentsSlice.reducer;