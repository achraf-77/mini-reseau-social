export const selectAllPosts = (state) => state.posts.items;
export const selectPostsFilter = (state) => state.posts.filter;

export const selectFilteredPosts = (state) => {
  const posts = selectAllPosts(state);
  const { hashtag, authorId } = selectPostsFilter(state);

  return posts.filter((p) => {
    const okHashtag = hashtag
      ? (p.hashtags || []).map((h) => h.toLowerCase()).includes(hashtag.toLowerCase())
      : true;
    const okAuthor = authorId ? String(p.authorId) === String(authorId) : true;
    return okHashtag && okAuthor;
  });
};


export const selectFilteredPostsSortedByLikes = (state) => {
  return selectFilteredPosts(state)
    .slice()
    .sort((a, b) => (b.likes || 0) - (a.likes || 0));
};

export const selectPostById = (id) => (state) =>
  selectAllPosts(state).find((p) => String(p.id) === String(id));

export const selectMyPosts = (state) => {
  const userId = state.auth.currentUser?.id;
  if (!userId) return [];
  return selectAllPosts(state).filter((p) => String(p.authorId) === String(userId));
};

export const selectPostsByAuthor = (authorId) => (state) =>
  selectAllPosts(state).filter((p) => String(p.authorId) === String(authorId));