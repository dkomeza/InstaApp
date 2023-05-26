import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@features/auth/context/AuthContext";

export default function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={"/signin"} />;
}
