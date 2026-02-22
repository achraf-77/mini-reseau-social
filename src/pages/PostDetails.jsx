import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import { selectPostById } from "../features/posts/selectors";
import { fetchCommentsByPost, addComment } from "../features/comments/commentsSlice";
import { selectCommentsByPost } from "../features/comments/selectors";
import { apiGet } from "../services/api";

export default function PostDetails() {
  const { id } = useParams();

  // key:
  const isNumeric = String(Number(id)) === String(id);
  const postKey = isNumeric ? Number(id) : id;

  const post = useSelector(selectPostById(postKey));
  const comments = useSelector(selectCommentsByPost(postKey));
  const user = useSelector((s) => s.auth.currentUser);

  const dispatch = useDispatch();

  const [usersMap, setUsersMap] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchCommentsByPost(postKey));

    apiGet("/users")
      .then((users) => {
        const m = {};
        users.forEach((u) => (m[u.id] = u));
        setUsersMap(m);
      })
      .catch(() => setUsersMap({}));
  }, [dispatch, postKey]);

  if (!post) return <div style={{ padding: 16 }}>Post not found.</div>;
  if (!user) return <div style={{ padding: 16 }}>You must login.</div>;

  const onSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      addComment({
        postId: postKey,      
        authorId: user.id,
        content: text,
      })
    );

    setText("");
  };

  const author = usersMap[post.authorId];

  return (
    <div style={{ padding: 16 }}>
      <h2>Post Details</h2>

      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <p>{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt=""
            style={{ width: "100%", maxWidth: 420, borderRadius: 8 }}
          />
        )}
        <p>hashtags: {(post.hashtags || []).map((h) => `#${h}`).join(" ")}</p>
        <p>likes: {post.likes || 0}</p>

        <p>
          Author:{" "}
          <Link to={`/profile/${post.authorId}`}>
            {author ? author.username : `User #${post.authorId}`}
          </Link>
        </p>
      </div>

      <h3 style={{ marginTop: 16 }}>Comments</h3>
      {comments.map((c) => (
        <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
          <p style={{ margin: 0 }}>{c.content}</p>
          <small>by {usersMap[c.authorId]?.username ?? `User #${c.authorId}`}</small>
        </div>
      ))}

      <form onSubmit={onSubmit} style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}