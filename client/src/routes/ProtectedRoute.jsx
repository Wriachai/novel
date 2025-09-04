// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/novel-store";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  // ถ้ายังไม่ login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ถ้า role ไม่ตรง
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-found" replace />;
  }

  // ถ้าผ่าน → render children
  return <Outlet />;
};

export default ProtectedRoute;
