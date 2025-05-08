import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  useMediaQuery,
  Divider,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  DirectionsCar as CarIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Map as MapIcon,
  Restaurant as FoodIcon,
  Home as HomeIcon,
  Place as PlaceIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const VolunteerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [navValue, setNavValue] = useState(0);

  const [volunteerData, setVolunteerData] = useState(null);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);
  const [pastDeliveries, setPastDeliveries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        setLoading(true);

        // In a real application, you'd fetch this from your API based on currentUser.id
        // For now, we'll use mock data
        setTimeout(() => {
          // Mock volunteer data
          const mockVolunteer = {
            id: currentUser?.id || "v-123",
            firstName: currentUser?.firstName || "John",
            lastName: currentUser?.lastName || "Doe",
            email: currentUser?.email || "volunteer@example.com",
            phoneNumber: "555-123-4567",
            address: "123 Main Street",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            availability: "Weekdays, Mornings",
            completedDeliveries: 6,
            assignedDeliveries: 10,
            joinedSince: "January 15, 2023",
            profileImage: `https://i.pravatar.cc/300?u=${
              currentUser?.id || "v-123"
            }`,
          };

          // Enhanced mock upcoming deliveries with more details for mobile view
          const mockUpcoming = [
            {
              id: "ST7890QR12",
              date: "2025-05-10",
              time: "9:00 AM - 11:00 AM",
              route: "North Springfield",
              recipientName: "Aman Sharma",
              address: "201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069",
              distance: "5 km",
              clients: 1,
              status: "Yet to Start",
              items: [
                { name: "Caramel Macchiato", quantity: 1 },
                { name: "Egg Mayo Breakfast Sandwich", quantity: 2 },
              ],
            },
            {
              id: "ST7890QR13",
              date: "2025-05-10",
              time: "11:30 AM - 1:30 PM",
              route: "East Springfield",
              recipientName: "Sarah Johnson",
              address: "42 Oak Street, Apartment 7B, Springfield, IL 62704",
              distance: "3.2 km",
              clients: 1,
              status: "Yet to Start",
              items: [
                { name: "Vegetable Soup", quantity: 1 },
                { name: "Grilled Chicken Sandwich", quantity: 1 },
                { name: "Fresh Fruit Cup", quantity: 1 },
              ],
            },
            {
              id: "ST7890QR14",
              date: "2025-05-11",
              time: "10:00 AM - 12:00 PM",
              route: "West Springfield",
              recipientName: "Robert Miller",
              address: "157 Pine Avenue, Springfield, IL 62701",
              distance: "4.5 km",
              clients: 1,
              status: "Pending Confirmation",
              items: [
                { name: "Turkey & Swiss Sandwich", quantity: 1 },
                { name: "Garden Salad", quantity: 1 },
                { name: "Apple Juice", quantity: 1 },
              ],
            },
          ];

          // Mock past deliveries
          const mockPast = [
            {
              id: 101,
              date: "2025-05-07",
              route: "South Springfield",
              clients: 2,
              status: "Completed",
            },
            {
              id: 102,
              date: "2025-05-05",
              route: "West Springfield",
              clients: 4,
              status: "Completed",
            },
          ];

          // Mock notifications
          const mockNotifications = [
            {
              id: 201,
              type: "schedule_confirmation",
              message: "Please confirm your delivery for May 11, 2025",
              date: "2025-05-08",
              isRead: false,
            },
            {
              id: 202,
              type: "route_change",
              message: "Route change for your May 10 delivery - see details",
              date: "2025-05-07",
              isRead: true,
            },
          ];

          setVolunteerData(mockVolunteer);
          setUpcomingDeliveries(mockUpcoming);
          setPastDeliveries(mockPast);
          setNotifications(mockNotifications);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching volunteer data:", err);
        setError(
          "Failed to load your volunteer information. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, [currentUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "yet to start":
        return "warning";
      case "pending confirmation":
        return "warning";
      case "completed":
        return "primary";
      default:
        return "default";
    }
  };

  // Helper function to check if a delivery is eligible for route mapping
  const canGenerateRouteMap = (status) => {
    return status.toLowerCase() !== "completed";
  };

  const handleConfirmDelivery = (deliveryId) => {
    // In a real app, you'd call an API to confirm the delivery
    console.log(`Confirming delivery ${deliveryId}`);

    // For now, just update the local state
    setUpcomingDeliveries(
      upcomingDeliveries.map((delivery) =>
        delivery.id === deliveryId
          ? { ...delivery, status: "Confirmed" }
          : delivery
      )
    );
  };

  const handleViewDetails = (deliveryId) => {
    // Navigate to delivery details page
    navigate(`/volunteer-delivery/${deliveryId}`);
  };

  // Helper function to check if any non-completed deliveries exist
  const hasActiveDeliveries = () => {
    return upcomingDeliveries.some(
      (delivery) => delivery.status.toLowerCase() !== "completed"
    );
  };

  const handleGenerateRouteMap = () => {
    // Navigate to route map with all active deliveries
    navigate(`/route-map/all`);
  };

  const handleViewAllSchedules = () => {
    navigate("/volunteer-schedules");
  };

  const handleViewAllNotifications = () => {
    navigate("/volunteer-notifications");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <Box sx={{ pb: isMobile ? 8 : 4 }}>
      {/* Mobile-friendly AppBar */}
      <AppBar position="static" color="primary" elevation={isMobile ? 1 : 0}>
        <Toolbar sx={{ p: isMobile ? 1 : 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello, {volunteerData.firstName}!
          </Typography>

          <IconButton
            color="inherit"
            onClick={handleViewAllNotifications}
            size={isMobile ? "medium" : "large"}
          >
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            edge="end"
            onClick={() => navigate(`/volunteer-profile/${volunteerData.id}`)}
            size={isMobile ? "medium" : "large"}
          >
            <Avatar
              src={volunteerData.profileImage}
              sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2, px: isMobile ? 1 : 2 }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="h1"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Volunteer Dashboard
        </Typography>

        {/* Task Summary Cards */}
        <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 2 : 3 }}>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: isMobile ? 1.5 : 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "primary.light",
                color: "primary.contrastText",
                borderRadius: 2,
              }}
            >
              <Typography variant={isMobile ? "h5" : "h4"} component="div" fontWeight="bold">
                {volunteerData.assignedDeliveries}
              </Typography>
              <Typography variant="body2">Assigned</Typography>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              sx={{
                p: isMobile ? 1.5 : 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "success.light",
                color: "success.contrastText",
                borderRadius: 2,
              }}
            >
              <Typography variant={isMobile ? "h5" : "h4"} component="div" fontWeight="bold">
                {volunteerData.completedDeliveries}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Delivery Cards - Main Focus for Mobile */}
        <Typography variant="h6" component="h2" sx={{ mb: isMobile ? 1 : 2 }}>
          Your Deliveries
        </Typography>

        {upcomingDeliveries.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            {upcomingDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Order ID: {delivery.id}
                    </Typography>
                    <Chip
                      label={delivery.status}
                      size="small"
                      color={getStatusChipColor(delivery.status)}
                      sx={{ fontWeight: "medium", mt: isMobile ? 0.5 : 0 }}
                    />
                  </Box>

                  <Typography variant="subtitle1" fontWeight="medium">
                    {delivery.recipientName}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: isMobile ? "flex-start" : "center",
                      mb: 0.5,
                      mt: 1,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: isMobile ? 0.5 : 0 }}>
                      <PlaceIcon
                        fontSize="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        Delivery Distance: {delivery.distance}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 0.5 }}
                  >
                    <HomeIcon
                      fontSize="small"
                      color="primary"
                      sx={{ mr: 1, mt: 0.5 }}
                    />
                    <Typography variant="body2" 
                      sx={{ 
                        wordBreak: "break-word",
                        whiteSpace: "normal"
                      }}>
                      {delivery.address}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      Food Items:
                    </Typography>
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      maxHeight: isMobile ? "120px" : "none",
                      overflowY: isMobile ? "auto" : "visible"
                    }}>
                      {delivery.items.map((item, index) => (
                        <Box key={index} sx={{ display: "flex", pl: 1, mb: 0.5 }}>
                          <FoodIcon
                            fontSize="small"
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                              fontSize: "0.9rem",
                            }}
                          />
                          <Typography variant="body2">
                            {item.name} ({item.quantity})
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <CalendarIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(delivery.date)} • {delivery.time}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{ 
                    justifyContent: "space-between", 
                    px: isMobile ? 1.5 : 2, 
                    pb: isMobile ? 1.5 : 2,
                    flexDirection: isMobile ? "column" : "row" 
                  }}
                >
                  {delivery.status === "Pending Confirmation" ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleConfirmDelivery(delivery.id)}
                      fullWidth
                    >
                      Confirm Delivery
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(delivery.id)}
                      fullWidth={isMobile}
                    >
                      View Details
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}

            {/* Single Generate Route Map button at the bottom */}
            {hasActiveDeliveries() && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<MapIcon />}
                onClick={handleGenerateRouteMap}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                Generate Optimized Route Map
              </Button>
            )}
          </Box>
        ) : (
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="body1" color="text.secondary">
              No deliveries scheduled at this time.
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Fixed bottom navigation for mobile - using BottomNavigation component instead of custom implementation */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
          elevation={3}
        >
          <BottomNavigation
            value={navValue}
            onChange={(event, newValue) => {
              setNavValue(newValue);
            }}
            showLabels
          >
            <BottomNavigationAction 
              label="Home" 
              icon={<HomeIcon />} 
              onClick={() => navigate("/volunteer-dashboard")} 
            />
            <BottomNavigationAction 
              label="Schedule" 
              icon={<ScheduleIcon />} 
              onClick={handleViewAllSchedules}
            />
            <BottomNavigationAction 
              label="Routes" 
              icon={<MapIcon />} 
              onClick={() => navigate("/volunteer-routes")} 
            />
            <BottomNavigationAction 
              label="Profile" 
              icon={<AccountCircleIcon />}
              onClick={() => navigate(`/volunteer-profile/${volunteerData.id}`)}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default VolunteerDashboard;
