import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call to your backend
        // For now, we'll simulate the data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for volunteers
        const mockVolunteers = [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "555-123-4567",
            address: "123 Main St",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            isActive: true,
            registrationDate: "2023-01-15",
            emergencyContactName: "Jane Doe",
            emergencyContactPhone: "555-987-6543",
            notes: "Available on weekdays",
          },
          {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phoneNumber: "555-234-5678",
            address: "456 Oak Ave",
            city: "Springfield",
            state: "IL",
            zipCode: "62702",
            isActive: true,
            registrationDate: "2023-02-20",
            emergencyContactName: "John Smith",
            emergencyContactPhone: "555-876-5432",
            notes: "Prefers morning shifts",
          },
          {
            id: 3,
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@example.com",
            phoneNumber: "555-345-6789",
            address: "789 Pine Ln",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
            isActive: false,
            registrationDate: "2023-03-05",
            emergencyContactName: "Sarah Johnson",
            emergencyContactPhone: "555-765-4321",
            notes: "On temporary leave",
          },
        ];

        setVolunteers(mockVolunteers);
      } catch (err) {
        console.error("Error fetching volunteers:", err);
        setError("Failed to load volunteers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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
    if (volunteer) {
      // Edit mode - set the form data to the selected volunteer's data
      setSelectedVolunteer(volunteer);
      setFormData(volunteer);
    } else {
      // Add mode - reset the form
      setSelectedVolunteer(null);
      setFormData({
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
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    });
  };

  const handleSaveVolunteer = async () => {
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        alert(
          "Please fill in all required fields: First Name, Last Name, and Email."
        );
        return;
      }

      if (selectedVolunteer) {
        // Update existing volunteer
        const updatedVolunteers = volunteers.map((v) =>
          v.id === selectedVolunteer.id
            ? { ...formData, id: selectedVolunteer.id }
            : v
        );
        setVolunteers(updatedVolunteers);
        // In a real app, you would make an API call to update the volunteer
      } else {
        // Add new volunteer
        const newId = Math.max(...volunteers.map((v) => v.id), 0) + 1;
        const newVolunteer = {
          ...formData,
          id: newId,
          registrationDate: new Date().toISOString().split("T")[0],
        };
        setVolunteers([...volunteers, newVolunteer]);
        // In a real app, you would make an API call to create a new volunteer
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving volunteer:", err);
      alert("Failed to save the volunteer. Please try again.");
    }
  };

  const handleToggleStatus = async (volunteer) => {
    try {
      // Update volunteer status
      const updatedVolunteers = volunteers.map((v) =>
        v.id === volunteer.id ? { ...v, isActive: !v.isActive } : v
      );
      setVolunteers(updatedVolunteers);
      // In a real app, you would make an API call to update the volunteer status
    } catch (err) {
      console.error("Error toggling volunteer status:", err);
      alert("Failed to update volunteer status. Please try again.");
    }
  };

  const handleDeleteVolunteer = async (volunteer) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${volunteer.firstName} ${volunteer.lastName}?`
      )
    ) {
      return;
    }

    try {
      // Remove the volunteer from the list
      const updatedVolunteers = volunteers.filter((v) => v.id !== volunteer.id);
      setVolunteers(updatedVolunteers);
      // In a real app, you would make an API call to delete the volunteer
    } catch (err) {
      console.error("Error deleting volunteer:", err);
      alert("Failed to delete the volunteer. Please try again.");
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
              {volunteers
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
                    <TableCell>{volunteer.phoneNumber}</TableCell>
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
                          title={volunteer.isActive ? "Deactivate" : "Activate"}
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
                ))}
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

      {/* Dialog for Adding/Editing Volunteers */}
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
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
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
                    {/* Add all states here */}
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VolunteerManagement;
