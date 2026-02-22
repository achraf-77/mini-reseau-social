import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../features/posts/postsSlice";
import { Link } from "react-router-dom";

export default function MyPosts() {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.currentUser);
  const posts = useSelector((s) => s.posts.items);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (!user) {
    return <div className="container">You must login first.</div>;
  }

  const myPosts = posts.filter((p) => String(p.authorId) === String(user.id));

  return (
    <div className="container">
      <h2 className="pageTitle">My Posts</h2>
      <p className="subtle">Only posts created by @{user.username}</p>

      {myPosts.map((p) => (
        <div key={p.id} className="card">
          <div className="cardHeader">
            <div className="cardMeta">
              <span className="pill">Post #{p.id}</span>
              <span className="pill">❤️ {p.likes || 0}</span>
            </div>

            <div className="row">
              <Link className="btn" to={`/posts/edit/${p.id}`}>Edit</Link>
              <button className="btn btnDanger" onClick={() => dispatch(deletePost(p.id))}>
                Delete
              </button>
              <Link className="btn btnGhost" to={`/post/${p.id}`}>Details</Link>
            </div>
          </div>

          <p style={{ margin: 0 }}>{p.content}</p>
          {p.image && <img className="img" src={p.image} alt="" />}
        </div>
      ))}

      {myPosts.length === 0 && <div className="center">No posts yet.</div>}
    </div>
  );
}