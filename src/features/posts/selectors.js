export const selectAllPosts = (state) => state.posts.items;

export const selectPostById = (id) => (state) =>
  state.posts.items.find((p) => String(p.id) === String(id));