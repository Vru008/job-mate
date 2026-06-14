import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Wrap a route to require login and (optionally) specific roles.
// <ProtectedRoute roles={["recruiter"]}><PostJob /></ProtectedRoute>
function ProtectedRoute({ children, roles }) {
  const { user, ready } = useAuth();

  if (!ready) return null; // wait until session is restored

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
