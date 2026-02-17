import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../features/posts/postsSlice";
import { selectAllPosts } from "../features/posts/selectors";

export default function MyPosts() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.currentUser);
  const posts = useSelector(selectAllPosts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const my = posts.filter((p) => String(p.authorId) === String(user?.id));

  return (
    <div style={{ padding: 16 }}>
      <h2>My Posts</h2>

      {my.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}
        >
          <p>{p.content}</p>
          <button onClick={() => dispatch(deletePost(p.id))}>Delete</button>
        </div>
      ))}

      {my.length === 0 && <p>No posts yet.</p>}
    </div>
  );
}