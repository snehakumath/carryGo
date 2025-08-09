import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Check authentication

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
