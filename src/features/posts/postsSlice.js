import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await api.get("/posts");
  return data.slice().sort((a, b) => b.id - a.id);
});

export const addPost = createAsyncThunk("posts/addPost", async (newPost) => {
  const payload = { ...newPost, likes: 0, likedBy: [] };
  const { data } = await api.post("/posts", payload);
  return data;
});

export const deletePost = createAsyncThunk("posts/deletePost", async (id) => {
  await api.delete(`/posts/${id}`);
  return id;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;