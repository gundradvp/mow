import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  Avatar,
  Chip,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EventNote as EventNoteIcon,
  AssignmentTurnedIn as AssignmentIcon,
} from "@mui/icons-material";
import axios from "axios";

// TabPanel component for the volunteer detail tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`volunteer-tabpanel-${index}`}
      aria-labelledby={`volunteer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const VolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    // Fetch volunteer details
    setLoading(true);
    axios
      .get(`/api/Volunteers/${id}`)
      .then((response) => {
        // Enrich data with some defaults if needed
        const enrichedData = {
          ...response.data,
          firstName: response.data.firstName || "First",
          lastName: response.data.lastName || "Last",
          email: response.data.email || "email@example.com",
          phone: response.data.phoneNumber || "555-123-4567",
          address: response.data.address || "Local Area",
          city: response.data.city || "City",
          state: response.data.state || "State",
          zip: response.data.zipCode || "12345",
          status: response.data.isActive ? "Active" : "Inactive",
          since: response.data.createdAt
            ? new Date(response.data.createdAt).toLocaleDateString()
            : "Unknown",
          availability: response.data.availability || "Flexible availability",
          profileImage: `https://i.pravatar.cc/300?u=${id}`, // Random avatar based on id
        };
        setVolunteer(enrichedData);
        setLoading(false);

        // Fetch volunteer schedules
        return axios.get(`/api/Schedules/volunteer/${id}`);
      })
      .then((response) => {
        if (response?.data) {
          setSchedules(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching volunteer details:", error);
        setLoading(false);

        // For development/demo purposes, create mock data
        const mockVolunteer = {
          id,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          address: "123 Main Street",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          status: "Active",
          since: "Jan 15, 2023",
          availability: "Weekdays, Mornings",
          skills: "Driving, Cooking, Administration",
          emergencyContact: "Jane Doe (555-987-6543)",
          profileImage: `https://i.pravatar.cc/300?u=${id}`,
          background: {
            checkCompleted: true,
            checkDate: "2023-01-10",
            notes: "All background checks completed successfully",
          },
          training: {
            completed: true,
            date: "2023-01-12",
            type: "Full orientation and safety training",
          },
          preferences:
            "Prefers delivery routes in north side of town. Cannot lift more than 20 pounds.",
        };
        setVolunteer(mockVolunteer);

        // Mock schedules
        setSchedules([
          {
            id: 1,
            date: "2025-05-10",
            time: "9:00 AM - 11:00 AM",
            route: "North Springfield",
            status: "Confirmed",
            clients: 5,
          },
          {
            id: 2,
            date: "2025-05-17",
            time: "9:00 AM - 11:00 AM",
            route: "East Springfield",
            status: "Confirmed",
            clients: 6,
          },
          {
            id: 3,
            date: "2025-05-24",
            time: "9:00 AM - 11:00 AM",
            route: "South Springfield",
            status: "Tentative",
            clients: 4,
          },
        ]);
      });
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    navigate(`/volunteer/edit/${id}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleScheduleClick = () => {
    navigate(`/schedule/volunteer/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!volunteer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Volunteer not found or an error occurred.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mt: 2 }}
          >
            Back to Volunteers
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Volunteer Profile
        </Typography>
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Left column - Volunteer info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={volunteer.profileImage}
                alt={`${volunteer.firstName} ${volunteer.lastName}`}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {volunteer.firstName} {volunteer.lastName}
              </Typography>
              <Chip
                label={volunteer.status}
                size="small"
                color={volunteer.status === "Active" ? "success" : "default"}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Volunteer since {volunteer.since}
              </Typography>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{ mt: 2 }}
                size="small"
              >
                Edit Profile
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Contact information */}
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <List dense disablePadding>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={volunteer.phone} />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={volunteer.email} />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LocationIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={volunteer.address}
                  secondary={`${volunteer.city}, ${volunteer.state} ${volunteer.zip}`}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CalendarIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={volunteer.availability} />
              </ListItem>

              {volunteer.emergencyContact && (
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Emergency Contact"
                    secondary={volunteer.emergencyContact}
                  />
                </ListItem>
              )}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Skills */}
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {volunteer.skills?.split(",").map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.trim()}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<ScheduleIcon />}
                onClick={handleScheduleClick}
              >
                Schedule Volunteer
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right column - Tabs with additional info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="volunteer details tabs"
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
              >
                <Tab
                  label="Upcoming Schedule"
                  icon={<ScheduleIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="History"
                  icon={<HistoryIcon />}
                  iconPosition="start"
                />
                <Tab
                  label="Background"
                  icon={<AssignmentIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Schedule Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Upcoming Deliveries
              </Typography>

              {schedules.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No upcoming deliveries scheduled.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    onClick={handleScheduleClick}
                    sx={{ mt: 2 }}
                  >
                    Schedule Now
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {schedules.map((schedule) => (
                    <Grid item xs={12} sm={6} key={schedule.id}>
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1">
                              {new Date(schedule.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                            <Chip
                              label={schedule.status}
                              size="small"
                              color={
                                schedule.status === "Confirmed"
                                  ? "success"
                                  : "warning"
                              }
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <CalendarIcon
                              fontSize="small"
                              sx={{ color: "text.secondary", mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {schedule.time}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <LocationIcon
                              fontSize="small"
                              sx={{ color: "text.secondary", mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {schedule.route}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {schedule.clients} clients on this route
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Volunteer History
              </Typography>

              {/* Activity history would go here - for now, show placeholder */}
              <Box sx={{ py: 2 }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Route Completed: North Springfield"
                      secondary="April 24, 2025 - 6 clients served"
                    />
                  </ListItem>
                  <Divider component="li" />

                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Route Completed: West Springfield"
                      secondary="April 17, 2025 - 5 clients served"
                    />
                  </ListItem>
                  <Divider component="li" />

                  <ListItem>
                    <ListItemIcon>
                      <CancelIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Delivery Cancelled"
                      secondary="April 10, 2025 - Personal emergency"
                    />
                  </ListItem>
                  <Divider component="li" />

                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Route Completed: South Springfield"
                      secondary="April 3, 2025 - 7 clients served"
                    />
                  </ListItem>
                </List>
              </Box>
            </TabPanel>

            {/* Background Tab */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                {/* Background Check */}
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Background Check
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        {volunteer.background?.checkCompleted ? (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <CancelIcon color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography>
                          {volunteer.background?.checkCompleted
                            ? "Completed"
                            : "Not Completed"}
                        </Typography>
                      </Box>

                      {volunteer.background?.checkDate && (
                        <Typography variant="body2" color="text.secondary">
                          Date:{" "}
                          {new Date(
                            volunteer.background.checkDate
                          ).toLocaleDateString()}
                        </Typography>
                      )}

                      {volunteer.background?.notes && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          {volunteer.background.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Training */}
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Training
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        {volunteer.training?.completed ? (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <CancelIcon color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography>
                          {volunteer.training?.completed
                            ? "Completed"
                            : "Not Completed"}
                        </Typography>
                      </Box>

                      {volunteer.training?.date && (
                        <Typography variant="body2" color="text.secondary">
                          Date:{" "}
                          {new Date(
                            volunteer.training.date
                          ).toLocaleDateString()}
                        </Typography>
                      )}

                      {volunteer.training?.type && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          {volunteer.training.type}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Preferences */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Preferences & Notes
                      </Typography>

                      <Typography variant="body1">
                        {volunteer.preferences ||
                          "No specific preferences recorded."}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VolunteerDetail;
