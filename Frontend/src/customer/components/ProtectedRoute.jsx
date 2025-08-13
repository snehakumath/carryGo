import { Outlet, Navigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

const ProtectedRoute = () => {
  const { authStatus, loading } = useApi();

  if (loading) return <div>Loading...</div>; // Or spinner

  if (!authStatus?.loggedIn) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
