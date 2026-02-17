import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import { selectAllPosts } from "../features/posts/selectors";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector((s) => s.posts.status);
  const error = useSelector((s) => s.posts.error);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div style={{ padding: 16 }}>
      <h2>All Posts</h2>
      <p>
        <Link to="/posts/new">+ New Post</Link> | <Link to="/my-posts">My Posts</Link>
      </p>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p style={{ color: "red" }}>{error}</p>}

      {posts.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}
        >
          <p>{p.content}</p>
          {p.image && (
            <img src={p.image} alt="" style={{ width: "100%", maxWidth: 420, borderRadius: 8 }} />
          )}
          <p>hashtags: {(p.hashtags || []).map((h) => `#${h}`).join(" ")}</p>
        </div>
      ))}
    </div>
  );
}