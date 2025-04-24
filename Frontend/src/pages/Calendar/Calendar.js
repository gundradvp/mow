import React, { useState, useEffect, useContext } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

// MUI components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Calendar() {
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    volunteerId: "",
    routeId: "",
    shiftType: "Morning", // Default value
  });

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be API calls to your backend
        // For now, we'll simulate the data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for schedule events
        const mockSchedules = [
          {
            id: 1,
            title: "Route A - John Doe",
            start: new Date(2025, 3, 25, 9, 0), // April 25, 2025 at 9:00 AM
            end: new Date(2025, 3, 25, 11, 0),
            volunteerId: 1,
            routeId: 1,
            shiftType: "Morning",
          },
          {
            id: 2,
            title: "Route B - Jane Smith",
            start: new Date(2025, 3, 26, 9, 0), // April 26, 2025 at 9:00 AM
            end: new Date(2025, 3, 26, 11, 0),
            volunteerId: 2,
            routeId: 2,
            shiftType: "Morning",
          },
          {
            id: 3,
            title: "Route C - Mike Johnson",
            start: new Date(2025, 3, 24, 14, 0), // April 24, 2025 at 2:00 PM
            end: new Date(2025, 3, 24, 16, 0),
            volunteerId: 3,
            routeId: 3,
            shiftType: "Afternoon",
          },
        ];

        // Mock data for volunteers and routes
        const mockVolunteers = [
          { id: 1, name: "John Doe" },
          { id: 2, name: "Jane Smith" },
          { id: 3, name: "Mike Johnson" },
          { id: 4, name: "Sarah Wilson" },
        ];

        const mockRoutes = [
          { id: 1, name: "Route A" },
          { id: 2, name: "Route B" },
          { id: 3, name: "Route C" },
          { id: 4, name: "Route D" },
        ];

        setEvents(mockSchedules);
        setVolunteers(mockVolunteers);
        setRoutes(mockRoutes);
      } catch (err) {
        console.error("Error fetching calendar data:", err);
        setError("Failed to load calendar data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    if (currentUser.role === "Admin" || currentUser.role === "Coordinator") {
      setNewEvent({
        title: "",
        start,
        end,
        volunteerId: "",
        routeId: "",
        shiftType: start.getHours() < 12 ? "Morning" : "Afternoon",
      });
      setSelectedEvent(null);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      volunteerId: "",
      routeId: "",
      shiftType: "Morning",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setNewEvent({ ...newEvent, [name]: date });
  };

  const handleSaveEvent = async () => {
    try {
      // Validate required fields
      if (!newEvent.volunteerId || !newEvent.routeId) {
        alert("Please select both a volunteer and a route.");
        return;
      }

      const volunteer = volunteers.find(
        (v) => v.id === parseInt(newEvent.volunteerId)
      );
      const route = routes.find((r) => r.id === parseInt(newEvent.routeId));

      if (!volunteer || !route) {
        alert("Invalid volunteer or route selection.");
        return;
      }

      const eventToSave = {
        ...newEvent,
        title: `${route.name} - ${volunteer.name}`,
      };

      if (selectedEvent) {
        // Update existing event
        const updatedEvents = events.map((e) =>
          e.id === selectedEvent.id
            ? { ...eventToSave, id: selectedEvent.id }
            : e
        );
        setEvents(updatedEvents);
        // In a real app, you would make an API call to update the event
      } else {
        // Add new event
        const newId = Math.max(...events.map((e) => e.id), 0) + 1;
        setEvents([...events, { ...eventToSave, id: newId }]);
        // In a real app, you would make an API call to create a new event
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Failed to save the event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      // Filter out the selected event
      const updatedEvents = events.filter((e) => e.id !== selectedEvent.id);
      setEvents(updatedEvents);
      // In a real app, you would make an API call to delete the event

      handleCloseDialog();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete the event. Please try again.");
    }
  };

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

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Delivery Schedule Calendar
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {currentUser.role === "Admin" || currentUser.role === "Coordinator"
              ? "Click on a time slot to schedule a new delivery. Click on an existing event to edit or delete it."
              : "This calendar shows all scheduled deliveries. Your assigned deliveries will be highlighted."}
          </Typography>
        </CardContent>
      </Card>
      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable={
            currentUser.role === "Admin" || currentUser.role === "Coordinator"
          }
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          views={["month", "week", "day", "agenda"]}
          defaultView="week"
          defaultDate={new Date()}
          style={{ height: 600 }}
          eventPropGetter={(event) => {
            // Customize event styles based on shift type
            if (event.shiftType === "Morning") {
              return { style: { backgroundColor: "#2196F3" } }; // Blue for morning
            } else {
              return { style: { backgroundColor: "#4CAF50" } }; // Green for afternoon
            }
          }}
        />
      </div>

      {/* Dialog for Adding/Editing Events */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedEvent ? "Edit Delivery Schedule" : "Add Delivery Schedule"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={newEvent.start}
                    onChange={(date) => {
                      const newStart = new Date(date);
                      newStart.setHours(newEvent.start.getHours());
                      newStart.setMinutes(newEvent.start.getMinutes());

                      const newEnd = new Date(date);
                      newEnd.setHours(newEvent.end.getHours());
                      newEnd.setMinutes(newEvent.end.getMinutes());

                      setNewEvent({
                        ...newEvent,
                        start: newStart,
                        end: newEnd,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Shift Type</InputLabel>
                  <Select
                    name="shiftType"
                    value={newEvent.shiftType}
                    onChange={handleInputChange}
                    label="Shift Type"
                  >
                    <MenuItem value="Morning">
                      Morning (9:00 AM - 11:00 AM)
                    </MenuItem>
                    <MenuItem value="Afternoon">
                      Afternoon (2:00 PM - 4:00 PM)
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Volunteer</InputLabel>
                  <Select
                    name="volunteerId"
                    value={newEvent.volunteerId}
                    onChange={handleInputChange}
                    label="Volunteer"
                  >
                    {volunteers.map((volunteer) => (
                      <MenuItem key={volunteer.id} value={volunteer.id}>
                        {volunteer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Route</InputLabel>
                  <Select
                    name="routeId"
                    value={newEvent.routeId}
                    onChange={handleInputChange}
                    label="Route"
                  >
                    {routes.map((route) => (
                      <MenuItem key={route.id} value={route.id}>
                        {route.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button onClick={handleDeleteEvent} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calendar;
