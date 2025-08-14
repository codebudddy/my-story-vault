import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import BookPage from "./pages/BookPage";
import ChapterPage from "./pages/ChapterPage";
import ProtectedRoute from "./components/ProtectedRoute"; // We'll create this

export default function App() {
  console.log("Environment variables:", import.meta.env);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:bookId"
          element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:bookId/chapter/:chapterId"
          element={
            <ProtectedRoute>
              <ChapterPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
