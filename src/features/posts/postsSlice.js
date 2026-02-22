import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../services/api";

export const fetchPosts = createAsyncThunk("posts/fetch", async () => {
  const data = await apiGet("/posts");
  return data.slice().sort((a, b) => b.id - a.id);
});

export const addPost = createAsyncThunk("posts/add", async (newPost) => {
  return apiPost("/posts", { ...newPost, likes: 0, likedBy: [] });
});

export const updatePost = createAsyncThunk("posts/update", async ({ id, patch }) => {
  return apiPatch(`/posts/${id}`, patch);
});

export const deletePost = createAsyncThunk("posts/delete", async (id) => {
  await apiDelete(`/posts/${id}`);
  return id;
});

// Like/Unlike: user 
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ post, userId }) => {
    const likedBy = post.likedBy || [];
    const already = likedBy.includes(userId);

    const patch = already
      ? {
          likes: Math.max(0, (post.likes || 0) - 1),
          likedBy: likedBy.filter((id) => id !== userId),
        }
      : { likes: (post.likes || 0) + 1, likedBy: [...likedBy, userId] };

    return apiPatch(`/posts/${post.id}`, patch);
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    filter: { hashtag: "", authorId: "" },
  },
  reducers: {
    setHashtagFilter: (state, action) => {
      state.filter.hashtag = action.payload;
    },
    setAuthorFilter: (state, action) => {
      state.filter.authorId = action.payload;
    },
    clearFilters: (state) => {
      state.filter = { hashtag: "", authorId: "" };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchPosts.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchPosts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      })
      .addCase(addPost.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(updatePost.fulfilled, (s, a) => {
        const i = s.items.findIndex((p) => p.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(deletePost.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      })
      .addCase(toggleLike.fulfilled, (s, a) => {
        const i = s.items.findIndex((p) => p.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      });
  },
});

export const { setHashtagFilter, setAuthorFilter, clearFilters } = postsSlice.actions;
export default postsSlice.reducer;