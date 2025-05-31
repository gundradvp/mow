import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const DriverLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Check if there's a redirect path in the location state
  const from = location.state?.from?.pathname || "/app/volunteer-dashboard"; // Updated path for driver dashboard
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use the AuthContext login function with static values
      const userData = await login(username, password); // Redirect user based on their role - default to driver dashboard
      if (userData.role === "Driver") {
        // Drivers/Captains have their own role now
        navigate("/app/volunteer-dashboard");
      } else if (userData.role === "Volunteer") {
        // For backward compatibility, volunteers still go to the same dashboard
        navigate("/app/volunteer-dashboard");
      } else if (userData.role === "Admin" || userData.role === "Coordinator") {
        // Only if explicitly needed, redirect admin/coordinator to their dashboard
        navigate("/app/dashboard");
      } else {
        // Default - send to driver dashboard
        navigate("/app/volunteer-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.message || "Invalid username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }; // Demo driver login for testing purposes
  const handleDemoLogin = () => {
    setUsername("driver1");
    setPassword("Password123!");
    // This will use the Driver role we set up in AuthContext
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: "12px",
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            {" "}
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              color="primary"
            >
              Meals On Wheels
            </Typography>
            <Typography variant="h6" color="secondary" sx={{ mt: 1 }}>
              Driver Portal
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Sign in to access your delivery account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 3,
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                color="primary"
              >
                Forgot password?
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Need help?
              </Typography>
            </Divider>

            <Box sx={{ mb: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Not a registered driver yet?
              </Typography>{" "}
              <Button
                component={RouterLink}
                to="/volunteer-registration"
                variant="outlined"
                fullWidth
                sx={{ borderRadius: "8px" }}
              >
                Apply to Drive
              </Button>
            </Box>

            {/* Only show demo login button in development */}
            {process.env.NODE_ENV === "development" && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  onClick={handleDemoLogin}
                >
                  Use Demo Driver Account
                </Button>
              </Box>
            )}
          </form>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              color="textSecondary"
            >
              Staff/Admin Login
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DriverLogin;
