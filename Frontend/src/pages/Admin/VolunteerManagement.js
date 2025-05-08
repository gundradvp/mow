import React, { useState, useEffect } from "react";
import VolunteerService from "../../services/volunteer-service";

// MUI components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";

// Icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "phone", label: "Phone", minWidth: 130 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150, align: "center" },
];

function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isActive: true,
    emergencyContactName: "",
    emergencyContactPhone: "",
    notes: "",
  });

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await VolunteerService.getAllVolunteers();
      setVolunteers(data);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load volunteers. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (volunteer = null) => {
    setError("");
    if (volunteer) {
      setSelectedVolunteer(volunteer);
      setFormData({
        userId: volunteer.userId || "",
        firstName: volunteer.firstName || "",
        lastName: volunteer.lastName || "",
        email: volunteer.email || "",
        phoneNumber: volunteer.phoneNumber || "",
        address: volunteer.address || "",
        city: volunteer.city || "",
        state: volunteer.state || "",
        zipCode: volunteer.zipCode || "",
        isActive: volunteer.isActive !== undefined ? volunteer.isActive : true,
        emergencyContactName: volunteer.emergencyContactName || "",
        emergencyContactPhone: volunteer.emergencyContactPhone || "",
        notes: volunteer.notes || "",
      });
    } else {
      setSelectedVolunteer(null);
      setFormData({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        isActive: true,
        emergencyContactName: "",
        emergencyContactPhone: "",
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVolunteer(null);
    setError("");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    });
  };

  const handleSaveVolunteer = async () => {
    // Add specific check for userId when creating a new volunteer
    if (!selectedVolunteer && !formData.userId) {
      setError("Please enter the User ID for the new volunteer.");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError(
        "Please fill in all required fields: First Name, Last Name, and Email."
      );
      return;
    }

    // Parse userId to integer
    const userIdInt = parseInt(formData.userId, 10);
    if (!selectedVolunteer && (isNaN(userIdInt) || userIdInt <= 0)) {
      setError("Please enter a valid positive User ID for the new volunteer.");
      return;
    }

    const volunteerData = {
      // Use the parsed integer userId only when creating
      userId: !selectedVolunteer ? userIdInt : undefined, // Send undefined if updating
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      isActive: formData.isActive,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      notes: formData.notes,
    };

    try {
      setError("");
      if (selectedVolunteer) {
        // When updating, don't send userId
        const { userId, ...updateData } = volunteerData;
        await VolunteerService.updateVolunteer(
          selectedVolunteer.id,
          updateData
        );
        showNotification("Volunteer updated successfully!");
      } else {
        // When creating, send the full data including the parsed userIdInt
        await VolunteerService.createVolunteer({
          ...volunteerData,
          userId: userIdInt,
        });
        showNotification("Volunteer added successfully!");
      }
      handleCloseDialog();
      fetchVolunteers();
    } catch (err) {
      console.error("Error saving volunteer:", err);
      let errorMsg = "Failed to save the volunteer. Please check console.";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const fieldErrors = Object.keys(errors)
          .map((key) => `${key}: ${errors[key].join(", ")}`)
          .join("\n");
        errorMsg = `Validation failed:\n${fieldErrors}`;
      } else {
        errorMsg =
          err.response?.data?.title || err.response?.data?.message || errorMsg;
      }
      setError(errorMsg);
    }
  };

  const handleToggleStatus = async (volunteer) => {
    const newStatus = !volunteer.isActive;
    const action = newStatus ? "activate" : "deactivate";
    if (
      !window.confirm(
        `Are you sure you want to ${action} ${volunteer.firstName} ${volunteer.lastName}?`
      )
    ) {
      return;
    }

    const volunteerData = {
      userId: volunteer.userId,
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      email: volunteer.email,
      phoneNumber: volunteer.phoneNumber,
      address: volunteer.address,
      city: volunteer.city,
      state: volunteer.state,
      zipCode: volunteer.zipCode,
      isActive: newStatus,
      emergencyContactName: volunteer.emergencyContactName,
      emergencyContactPhone: volunteer.emergencyContactPhone,
      notes: volunteer.notes,
    };

    try {
      setError("");
      await VolunteerService.updateVolunteer(volunteer.id, volunteerData);
      showNotification(`Volunteer ${action}d successfully!`);
      fetchVolunteers();
    } catch (err) {
      console.error(`Error ${action}ing volunteer:`, err);
      const errorMsg =
        err.response?.data?.message ||
        `Failed to ${action} volunteer. Please try again.`;
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const handleDeleteVolunteer = async (volunteer) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${volunteer.firstName} ${volunteer.lastName}? This might fail if they have scheduled deliveries.`
      )
    ) {
      return;
    }

    try {
      setError("");
      await VolunteerService.deleteVolunteer(volunteer.id);
      showNotification("Volunteer deleted successfully!");
      fetchVolunteers();
    } catch (err) {
      console.error("Error deleting volunteer:", err);
      let errorMsg =
        err.response?.data?.message ||
        "Failed to delete the volunteer. Please try again.";
      if (err.response?.status === 409) {
        errorMsg = `Cannot delete volunteer: ${
          err.response.data.message || "They may have existing schedules."
        }`;
      }
      setError(errorMsg);
      showNotification(errorMsg, "error");
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Volunteer Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Volunteer
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {volunteers.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No volunteers found.
                  </TableCell>
                </TableRow>
              ) : (
                volunteers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((volunteer) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={volunteer.id}
                    >
                      <TableCell>{volunteer.id}</TableCell>
                      <TableCell>{`${volunteer.firstName} ${volunteer.lastName}`}</TableCell>
                      <TableCell>{volunteer.email}</TableCell>
                      <TableCell>{volunteer.phoneNumber || "N/A"}</TableCell>
                      <TableCell>
                        {volunteer.isActive ? (
                          <Chip
                            label="Active"
                            color="success"
                            size="small"
                            icon={<CheckCircleIcon />}
                          />
                        ) : (
                          <Chip
                            label="Inactive"
                            color="default"
                            size="small"
                            icon={<CancelIcon />}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenDialog(volunteer)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={
                              volunteer.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            <IconButton
                              color={volunteer.isActive ? "error" : "success"}
                              size="small"
                              onClick={() => handleToggleStatus(volunteer)}
                            >
                              {volunteer.isActive ? (
                                <CancelIcon />
                              ) : (
                                <CheckCircleIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteVolunteer(volunteer)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={volunteers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
        </DialogTitle>
        <DialogContent>
          {error && openDialog && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required={!selectedVolunteer}
                  fullWidth
                  name="userId"
                  label="User ID"
                  type="number"
                  value={formData.userId}
                  onChange={handleInputChange}
                  disabled={!!selectedVolunteer}
                  helperText={
                    selectedVolunteer
                      ? "User ID cannot be changed."
                      : "Enter the existing User ID for this volunteer."
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.state}
                    label="State"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="AL">Alabama</MenuItem>
                    <MenuItem value="AK">Alaska</MenuItem>
                    <MenuItem value="AZ">Arizona</MenuItem>
                    <MenuItem value="AR">Arkansas</MenuItem>
                    <MenuItem value="CA">California</MenuItem>
                    <MenuItem value="CO">Colorado</MenuItem>
                    <MenuItem value="CT">Connecticut</MenuItem>
                    <MenuItem value="DE">Delaware</MenuItem>
                    <MenuItem value="FL">Florida</MenuItem>
                    <MenuItem value="GA">Georgia</MenuItem>
                    <MenuItem value="HI">Hawaii</MenuItem>
                    <MenuItem value="ID">Idaho</MenuItem>
                    <MenuItem value="IL">Illinois</MenuItem>
                    <MenuItem value="IN">Indiana</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="zipCode"
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Emergency Contact
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="emergencyContactName"
                  label="Emergency Contact Name"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="emergencyContactPhone"
                  label="Emergency Contact Phone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="notes"
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveVolunteer} variant="contained">
            {selectedVolunteer ? "Update Volunteer" : "Add Volunteer"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default VolunteerManagement;
