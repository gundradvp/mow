import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

// MUI components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import RouteIcon from "@mui/icons-material/Route";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        if (
          currentUser.role === "Admin" ||
          currentUser.role === "Coordinator"
        ) {
          // Fetch actual counts from the API for Admin/Coordinator
          const [
            volunteersResponse,
            clientsResponse,
            routesResponse,
            schedulesResponse,
          ] = await Promise.all([
            axios.get("/api/volunteers/count"),
            axios.get("/api/clients/count"),
            axios.get("/api/deliveryroutes/count"),
            axios.get("/api/schedules/count"),
          ]);

          // Get upcoming and completed deliveries
          const today = new Date().toISOString().split("T")[0];
          const upcomingResponse = await axios.get(
            `/api/schedules/upcoming?date=${today}`
          );
          const completedResponse = await axios.get(
            `/api/schedules/completed?date=${today}`
          );

          setStats({
            volunteers: volunteersResponse.data.count,
            clients: clientsResponse.data.count,
            routes: routesResponse.data.count,
            scheduledDeliveries: schedulesResponse.data.count,
            completedDeliveries: completedResponse.data.count,
            upcomingDeliveries: upcomingResponse.data.count,
          });
        } else {
          // Volunteer view - fetch real data for the logged-in volunteer
          const volunteerId = await getVolunteerIdFromUserId(
            currentUser.id // Changed from currentUser.userId to currentUser.id
          );

          if (volunteerId) {
            const today = new Date().toISOString().split("T")[0];

            const [
              totalDeliveriesResponse,
              upcomingResponse,
              completedResponse,
              nextDeliveryResponse,
            ] = await Promise.all([
              axios.get(`/api/schedules/volunteer/${volunteerId}/count`),
              axios.get(
                `/api/schedules/volunteer/${volunteerId}/upcoming?date=${today}`
              ),
              axios.get(`/api/schedules/volunteer/${volunteerId}/completed`),
              axios.get(`/api/schedules/volunteer/${volunteerId}/next`),
            ]);

            setStats({
              totalDeliveries: totalDeliveriesResponse.data.count,
              upcomingDeliveries: upcomingResponse.data.count,
              completedDeliveries: completedResponse.data.count,
              nextDeliveryDate: nextDeliveryResponse.data?.scheduledDate
                ? new Date(
                    nextDeliveryResponse.data.scheduledDate
                  ).toLocaleDateString()
                : "None scheduled",
            });
          } else {
            // Add fallback data when volunteerId is null for volunteer users
            setStats({
              totalDeliveries: 0,
              upcomingDeliveries: 0,
              completedDeliveries: 0,
              nextDeliveryDate: "None scheduled",
            });
            setError(
              "Could not fetch volunteer information. Please contact an administrator."
            );
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);

        // Fallback to mock data if API calls fail
        if (
          currentUser.role === "Admin" ||
          currentUser.role === "Coordinator"
        ) {
          setStats({
            volunteers: 45,
            clients: 120,
            routes: 12,
            scheduledDeliveries: 78,
            completedDeliveries: 65,
            upcomingDeliveries: 13,
          });
        } else {
          setStats({
            totalDeliveries: 24,
            upcomingDeliveries: 3,
            completedDeliveries: 21,
            nextDeliveryDate: "2023-05-01",
          });
        }

        setError("Using fallback data. Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    // Helper function to get volunteer ID from user ID
    const getVolunteerIdFromUserId = async (userId) => {
      try {
        console.log("Looking up volunteer for user ID:", userId); // Add logging to help debug
        const response = await axios.get(`/api/volunteers/user/${userId}`);
        console.log("Volunteer lookup response:", response.data);
        return response.data?.id;
      } catch (err) {
        console.error("Error fetching volunteer data:", err);
        return null;
      }
    };

    if (currentUser) {
      fetchDashboardData();
    } else {
      // Handle the case when currentUser is null or undefined
      setStats({
        totalDeliveries: 0,
        upcomingDeliveries: 0,
        completedDeliveries: 0,
        nextDeliveryDate: "None scheduled",
      });
      setError("User not authenticated. Please log in.");
      setLoading(false);
    }
  }, [currentUser]);

  // Render loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Render dashboard for Admin/Coordinator
  if (currentUser.role === "Admin" || currentUser.role === "Coordinator") {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="textSecondary">
          Welcome, {currentUser.username}! Here's an overview of your
          organization's activities.
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PeopleIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.volunteers}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Volunteers
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <HomeIcon fontSize="large" color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.clients}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Clients
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <RouteIcon fontSize="large" color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h5">{stats.routes}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Routes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventAvailableIcon
                    fontSize="large"
                    color="success"
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h5">
                      {stats.scheduledDeliveries}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Scheduled Deliveries
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Delivery Status" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: "center",
                        bgcolor: "success.light",
                      }}
                    >
                      <Typography variant="h6">
                        {stats.completedDeliveries}
                      </Typography>
                      <Typography variant="body2">Completed</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper
                      elevation={0}
                      sx={{ p: 2, textAlign: "center", bgcolor: "info.light" }}
                    >
                      <Typography variant="h6">
                        {stats.upcomingDeliveries}
                      </Typography>
                      <Typography variant="body2">Upcoming</Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/calendar")}
                  >
                    View Schedule
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate("/volunteers")}
                    >
                      Manage Volunteers
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate("/clients")}
                    >
                      Manage Clients
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate("/routes")}
                    >
                      Configure Routes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Render dashboard for Volunteer
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Volunteer Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="textSecondary">
        Welcome, {currentUser.username}! Here's an overview of your volunteer
        activities.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Your Delivery Stats" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6">
                      {stats.totalDeliveries}
                    </Typography>
                    <Typography variant="body2">Total Deliveries</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, textAlign: "center", bgcolor: "success.light" }}
                  >
                    <Typography variant="h6">
                      {stats.completedDeliveries}
                    </Typography>
                    <Typography variant="body2">Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2, textAlign: "center", bgcolor: "info.light" }}
                  >
                    <Typography variant="h6">
                      {stats.upcomingDeliveries}
                    </Typography>
                    <Typography variant="body2">Upcoming</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Your next delivery is scheduled for:{" "}
                  <strong>{stats.nextDeliveryDate}</strong>
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/my-schedule")}
                  >
                    View My Schedule
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate("/profile")}
                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
