import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../features/auth/authSlice";
import { apiGet, apiPost } from "../services/api";

export default function Login() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    apiGet("/users")
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const loginWithUser = (u) => {
    dispatch(setCurrentUser(u));
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;

    // user 
    const found = users.find((u) => u.username.toLowerCase() === name.toLowerCase());
    if (found) return loginWithUser(found);

    //db.json
    const newUser = await apiPost("/users", {
      username: name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    });

    setUsers((prev) => [...prev, newUser]);
    loginWithUser(newUser);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
        />
        <button type="submit">Enter</button>
      </form>

      <div style={{ marginTop: 16 }}>
        <p>Or pick an existing user:</p>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {users.map((u) => (
              <button key={u.id} onClick={() => loginWithUser(u)}>
                {u.username}
              </button>
            ))}
            {users.length === 0 && <p>No users in db yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
  
}