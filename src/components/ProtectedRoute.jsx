import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/selectors";

export default function ProtectedRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}