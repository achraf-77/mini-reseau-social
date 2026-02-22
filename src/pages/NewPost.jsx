import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.currentUser);

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [hashtags, setHashtags] = useState("");

  if (!user) {
    return (
      <div className="container">
        <div className="center">You must login first.</div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const tags = hashtags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await dispatch(
      addPost({
        content,
        image,
        hashtags: tags,
        authorId: String(user.id), 
        likes: 0,
        likedBy: [],
      })
    );

    navigate("/");
  };

  return (
    <div className="container">
      <h2 className="pageTitle">Create New Post</h2>
      <p className="subtle">Share something awesome with the community </p>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={onSubmit} className="formGrid">
          <div>
            <label className="subtle">Post Content</label>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write something amazing..."
              required
            />
          </div>

          <div>
            <label className="subtle">Image URL (optional)</label>
            <input
              className="input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="subtle">Hashtags</label>
            <input
              className="input"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="react, frontend, dev"
            />
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <button type="submit" className="btn btnPrimary">
               Publish
            </button>

            <button
              type="button"
              className="btn btnGhost"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}