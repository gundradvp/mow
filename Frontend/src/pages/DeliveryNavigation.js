import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CircularProgress,
  Alert,
  useMediaQuery,
  Divider,
  Avatar,
  Grid,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as TruckIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  AccessTime as TimeIcon,
  Store as StoreIcon,
  Home as HomeIcon,
  TwoWheeler as ScooterIcon,
  WarningAmber as WarningIcon,
  Schedule as ScheduleIcon,
  Map as MapIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

// In a real application, we would use an actual map library like Google Maps, Mapbox, or Leaflet
// For this demo, we'll create a simulated map with SVG components
const LiveRouteMap = ({ origin, destination }) => {
  const mapContainerRef = useRef(null);

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: "100%",
        height: 220,
        position: "relative",
        bgcolor: "#f0f4f8",
        overflow: "hidden",
      }}
    >
      {/* Map background with simulated roads */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 50 0 L 0 0 0 50' fill='none' stroke='%23e0e0e0' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23f8f9fa'/%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E\")",
          zIndex: 1,
        }}
      >
        {/* Road network and route simulation */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", zIndex: 2 }}
        >
          {/* Main roads */}
          <line
            x1="0"
            y1="90"
            x2="400"
            y2="90"
            stroke="#d1d1d1"
            strokeWidth="14"
          />
          <line
            x1="0"
            y1="180"
            x2="400"
            y2="180"
            stroke="#d1d1d1"
            strokeWidth="14"
          />
          <line
            x1="80"
            y1="0"
            x2="80"
            y2="220"
            stroke="#d1d1d1"
            strokeWidth="10"
          />
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="220"
            stroke="#d1d1d1"
            strokeWidth="10"
          />
          <line
            x1="320"
            y1="0"
            x2="320"
            y2="220"
            stroke="#d1d1d1"
            strokeWidth="10"
          />

          {/* The route path - green line */}
          <path
            d="M 80 90 L 200 90 L 200 180 L 320 180"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Store icon - origin */}
          <g transform={`translate(80, 90)`}>
            <circle r="12" fill="#3498db" />
            <path
              transform="translate(-8, -8) scale(0.8)"
              d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"
              fill="#ffffff"
            />
          </g>

          {/* Scooter icon - current position */}
          <g transform={`translate(200, 135)`}>
            <circle r="12" fill="#4CAF50" />
            <path
              transform="translate(-8, -8) scale(0.8)"
              d="M17 4.5h-9L8 9h9l-.4-1.8L17 4.5m-7.3 6c-.8 0-1.5-.7-1.5-1.5S8.9 7.5 9.7 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5m7.3-1.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5M6 6.5V9h1.5V6.5H6m11.94 9.24s-1.13 3.67-4.44 2.58c-.91-.3-1.08-1.78-.56-2.38.52-.6 4.9-2.98 4.9-2.98l.52-.44-.52-2.05L16 6.5h-1.72L12.4 10H8.76L7.32 6.5H5v2.67L7.88 15h.82s2.02 0 2.02 2v3h2v-3c0-.7.15-1.26.39-1.73.12-.23.79-1.22 4.83-2.53m1.93-5.3l-.4 2.5h2.53v-2.5h-2.13Z"
              fill="#ffffff"
            />
            {/* Pulsing effect around current position */}
            <circle
              r="16"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="2"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                from="12"
                to="20"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* House icon - destination */}
          <g transform={`translate(320, 180)`}>
            <circle r="12" fill="#F44336" />
            <path
              transform="translate(-8, -8) scale(0.8)"
              d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
              fill="#ffffff"
            />
          </g>
        </svg>
      </Box>
    </Box>
  );
};

const DeliveryNavigation = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [navValue, setNavValue] = useState(2); // Set to "Routes" tab by default

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [eta, setEta] = useState("10:23 AM");
  const [driverInfo, setDriverInfo] = useState({
    name: "Aleksandr V.",
    phone: "+91XXXXXX93033",
    imageUrl: "https://i.pravatar.cc/150?img=65",
  });

  useEffect(() => {
    // In a real application, you would fetch real-time data from an API
    const loadData = async () => {
      try {
        setLoading(true);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock delivery data
        const mockDelivery = {
          id: deliveryId || "ST7890QR12",
          status: "In Progress",
          pickupAddress: "88 Zurab Gorgiladze St, Georgia, Batumi",
          deliveryAddress: "5 Noe Zhordania St, Georgia, Batumi",
          distance: "5 km",
          eta: "10:23 AM",
          recipientName: "Aman Sharma",
        };

        setDelivery(mockDelivery);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        setError("Failed to load delivery information. Please try again.");
        setLoading(false);
      }
    };

    loadData();

    // In a real app, you might set up a location tracking interval here
    const trackingInterval = setInterval(() => {
      // Update ETA based on real-time location in a real app
    }, 30000);

    return () => clearInterval(trackingInterval);
  }, [deliveryId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCallDriver = () => {
    // In a real app, this would make a phone call
    alert(`Calling driver: ${driverInfo.phone}`);
  };

  const handleMessageDriver = () => {
    // In a real app, this would open a messaging interface
    alert(`Messaging driver: ${driverInfo.phone}`);
  };

  const handleNoResponse = () => {
    // Navigate to the incident report page with the current delivery ID
    navigate(`/incident-report/${deliveryId}`);
  };

  const handleProceedToCheckout = () => {
    // Navigate to the QR code scanning page with the current delivery ID
    navigate(`/scan-qr-code/${deliveryId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
        <Button
          variant="contained"
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
    <Box sx={{ pb: 2 }}>
      {/* Header with Order ID */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TruckIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Order ID: {delivery.id}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Live Map */}
      <LiveRouteMap
        origin={delivery.pickupAddress}
        destination={delivery.deliveryAddress}
      />

      {/* Delivery Driver Information */}
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Driver info and contact */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={driverInfo.imageUrl}
              alt={driverInfo.name}
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {driverInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {driverInfo.phone}
              </Typography>
            </Box>
          </Box>

          {/* Contact buttons */}
          <Box>
            <IconButton
              color="primary"
              onClick={handleCallDriver}
              sx={{ bgcolor: "rgba(25, 118, 210, 0.1)", mr: 1 }}
            >
              <PhoneIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={handleMessageDriver}
              sx={{ bgcolor: "rgba(25, 118, 210, 0.1)" }}
            >
              <MessageIcon />
            </IconButton>
          </Box>
        </Box>
        {/* ETA */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TimeIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="medium">
            ETA: {delivery.eta}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* Addresses */}
        <Box sx={{ mb: 2 }}>
          {/* Origin */}
          <Box sx={{ display: "flex", mb: 2 }}>
            <Box sx={{ mr: 2, mt: 0.5 }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                A
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current Location
              </Typography>
              <Typography variant="body1">{delivery.pickupAddress}</Typography>
            </Box>
          </Box>

          {/* Destination */}
          <Box sx={{ display: "flex" }}>
            <Box sx={{ mr: 2, mt: 0.5 }}>
              <Box
                sx={{
                  bgcolor: "error.main",
                  color: "white",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                B
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Delivery Address
              </Typography>
              <Typography variant="body1">
                {delivery.deliveryAddress}
              </Typography>
            </Box>
          </Box>
        </Box>{" "}
        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 4, mb: isMobile ? 12 : 2 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              color="warning"
              startIcon={<WarningIcon />}
              onClick={handleNoResponse}
              sx={{ py: 1.2 }}
            >
              No Response
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              color="success"
              onClick={handleProceedToCheckout}
              sx={{ py: 1.2 }}
            >
              Proceed to Checkout
            </Button>
          </Grid>
        </Grid>
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
              onClick={() => navigate("/volunteer-dashboard")}
            />
            <BottomNavigationAction
              label="Schedule"
              icon={<ScheduleIcon />}
              onClick={() => navigate("/volunteer-schedule")}
            />
            <BottomNavigationAction
              label="Routes"
              icon={<MapIcon />}
              onClick={() => navigate("/volunteer-routes")}
            />
            <BottomNavigationAction
              label="Profile"
              icon={<AccountCircleIcon />}
              onClick={() => navigate("/volunteer-profile")}
            />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default DeliveryNavigation;
