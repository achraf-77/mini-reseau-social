import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost } from "../../services/api";

export const fetchCommentsByPost = createAsyncThunk(
  "comments/fetchByPost",
  async (postId) => {
    const data = await apiGet(`/comments?postId=${postId}`);
    return { postId, comments: data };
  }
);

export const addComment = createAsyncThunk(
  "comments/add",
  async (newComment) => {
    const data = await apiPost("/comments", newComment);
    return data;
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: { byPostId: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCommentsByPost.fulfilled, (s, a) => {
      s.byPostId[a.payload.postId] = a.payload.comments;
    }).addCase(addComment.fulfilled, (s, a) => {
      const pid = a.payload.postId;
      s.byPostId[pid] = s.byPostId[pid] || [];
      s.byPostId[pid].push(a.payload); // ✅ كيبان مباشرة
    });
  },
});

export default commentsSlice.reducer;