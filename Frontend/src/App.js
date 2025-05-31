import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import theme from "./theme";
import LoadingScreen from "./components/LoadingScreen";

// Layout
import Layout from "./components/Layout/Layout";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DriverLogin from "./pages/Auth/DriverLogin";
import VolunteerRegistration from "./pages/Auth/VolunteerRegistration";
import Dashboard from "./pages/Dashboard/Dashboard";
import Calendar from "./pages/Calendar/Calendar";
import VolunteerManagement from "./pages/Admin/VolunteerManagement";
import ClientManagement from "./pages/Admin/ClientManagement";
import RouteManagement from "./pages/Admin/RouteManagement";

// Volunteer Pages
import VolunteerList from "./pages/VolunteerList";
import VolunteerDetail from "./pages/VolunteerDetail";
import VolunteerForm from "./pages/VolunteerForm";
import VolunteerSchedule from "./pages/VolunteerSchedule";
import DriverDashboard from "./pages/Dashboard/DriverDashboard";
import RouteMap from "./pages/RouteMap";
import DeliveryNavigation from "./pages/DeliveryNavigation";
import DeliveryDetails from "./pages/DeliveryDetails";
import IncidentReport from "./pages/IncidentReport";
import BarcodeScan from "./pages/BarcodeScan";
import DeliveryComplete from "./pages/DeliveryComplete";
import DeliveryConfirmation from "./pages/DeliveryConfirmation"; // Import the DeliveryConfirmation component

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
    // User doesn't have required role
    return <Navigate to="/app/volunteer-dashboard" replace />;
  }

  return children;
};

// This component shows a loading screen and then redirects to driver-login
const RedirectToDriverLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show loading screen for 1.5 seconds before redirecting
    const timer = setTimeout(() => {
      navigate("/driver-login", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingScreen />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {" "}
        <Routes>
          {/* Make driver-login the default route with a loading screen */}
          <Route path="/" element={<RedirectToDriverLogin />} />
          <Route path="/login" element={<DriverLogin />} />
          <Route path="/driver-login" element={<DriverLogin />} />
          {/* Redirect old volunteer-login to new driver-login for backwards compatibility */}
          <Route
            path="/volunteer-login"
            element={<Navigate to="/driver-login" replace />}
          />
          <Route
            path="/volunteer-registration"
            element={<VolunteerRegistration />}
          />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={<Navigate to="/app/volunteer-dashboard" replace />}
            />{" "}
            <Route path="dashboard" element={<Dashboard />} />{" "}
            <Route
              path="volunteer-dashboard"
              element={
                <ProtectedRoute requiredRoles={["Volunteer", "Driver"]}>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="calendar" element={<Calendar />} />
            {/* Route Map Pages */}{" "}
            <Route
              path="route-map/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <RouteMap />
                </ProtectedRoute>
              }
            />{" "}
            {/* Delivery Details Page */}
            <Route
              path="volunteer-delivery/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <DeliveryDetails />
                </ProtectedRoute>
              }
            />
            {/* Delivery Navigation Page */}
            <Route
              path="delivery-navigation/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <DeliveryNavigation />
                </ProtectedRoute>
              }
            />
            {/* Incident Report Page */}
            <Route
              path="incident-report/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <IncidentReport />
                </ProtectedRoute>
              }
            />
            {/* QR Code Scanning Page */}
            <Route
              path="scan-qr-code/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <BarcodeScan />
                </ProtectedRoute>
              }
            />
            {/* Delivery Complete Page */}
            <Route
              path="delivery-complete/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <DeliveryComplete />
                </ProtectedRoute>
              }
            />
            {/* Delivery Confirmation Page */}
            <Route
              path="delivery-confirmation/:deliveryId"
              element={
                <ProtectedRoute
                  requiredRoles={[
                    "Volunteer",
                    "Driver",
                    "Admin",
                    "Coordinator",
                  ]}
                >
                  <DeliveryConfirmation />
                </ProtectedRoute>
              }
            />
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
            {/* Volunteer Routes */}
            <Route
              path="volunteer-list"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <VolunteerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="volunteer/:id"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <VolunteerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="volunteer/new"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <VolunteerForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="volunteer/edit/:id"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <VolunteerForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="schedule/volunteer/:id"
              element={
                <ProtectedRoute requiredRoles={["Admin", "Coordinator"]}>
                  <VolunteerSchedule />
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
