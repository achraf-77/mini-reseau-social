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

  const onSubmit = async (e) => {
    e.preventDefault();
    const tags = hashtags.split(",").map((t) => t.trim()).filter(Boolean);

    await dispatch(
      addPost({
        content,
        image,
        hashtags: tags,
        authorId: user?.id ?? 1,
      })
    );

    navigate("/");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>New Post</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          required
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL (optional)"
        />
        <input
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="hashtags separated by comma: react, frontend"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}