import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useMediaQuery,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Map as MapIcon,
  DirectionsCar as DirectionsCarIcon,
  MyLocation as MyLocationIcon,
  Navigation as NavigationIcon,
  Place as PlaceIcon,
  PinDrop as PinDropIcon,
  LocalShipping as LocalShippingIcon,
  TwoWheeler as ScooterIcon,
  FiberManualRecord as DotIcon,
  Restaurant as FoodIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  AccountCircle as AccountCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import DriverLoadingSheet from "../components/Driver/DriverLoadingSheet";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

// In a real application, we would use an actual map library like Google Maps, Mapbox, or Leaflet
// For this demo, we'll create a simulated map with SVG components
const RouteMapSimulation = ({
  route,
  isMobile,
  selectedStop,
  onSelectStop,
}) => {
  const mapContainerRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (mapContainerRef.current) {
      setMapDimensions({
        width: mapContainerRef.current.clientWidth,
        height: isMobile ? 220 : 300,
      });
    }
  }, [mapContainerRef, isMobile]);

  // Mock coordinates for our points - with adjusted positions to match image
  const points = [
    // Starting point (MOW Distribution Center)
    { x: 50, y: 150, type: "start", label: "Start", number: 0 },

    // Delivery stops (1-4) - spaced around to simulate a route
    { x: 130, y: 100, type: "stop", label: "Stop 1", number: 1 },
    { x: 200, y: 180, type: "stop", label: "Stop 2", number: 2 },
    { x: 280, y: 80, type: "stop", label: "Stop 3", number: 3 },
    { x: 350, y: 170, type: "stop", label: "Stop 4", number: 4 },
  ];

  // Create the path for our route
  const generatePathD = () => {
    return points
      .map((point, index) => {
        return index === 0
          ? `M ${point.x} ${point.y}`
          : `L ${point.x} ${point.y}`;
      })
      .join(" ");
  };

  const getPointColor = (type, isSelected) => {
    if (isSelected) return "#ff9800"; // Orange for selected point
    switch (type) {
      case "start":
        return "#4CAF50"; // Green
      case "stop":
        return "#2196F3"; // Blue
      default:
        return "#2196F3"; // Blue default
    }
  };

  return (
    <Box
      ref={mapContainerRef}
      sx={{
        width: "100%",
        height: isMobile ? 220 : 300,
        position: "relative",
        bgcolor: "#f0f4f8",
        overflow: "hidden",
      }}
    >
      {/* Simulated map background */}
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
        {/* Road network simulation */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", zIndex: 2 }}
        >
          {/* Main roads */}
          <line
            x1="0"
            y1="150"
            x2="500"
            y2="150"
            stroke="#d1d1d1"
            strokeWidth="14"
          />
          <line
            x1="120"
            y1="0"
            x2="120"
            y2="300"
            stroke="#d1d1d1"
            strokeWidth="10"
          />
          <line
            x1="200"
            y1="0"
            x2="200"
            y2="300"
            stroke="#d1d1d1"
            strokeWidth="10"
          />
          <line
            x1="280"
            y1="0"
            x2="280"
            y2="300"
            stroke="#d1d1d1"
            strokeWidth="10"
          />
          <line
            x1="350"
            y1="0"
            x2="350"
            y2="300"
            stroke="#d1d1d1"
            strokeWidth="10"
          />

          {/* Secondary roads */}
          <line
            x1="0"
            y1="80"
            x2="500"
            y2="80"
            stroke="#e0e0e0"
            strokeWidth="6"
          />
          <line
            x1="0"
            y1="180"
            x2="500"
            y2="180"
            stroke="#e0e0e0"
            strokeWidth="6"
          />

          {/* Route path - optimized delivery route */}
          <path
            d={generatePathD()}
            fill="none"
            stroke="#3498db"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Add a simulated vehicle at the start - scooter icon as in the image */}
          <g transform={`translate(${points[0].x}, ${points[0].y})`}>
            <circle r="10" fill="#4CAF50" />
            <path
              transform="translate(-8, -8) scale(0.8)"
              d="M17 4.5h-9L8 9h9l-.4-1.8L17 4.5m-7.3 6c-.8 0-1.5-.7-1.5-1.5S8.9 7.5 9.7 7.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5m7.3-1.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5M6 6.5V9h1.5V6.5H6m11.94 9.24s-1.13 3.67-4.44 2.58c-.91-.3-1.08-1.78-.56-2.38.52-.6 4.9-2.98 4.9-2.98l.52-.44-.52-2.05L16 6.5h-1.72L12.4 10H8.76L7.32 6.5H5v2.67L7.88 15h.82s2.02 0 2.02 2v3h2v-3c0-.7.15-1.26.39-1.73.12-.23.79-1.22 4.83-2.53m1.93-5.3l-.4 2.5h2.53v-2.5h-2.13Z"
              fill="#ffffff"
            />
          </g>

          {/* Draw all the stops on the route */}
          {points
            .filter((p) => p.type === "stop")
            .map((point, index) => {
              const isSelected = selectedStop === point.number;
              return (
                <g
                  key={index}
                  transform={`translate(${point.x}, ${point.y})`}
                  onClick={() => onSelectStop(point.number)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Circle background */}
                  <circle
                    r={isSelected ? 14 : 12}
                    fill={getPointColor(point.type, isSelected)}
                  />
                  {/* Number text */}
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {point.number}
                  </text>
                  {/* Pulse effect for selected stop */}
                  {isSelected && (
                    <circle
                      r="18"
                      fill="none"
                      stroke={getPointColor(point.type, true)}
                      strokeWidth="2"
                      opacity="0.6"
                    >
                      <animate
                        attributeName="r"
                        from="14"
                        to="22"
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
                  )}
                </g>
              );
            })}
        </svg>
      </Box>
    </Box>
  );
};

const OrderProgressTracker = ({ totalStops, currentStop, onSelectStop }) => {
  return (
    <Box sx={{ width: "100%", my: 1, px: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {Array.from({ length: totalStops }).map((_, index) => {
          const stopNumber = index + 1;
          const isActive = stopNumber <= totalStops;
          const isCurrent = stopNumber === currentStop;

          return (
            <Box
              key={index}
              onClick={() => isActive && onSelectStop(stopNumber)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: isCurrent
                  ? "primary.main"
                  : isActive
                  ? "grey.300"
                  : "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isActive ? "pointer" : "default",
                color: isCurrent ? "white" : "text.primary",
                border: isCurrent ? "2px solid #3498db" : "none",
              }}
            >
              {isActive ? (
                stopNumber
              ) : (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "grey.400",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
      <LinearProgress
        variant="determinate"
        value={(currentStop / totalStops) * 100}
      />
    </Box>
  );
};

const RouteMap = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [navValue, setNavValue] = useState(2); // Set to "Routes" tab by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedStop, setSelectedStop] = useState(1);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loadingSheetOpen, setLoadingSheetOpen] = useState(false);
  const [routeLoadingStatus, setRouteLoadingStatus] = useState("Not Started");
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    // In a real application, you would fetch data from an API
    // Here we'll simulate loading with mock data
    const loadData = async () => {
      try {
        setLoading(true);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock delivery data - array of orders for the route
        const mockDeliveries = [
          {
            id: "ST7890QR12",
            stopNumber: 1,
            date: "2025-05-10",
            time: "9:00 AM - 11:00 AM",
            route: "North Springfield",
            recipientName: "Aman Sharma",
            address: "201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069",
            distance: "5 km",
            status: "Yet to Start",
            items: [
              { name: "Caramel Macchiato", quantity: 1 },
              { name: "Egg Mayo Breakfast Sandwich", quantity: 2 },
            ],
          },
          {
            id: "ST7890QR13",
            stopNumber: 2,
            date: "2025-05-10",
            time: "11:30 AM - 1:30 PM",
            route: "East Springfield",
            recipientName: "Sarah Johnson",
            address: "42 Oak Street, Apartment 7B, Springfield, IL 62704",
            distance: "3.2 km",
            status: "Yet to Start",
            items: [
              { name: "Vegetable Soup", quantity: 1 },
              { name: "Grilled Chicken Sandwich", quantity: 1 },
              { name: "Fresh Fruit Cup", quantity: 1 },
            ],
          },
          {
            id: "ST7890QR14",
            stopNumber: 3,
            date: "2025-05-11",
            time: "10:00 AM - 12:00 PM",
            route: "West Springfield",
            recipientName: "Robert Miller",
            address: "157 Pine Avenue, Springfield, IL 62701",
            distance: "4.5 km",
            status: "Yet to Start",
            items: [
              { name: "Turkey & Swiss Sandwich", quantity: 1 },
              { name: "Garden Salad", quantity: 1 },
              { name: "Apple Juice", quantity: 1 },
            ],
          },
          {
            id: "ST7890QR15",
            stopNumber: 4,
            date: "2025-05-11",
            time: "1:00 PM - 3:00 PM",
            route: "South Springfield",
            recipientName: "Maria Garcia",
            address: "789 Willow Street, Springfield, IL 62703",
            distance: "6.1 km",
            status: "Yet to Start",
            items: [
              { name: "Chicken Noodle Soup", quantity: 1 },
              { name: "Caesar Salad", quantity: 1 },
              { name: "Chocolate Chip Cookie", quantity: 2 },
            ],
          },
        ];

        setDeliveries(mockDeliveries);

        // Set the initial selected order          // For "all" route, show all stops and start with the first one
        const initialStop = deliveryId === "all" ? 1 : parseInt(deliveryId, 10);
        const selectedDelivery =
          mockDeliveries.find((d) => d.stopNumber === initialStop) ||
          mockDeliveries[0];
        setSelectedStop(selectedDelivery.stopNumber);
        setCurrentOrder(selectedDelivery);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching route data:", error);
        setError("Failed to load route map. Please try again.");
        setLoading(false);
      }
    };

    loadData();
  }, [deliveryId]);
  const handleBack = () => {
    navigate(-1);
  };

  const handleStartNavigation = () => {
    navigate(`/app/delivery-navigation/${deliveryId}`);
  };

  const handleOpenLoadingSheet = () => {
    setLoadingSheetOpen(true);
  };

  const handleCloseLoadingSheet = () => {
    setLoadingSheetOpen(false);
  };

  const handleLoadStatusChange = (status, percentage) => {
    setRouteLoadingStatus(status);
    setLoadingPercentage(percentage);
  };
  // Check if this is a specific route that should bypass the loading process
  const shouldSkipLoadingProcess = () => {
    // We're skipping the loading process entirely
    return true;
  };

  const handleSelectStop = (stopNumber) => {
    if (stopNumber <= deliveries.length) {
      const selectedDelivery = deliveries.find(
        (d) => d.stopNumber === stopNumber
      );
      setSelectedStop(stopNumber);
      setCurrentOrder(selectedDelivery);
    }
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
    <Box sx={{ pb: 4 }}>
      {/* App Bar */}
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Route Map
          </Typography>
          <IconButton color="inherit" onClick={handleStartNavigation}>
            <NavigationIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* Map Visualization */}
      <Box sx={{ bgcolor: "#f0f4f8", pt: 0, pb: 1 }}>
        <RouteMapSimulation
          route={{ stops: deliveries }}
          isMobile={isMobile}
          selectedStop={selectedStop}
          onSelectStop={handleSelectStop}
        />
      </Box>
      {/* Order Progress Tracker */}
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        <OrderProgressTracker
          totalStops={deliveries.length}
          currentStop={selectedStop}
          onSelectStop={handleSelectStop}
        />
      </Container>
      {/* Current Order Card */}
      {currentOrder && (
        <Container maxWidth="lg">
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID: {currentOrder.id}
                </Typography>
                <Chip
                  label={currentOrder.status}
                  size="small"
                  color={
                    currentOrder.status.toLowerCase() === "yet to start"
                      ? "warning"
                      : "primary"
                  }
                  sx={{ fontWeight: "medium" }}
                />
              </Box>

              <Typography variant="subtitle1" fontWeight="medium">
                {currentOrder.recipientName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 0.5,
                  mt: 1,
                }}
              >
                <PlaceIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Delivery Distance: {currentOrder.distance}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 0.5 }}>
                <HomeIcon
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 1, mt: 0.5 }}
                />
                <Typography variant="body2">{currentOrder.address}</Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="medium">
                  Food Items:
                </Typography>
                {currentOrder.items.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", pl: 1 }}>
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
            </CardContent>{" "}
          </Card>{" "}
          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 3, mb: isMobile ? 12 : 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleStartNavigation}
              sx={{
                py: 1.2,
                borderRadius: 1,
                fontSize: "1rem",
                textTransform: "none",
                flex: 1,
                bgcolor: "primary.main", // Ensure primary color
                color: "white", // White text
                "&:hover": {
                  bgcolor: "primary.dark", // Darker shade on hover
                },
              }}
            >
              Start Navigation
            </Button>
          </Box>
        </Container>
      )}{" "}      {/* Loading Sheet Dialog removed since we're using direct navigation */}
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

export default RouteMap;
