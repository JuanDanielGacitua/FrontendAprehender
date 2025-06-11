// src/components/RoutesComponent/PrivateRouteByRole.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Componente que restringe acceso según roles permitidos
// Usage: <Route element={<PrivateRouteByRole allowedRoles={["UTP"]}} > … </Route>
const PrivateRouteByRole = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default PrivateRouteByRole;
