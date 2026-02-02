import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth();

  if (loading) return <Spinner overlay />;
  
  if (!user) return <Navigate to="/" />;

  if (adminOnly && role !== "admin") {
    return <Navigate to="/lotes" />;
  }

  return children;
}
