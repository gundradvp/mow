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

// Helper function to combine date and shift time
const combineDateAndTime = (date, shiftType, isEnd = false) => {
  const resultDate = new Date(date); // Ensure it's a Date object
  resultDate.setHours(0, 0, 0, 0); // Reset time part first

  if (shiftType === "Morning") {
    resultDate.setHours(isEnd ? 11 : 9, 0, 0, 0); // 9 AM - 11 AM
  } else if (shiftType === "Afternoon") {
    resultDate.setHours(isEnd ? 16 : 14, 0, 0, 0); // 2 PM - 4 PM
  }
  return resultDate;
};

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
    id: null,
    scheduleDate: new Date(),
    volunteerId: "",
    routeId: "",
    shiftType: "Morning",
  });

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError("");

      const [schedulesRes, volunteersRes, routesRes] = await Promise.all([
        axios.get("/api/schedules"),
        axios.get("/api/volunteers"),
        axios.get("/api/deliveryroutes"),
      ]);

      setVolunteers(volunteersRes.data.filter((v) => v.isActive));
      setRoutes(routesRes.data.filter((r) => r.isActive));

      const formattedEvents = schedulesRes.data.map((schedule) => {
        const scheduleDate = new Date(schedule.scheduleDate);
        return {
          id: schedule.id,
          title: `${schedule.routeName || "Unknown Route"} - ${
            schedule.volunteerName || "Unknown Volunteer"
          }`,
          start: combineDateAndTime(scheduleDate, schedule.shiftType, false),
          end: combineDateAndTime(scheduleDate, schedule.shiftType, true),
          volunteerId: schedule.volunteerId,
          routeId: schedule.routeId,
          shiftType: schedule.shiftType,
          scheduleDate: scheduleDate,
        };
      });

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching calendar data:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load calendar data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      id: event.id,
      scheduleDate: event.scheduleDate || event.start,
      volunteerId: event.volunteerId || "",
      routeId: event.routeId || "",
      shiftType: event.shiftType || "Morning",
    });
    setOpenDialog(true);
    setError("");
  };

  const handleSelectSlot = ({ start }) => {
    if (currentUser.role === "Admin" || currentUser.role === "Coordinator") {
      setSelectedEvent(null);
      setNewEvent({
        id: null,
        scheduleDate: start,
        volunteerId: "",
        routeId: "",
        shiftType: start.getHours() < 12 ? "Morning" : "Afternoon",
      });
      setOpenDialog(true);
      setError("");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setNewEvent({
      id: null,
      scheduleDate: new Date(),
      volunteerId: "",
      routeId: "",
      shiftType: "Morning",
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleDateChange = (date) => {
    if (date) {
      const cleanDate = new Date(date);
      cleanDate.setHours(0, 0, 0, 0);
      setNewEvent({ ...newEvent, scheduleDate: cleanDate });
    }
  };

  const handleSaveEvent = async () => {
    if (
      !newEvent.volunteerId ||
      !newEvent.routeId ||
      !newEvent.scheduleDate ||
      !newEvent.shiftType
    ) {
      alert("Please select a date, shift type, volunteer, and route.");
      return;
    }

    const scheduleData = {
      scheduleDate: newEvent.scheduleDate,
      shiftType: newEvent.shiftType,
      volunteerId: parseInt(newEvent.volunteerId, 10),
      routeId: parseInt(newEvent.routeId, 10),
    };

    try {
      setError("");
      if (selectedEvent && newEvent.id) {
        await axios.put(`/api/schedules/${newEvent.id}`, scheduleData);
        alert("Schedule updated successfully!");
      } else {
        await axios.post("/api/schedules", scheduleData);
        alert("Schedule added successfully!");
      }
      handleCloseDialog();
      fetchCalendarData();
    } catch (err) {
      console.error("Error saving schedule:", err);
      const errorMsg =
        err.response?.data?.title ||
        err.response?.data?.message ||
        "Failed to save the schedule. Please check console.";
      setError(errorMsg);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !newEvent.id) return;

    if (!window.confirm(`Are you sure you want to delete this schedule?`)) {
      return;
    }

    try {
      setError("");
      await axios.delete(`/api/schedules/${newEvent.id}`);
      alert("Schedule deleted successfully!");
      handleCloseDialog();
      fetchCalendarData();
    } catch (err) {
      console.error("Error deleting schedule:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to delete the schedule. Please try again.";
      setError(errorMsg);
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

  return (
    <Box>
      {error && !openDialog && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
            if (event.shiftType === "Morning") {
              return { style: { backgroundColor: "#2196F3" } };
            } else {
              return { style: { backgroundColor: "#4CAF50" } };
            }
          }}
        />
      </div>

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
          {error && openDialog && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={newEvent.scheduleDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
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
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Volunteer</InputLabel>
                  <Select
                    name="volunteerId"
                    value={newEvent.volunteerId}
                    onChange={handleInputChange}
                    label="Volunteer"
                  >
                    <MenuItem value="">
                      <em>Select Volunteer</em>
                    </MenuItem>
                    {volunteers.map((volunteer) => (
                      <MenuItem key={volunteer.id} value={volunteer.id}>
                        {`${volunteer.firstName} ${volunteer.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Route</InputLabel>
                  <Select
                    name="routeId"
                    value={newEvent.routeId}
                    onChange={handleInputChange}
                    label="Route"
                  >
                    <MenuItem value="">
                      <em>Select Route</em>
                    </MenuItem>
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
            {selectedEvent ? "Update Schedule" : "Add Schedule"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Calendar;
