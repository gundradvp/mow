import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormHelperText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  Check as CheckIcon,
  DirectionsCar as CarIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

const VolunteerSchedule = () => {
  const { id } = useParams(); // Volunteer ID from route
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // States
  const [volunteer, setVolunteer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Schedule form state
  const [scheduleData, setScheduleData] = useState({
    volunteerId: id,
    routeId: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "11:00",
    notes: "",
    isConfirmed: false,
  });

  // Fetch volunteer and available routes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch volunteer data
        const volunteerResponse = await axios.get(`/api/Volunteers/${id}`);
        setVolunteer(volunteerResponse.data);

        // Fetch available routes
        const routesResponse = await axios.get("/api/DeliveryRoutes");
        setRoutes(routesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);

        // For development, add mock data
        setVolunteer({
          id: id,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "555-123-4567",
          address: "123 Main Street",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
          isActive: true,
          availability: "Weekdays, Mornings",
          hasDriverLicense: true,
          isWillingToDrive: true,
          profileImage: `https://i.pravatar.cc/150?u=${id}`,
        });

        setRoutes([
          {
            id: 1,
            name: "North Springfield",
            clientCount: 5,
            estimatedDuration: 120,
            mileage: 15,
          },
          {
            id: 2,
            name: "East Springfield",
            clientCount: 7,
            estimatedDuration: 150,
            mileage: 18,
          },
          {
            id: 3,
            name: "South Springfield",
            clientCount: 4,
            estimatedDuration: 90,
            mileage: 12,
          },
          {
            id: 4,
            name: "West Springfield",
            clientCount: 6,
            estimatedDuration: 135,
            mileage: 16,
          },
        ]);

        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setScheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setScheduleData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // Toggle confirmed status
  const toggleConfirmed = () => {
    setScheduleData((prev) => ({
      ...prev,
      isConfirmed: !prev.isConfirmed,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formattedDate = scheduleData.date.toISOString().split("T")[0];
      const payload = {
        ...scheduleData,
        date: formattedDate,
      };

      // Create schedule
      await axios.post("/api/Schedules", payload);
      setSuccess("Volunteer successfully scheduled!");

      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/volunteer/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error creating schedule:", err);
      setError("Failed to create schedule. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle back
  const handleBack = () => {
    navigate(-1);
  };

  // Close alerts
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Find selected route
  const selectedRoute = scheduleData.routeId
    ? routes.find(
        (route) => route.id.toString() === scheduleData.routeId.toString()
      )
    : null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Schedule Volunteer
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>
      )}

      {loading ? (
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
      ) : !volunteer ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Volunteer not found or could not be loaded.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Volunteer summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%", borderRadius: "12px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={volunteer.profileImage}
                  alt={`${volunteer.firstName} ${volunteer.lastName}`}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Typography variant="h6" align="center">
                  {volunteer.firstName} {volunteer.lastName}
                </Typography>
                <Chip
                  label={volunteer.isActive ? "Active" : "Inactive"}
                  color={volunteer.isActive ? "success" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Availability
              </Typography>
              <Typography variant="body2" paragraph>
                {volunteer.availability || "Not specified"}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Transportation
              </Typography>
              <Box sx={{ mb: 2 }}>
                {volunteer.hasDriverLicense && volunteer.isWillingToDrive ? (
                  <Chip
                    icon={<CarIcon fontSize="small" />}
                    label="Can drive"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                ) : (
                  <Chip
                    label="Cannot drive"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
              </Box>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Contact
              </Typography>
              <Typography variant="body2">{volunteer.phoneNumber}</Typography>
              <Typography variant="body2">{volunteer.email}</Typography>
            </Paper>
          </Grid>

          {/* Schedule form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: "12px" }}>
              <Typography variant="h6" gutterBottom>
                Create Delivery Schedule
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Date picker */}
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Delivery Date"
                        value={scheduleData.date}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth required />
                        )}
                        disablePast
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Route selection */}
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      required
                      error={!scheduleData.routeId}
                    >
                      <InputLabel id="route-select-label">
                        Delivery Route
                      </InputLabel>
                      <Select
                        labelId="route-select-label"
                        id="routeId"
                        name="routeId"
                        value={scheduleData.routeId}
                        onChange={handleChange}
                        label="Delivery Route"
                      >
                        {routes.map((route) => (
                          <MenuItem key={route.id} value={route.id}>
                            {route.name} ({route.clientCount} clients)
                          </MenuItem>
                        ))}
                      </Select>
                      {!scheduleData.routeId && (
                        <FormHelperText>
                          Please select a delivery route
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Time slots */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="startTime"
                      name="startTime"
                      label="Start Time"
                      type="time"
                      value={scheduleData.startTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="endTime"
                      name="endTime"
                      label="End Time"
                      type="time"
                      value={scheduleData.endTime}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      required
                    />
                  </Grid>

                  {/* Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="notes"
                      name="notes"
                      label="Notes"
                      multiline
                      rows={3}
                      value={scheduleData.notes}
                      onChange={handleChange}
                      placeholder="Add any special instructions or notes for this delivery"
                    />
                  </Grid>

                  {/* Confirmation status */}
                  <Grid item xs={12}>
                    <Button
                      variant={
                        scheduleData.isConfirmed ? "contained" : "outlined"
                      }
                      color={scheduleData.isConfirmed ? "success" : "primary"}
                      onClick={toggleConfirmed}
                      startIcon={
                        scheduleData.isConfirmed ? <CheckIcon /> : null
                      }
                      sx={{ mb: 2, borderRadius: "8px" }}
                    >
                      {scheduleData.isConfirmed
                        ? "Confirmed with Volunteer"
                        : "Mark as Confirmed"}
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      {scheduleData.isConfirmed
                        ? "The volunteer has confirmed this schedule."
                        : "Schedule is pending confirmation from the volunteer."}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Selected route details */}
                {selectedRoute && (
                  <Card
                    sx={{
                      mt: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "8px",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Route Details
                      </Typography>

                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <LocationIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={selectedRoute.name}
                            secondary="Route Name"
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <GroupIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${selectedRoute.clientCount} clients`}
                            secondary="Number of clients to serve"
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <AccessTimeIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${selectedRoute.estimatedDuration} minutes`}
                            secondary="Estimated delivery time"
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <CarIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${selectedRoute.mileage} miles`}
                            secondary="Approximate route distance"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Form actions */}
                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ mr: 2, borderRadius: "8px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!scheduleData.routeId || submitting}
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: "8px" }}
                  >
                    {submitting ? "Scheduling..." : "Schedule Volunteer"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default VolunteerSchedule;
