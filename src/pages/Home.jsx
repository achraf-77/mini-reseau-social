import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchPosts,
  setHashtagFilter,
  setAuthorFilter,
  clearFilters,
  toggleLike,
} from "../features/posts/postsSlice";

import {
  selectFilteredPosts,
  selectFilteredPostsSortedByLikes,
} from "../features/posts/selectors";

import { apiGet } from "../services/api";

export default function Home() {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [sortByLikes, setSortByLikes] = useState(false);

  const user = useSelector((s) => s.auth.currentUser);
  const status = useSelector((s) => s.posts.status);
  const error = useSelector((s) => s.posts.error);
  const filter = useSelector((s) => s.posts.filter);

  const posts = useSelector(
    sortByLikes ? selectFilteredPostsSortedByLikes : selectFilteredPosts
  );

  useEffect(() => {
    dispatch(fetchPosts());
    apiGet("/users").then(setUsers).catch(() => setUsers([]));
  }, [dispatch]);

  return (
    <div className="container">
      <h2 className="pageTitle">All Posts</h2>
      <p className="subtle">Explore posts, filter by hashtag/author, and sort by likes.</p>

      <div className="row" style={{ marginBottom: 12 }}>
        <Link className="btn btnPrimary" to="/posts/new">+ New Post</Link>
        <Link className="btn" to="/my-posts">My Posts</Link>
        {user && <Link className="btn btnGhost" to={`/profile/${user.id}`}>My Profile</Link>}
      </div>

      {/* Filters + Sort */}
      <div className="toolbar">
        <div className="row">
          <input
            className="input"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            placeholder="hashtag (ex: react)"
            style={{ maxWidth: 220 }}
          />
          <button className="btn" onClick={() => dispatch(setHashtagFilter(hashtagInput.trim()))}>
            Apply hashtag
          </button>

          <select
            className="select"
            value={authorInput}
            onChange={(e) => setAuthorInput(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            <option value="">All authors</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => dispatch(setAuthorFilter(authorInput))}>
            Apply author
          </button>

          <button className="btn btnGhost" onClick={() => dispatch(clearFilters())}>
            Clear
          </button>

          <button className="btn" onClick={() => setSortByLikes((v) => !v)}>
            {sortByLikes ? "Sort: default" : "Sort: popularity (likes)"}
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <span className="pill">hashtag: "{filter.hashtag || "—"}"</span>{" "}
          <span className="pill">authorId: "{filter.authorId || "—"}"</span>{" "}
          <span className="pill">sortByLikes: {String(sortByLikes)}</span>
        </div>
      </div>

      {status === "loading" && <div className="center">Loading...</div>}
      {status === "failed" && <div className="center">{error}</div>}

      {posts.map((p) => (
        <div key={p.id} className="card">
          <div className="cardHeader">
            <div className="cardMeta">
              <span className="pill">Post #{p.id}</span>
              <Link to={`/profile/${p.authorId}`} style={{ color: "inherit", textDecoration: "none" }}>
                <span className="pill">Author {p.authorId}</span>
              </Link>
            </div>

            <div className="row">
              <button
                className="btn"
                onClick={() => dispatch(toggleLike({ post: p, userId: user.id }))}
              >
                {(p.likedBy || []).includes(user.id) ? "Unlike" : "Like"}
              </button>
              <span className="pill">❤️ {p.likes || 0}</span>
              <Link className="btn btnGhost" to={`/post/${p.id}`}>Details</Link>
            </div>
          </div>

          <p style={{ margin: 0 }}>{p.content}</p>

          {p.image && <img className="img" src={p.image} alt="" />}

          <div className="row" style={{ marginTop: 10 }}>
            {(p.hashtags || []).length > 0 ? (
              (p.hashtags || []).map((h) => (
                <span key={h} className="pill">#{h}</span>
              ))
            ) : (
              <span className="subtle">No hashtags</span>
            )}
          </div>
        </div>
      ))}

      {posts.length === 0 && status === "succeeded" && (
        <div className="center">No posts.</div>
      )}
    </div>
  );
}