import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const user = useSelector((s) => s.auth.currentUser);
  const dispatch = useDispatch();

  return (
    <div className="navbar">
      <div className="navInner">
        <Link className="brand" to="/">
          MiniSocial <span className="badge">Redux Toolkit</span>
        </Link>

        <div className="navLinks">
          <Link to="/">Posts</Link>
          {user && <Link to="/posts/new">New</Link>}
          {user && <Link to="/my-posts">My Posts</Link>}
          {user && <Link to={`/profile/${user.id}`}>Profile</Link>}
        </div>

        <div className="navRight">
          {user ? (
            <>
              <span className="pill">@{user.username}</span>
              <button className="btn btnDanger" onClick={() => dispatch(logout())}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btnPrimary" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}