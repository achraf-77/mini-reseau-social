import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = {
      id: Date.now(),
      username,
    };

    dispatch(setCurrentUser(user));
    navigate("/");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}