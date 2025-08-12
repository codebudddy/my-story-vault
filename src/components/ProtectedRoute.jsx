import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
