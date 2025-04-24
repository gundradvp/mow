import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import theme from "./theme";

// Layout
import Layout from "./components/Layout/Layout";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Calendar from "./pages/Calendar/Calendar";
import VolunteerManagement from "./pages/Admin/VolunteerManagement";
import ClientManagement from "./pages/Admin/ClientManagement";
import RouteManagement from "./pages/Admin/RouteManagement";

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
    // User doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />

            {/* Admin Routes */}
            <Route
              path="volunteers"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <VolunteerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="clients"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <ClientManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="routes"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <RouteManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
