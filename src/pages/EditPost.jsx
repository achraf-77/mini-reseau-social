import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectPostById } from "../features/posts/selectors";
import { updatePost } from "../features/posts/postsSlice";

export default function EditPost() {
  const { id } = useParams(); // id string
  const post = useSelector(selectPostById(id));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [hashtags, setHashtags] = useState("");

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setImage(post.image || "");
      setHashtags((post.hashtags || []).join(", "));
    }
  }, [post]);

  if (!post) return <div className="container"><div className="center">Post not found.</div></div>;

  const onSubmit = async (e) => {
    e.preventDefault();

    const tags = hashtags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await dispatch(
      updatePost({
        id, 
        patch: { content, image, hashtags: tags },
      })
    );

    navigate("/my-posts");
  };

  return (
    <div className="container">
      <h2 className="pageTitle">Edit Post</h2>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={onSubmit} className="formGrid">
          <label className="subtle">Content</label>
          <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} required />

          <label className="subtle">Image URL</label>
          <input className="input" value={image} onChange={(e) => setImage(e.target.value)} />

          <label className="subtle">Hashtags</label>
          <input className="input" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />

          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn btnPrimary" type="submit">Save</button>
            <button className="btn btnGhost" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}