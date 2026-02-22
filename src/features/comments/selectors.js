export const selectCommentsByPost = (postId) => (state) =>
  state.comments.byPostId[postId] || [];