import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

export default function ProtectedRoute() {
  const { auth } = useAuth();

  console.log("ProtectedRoute auth:", auth);

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
