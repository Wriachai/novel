import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/novel-store";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();

  // ❌ ยังไม่ได้ login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ มี allowedRoles แต่ role ไม่ตรง
  if (Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ ผ่าน
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
