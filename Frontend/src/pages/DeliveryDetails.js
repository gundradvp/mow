import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBack as ArrowBackIcon,
  Restaurant as FoodIcon,
  LocalShipping as DeliveryIcon,
  CalendarToday as CalendarIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  PlaceOutlined as MapMarkerIcon,
  CheckCircle as CheckCircleIcon,
  AccountCircle as AccountCircleIcon,
  Schedule as ScheduleIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const DeliveryDetails = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [navValue, setNavValue] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivery, setDelivery] = useState(null);
  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        setLoading(true);

        // Simulate API fetch delay
        setTimeout(() => {
          // Mock delivery data based on the ID
          let mockDelivery;

          if (deliveryId === "ST7890QR12") {
            mockDelivery = {
              id: deliveryId,
              sequenceNumber: 1,
              date: "2025-05-10",
              time: "9:00 AM - 11:00 AM",
              route: "North Springfield",
              routeNumber: "R-452",
              recipientName: "Aman Sharma",
              phoneNumber: "+1 (555) 123-4567",
              address: "201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069",
              distance: "5 km",
              status: "Yet to Start",
              items: [
                { name: "Caramel Macchiato", quantity: 1, dietary: "Regular" },
                {
                  name: "Egg Mayo Breakfast Sandwich",
                  quantity: 2,
                  dietary: "Regular",
                },
              ],
              specialInstructions:
                "Please knock loudly, recipient has hearing difficulties. Ensure food is warm when delivered.",
              assignedDriver: {
                name: "John Doe",
                id: "DRV-123",
                contactNumber: "+1 (555) 987-6543",
              },
            };
          } else if (deliveryId === "ST7890QR13") {
            mockDelivery = {
              id: deliveryId,
              sequenceNumber: 2,
              date: "2025-05-10",
              time: "11:30 AM - 1:30 PM",
              route: "East Springfield",
              routeNumber: "R-452",
              recipientName: "Sarah Johnson",
              phoneNumber: "+1 (555) 234-5678",
              address: "42 Oak Street, Apartment 7B, Springfield, IL 62704",
              distance: "3.2 km",
              status: "Yet to Start",
              items: [
                { name: "Vegetable Soup", quantity: 1, dietary: "Vegetarian" },
                {
                  name: "Grilled Chicken Sandwich",
                  quantity: 1,
                  dietary: "High-Protein",
                },
                { name: "Fresh Fruit Cup", quantity: 1, dietary: "Low-Sugar" },
              ],
              specialInstructions:
                "Leave package outside door if no answer. Text on arrival.",
              assignedDriver: {
                name: "John Doe",
                id: "DRV-123",
                contactNumber: "+1 (555) 987-6543",
              },
            };
          } else if (deliveryId === "ST7890QR14") {
            mockDelivery = {
              id: deliveryId,
              sequenceNumber: 3,
              date: "2025-05-11",
              time: "10:00 AM - 12:00 PM",
              route: "West Springfield",
              routeNumber: "R-452",
              recipientName: "Robert Miller",
              phoneNumber: "+1 (555) 345-6789",
              address: "157 Pine Avenue, Springfield, IL 62701",
              distance: "4.5 km",
              status: "Pending Confirmation",
              items: [
                {
                  name: "Turkey & Swiss Sandwich",
                  quantity: 1,
                  dietary: "Regular",
                },
                { name: "Garden Salad", quantity: 1, dietary: "Gluten-Free" },
                { name: "Apple Juice", quantity: 1, dietary: "Regular" },
              ],
              specialInstructions:
                "Recipient uses wheelchair. Please wait patiently for door to be answered.",
              assignedDriver: {
                name: "John Doe",
                id: "DRV-123",
                contactNumber: "+1 (555) 987-6543",
              },
            };
          } else {
            // Default delivery data for any other ID
            mockDelivery = {
              id: deliveryId,
              sequenceNumber:
                parseInt(deliveryId.charAt(deliveryId.length - 1)) || 4,
              date: "2025-05-12",
              time: "1:00 PM - 3:00 PM",
              route: "Central Springfield",
              routeNumber: "R-452",
              recipientName: "Emma Wilson",
              phoneNumber: "+1 (555) 456-7890",
              address: "329 Maple Drive, Springfield, IL 62702",
              distance: "2.8 km",
              status: "Yet to Start",
              items: [
                {
                  name: "Tomato Basil Soup",
                  quantity: 1,
                  dietary: "Vegetarian",
                },
                { name: "Tuna Salad Wrap", quantity: 1, dietary: "Regular" },
                { name: "Banana", quantity: 2, dietary: "Regular" },
                { name: "Almond Milk", quantity: 1, dietary: "Dairy-Free" },
              ],
              specialInstructions:
                "Hand delivery only, do not leave unattended. Call if no answer.",
              assignedDriver: {
                name: "John Doe",
                id: "DRV-123",
                contactNumber: "+1 (555) 987-6543",
              },
            };
          }

          setDelivery(mockDelivery);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching delivery details:", error);
        setError("Failed to load delivery details. Please try again.");
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartDelivery = () => {
    navigate(`/app/route-map/${deliveryId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
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
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
            Delivery Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {/* Delivery Overview Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }} variant="outlined">
          {" "}
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Order #{delivery.id}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {delivery.recipientName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Chip
                  icon={<MapMarkerIcon fontSize="small" />}
                  label={`Stop ${delivery.sequenceNumber}`}
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Chip
                  label={delivery.status}
                  color={
                    delivery.status === "Completed"
                      ? "success"
                      : delivery.status === "Pending Confirmation"
                      ? "warning"
                      : "info"
                  }
                  size="small"
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />{" "}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HomeIcon color="primary" sx={{ mr: 1.5 }} />
                <Typography variant="body1">{delivery.address}</Typography>
              </Box>
              <Chip
                label={`${delivery.distance}`}
                size="small"
                color="default"
                sx={{ ml: 1 }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PhoneIcon color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="body1">{delivery.phoneNumber}</Typography>
            </Box>{" "}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarIcon color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="body1">
                {formatDate(delivery.date)} • {delivery.time}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DeliveryIcon color="primary" sx={{ mr: 1.5 }} />
                <Typography variant="body1">{delivery.route}</Typography>
              </Box>
              <Chip
                label={`Route ${delivery.routeNumber}`}
                color="secondary"
                variant="outlined"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
        {/* Food Items Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }} variant="outlined">
          <CardContent>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Food Items
            </Typography>

            <List disablePadding>
              {delivery.items.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <FoodIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${item.name} (x${item.quantity})`}
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          Dietary: {item.dietary}
                        </Typography>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
        {/* Special Instructions */}
        {delivery.specialInstructions && (
          <Paper
            sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "info.50" }}
            variant="outlined"
          >
            <Typography variant="subtitle2" fontWeight="bold" color="info.main">
              Special Instructions:
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {delivery.specialInstructions}
            </Typography>
          </Paper>
        )}{" "}
        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: isMobile ? 12 : 2 }}>
          {" "}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<DeliveryIcon />}
            onClick={handleStartDelivery}
            disabled={delivery.status === "Completed"}
          >
            {delivery.status === "Completed" ? "Delivered" : "Start Delivery"}
          </Button>
        </Box>
      </Container>

      {/* Fixed bottom navigation for mobile */}
      {isMobile && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            pb: 1, // Add padding to account for iPhone home bar
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
              onClick={() => navigate("/app/volunteer-dashboard")}
            />
            <BottomNavigationAction
              label="Schedule"
              icon={<ScheduleIcon />}
              onClick={() => navigate("/app/volunteer-schedule")}
            />
            <BottomNavigationAction
              label="Routes"
              icon={<MapIcon />}
              onClick={() => navigate("/app/volunteer-routes")}
            />
            <BottomNavigationAction
              label="Profile"
              icon={<AccountCircleIcon />}
              onClick={() => navigate("/app/volunteer-profile")}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default DeliveryDetails;
