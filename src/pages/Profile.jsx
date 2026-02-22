import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../services/api";
import { useSelector } from "react-redux";
import { selectPostsByAuthor } from "../features/posts/selectors";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const posts = useSelector(selectPostsByAuthor(id));

  useEffect(() => {
    apiGet(`/users/${id}`).then(setUser).catch(() => setUser(null));
  }, [id]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Profile</h2>
      {user ? <p>@{user.username}</p> : <p>User #{id}</p>}

      <h3>Posts</h3>
      {posts.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
          <p>{p.content}</p>
        </div>
      ))}
      {posts.length === 0 && <p>No posts.</p>}
    </div>
  );
}