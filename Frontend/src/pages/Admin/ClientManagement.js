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
import HomeIcon from "@mui/icons-material/Home";

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "address", label: "Address", minWidth: 200 },
  { id: "phone", label: "Phone", minWidth: 130 },
  { id: "dietaryRestrictions", label: "Dietary Restrictions", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150, align: "center" },
];

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isActive: true,
    emergencyContactName: "",
    emergencyContactPhone: "",
    dietaryRestrictions: "",
    medicalNotes: "",
    deliveryInstructions: "",
    routeId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be API calls to your backend
        // For now, we'll simulate the data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for clients
        const mockClients = [
          {
            id: 1,
            firstName: "Alice",
            lastName: "Johnson",
            phoneNumber: "555-123-7890",
            address: "123 Elm St",
            city: "Springfield",
            state: "IL",
            zipCode: "62701",
            isActive: true,
            emergencyContactName: "Bob Johnson",
            emergencyContactPhone: "555-987-6541",
            dietaryRestrictions: "Gluten-free",
            medicalNotes: "Diabetes",
            deliveryInstructions: "Leave at front door",
            routeId: 1,
          },
          {
            id: 2,
            firstName: "Robert",
            lastName: "Williams",
            phoneNumber: "555-234-5678",
            address: "456 Maple Ave",
            city: "Springfield",
            state: "IL",
            zipCode: "62702",
            isActive: true,
            emergencyContactName: "Mary Williams",
            emergencyContactPhone: "555-876-5430",
            dietaryRestrictions: "Low sodium",
            medicalNotes: "Heart condition",
            deliveryInstructions: "Ring doorbell",
            routeId: 2,
          },
          {
            id: 3,
            firstName: "Carol",
            lastName: "Miller",
            phoneNumber: "555-345-6789",
            address: "789 Oak Blvd",
            city: "Springfield",
            state: "IL",
            zipCode: "62704",
            isActive: false,
            emergencyContactName: "David Miller",
            emergencyContactPhone: "555-765-4320",
            dietaryRestrictions: "Vegetarian",
            medicalNotes: "Allergic to peanuts",
            deliveryInstructions: "Enter through side gate",
            routeId: 3,
          },
        ];

        // Mock data for routes
        const mockRoutes = [
          { id: 1, name: "Route A" },
          { id: 2, name: "Route B" },
          { id: 3, name: "Route C" },
          { id: 4, name: "Route D" },
        ];

        setClients(mockClients);
        setRoutes(mockRoutes);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (client = null) => {
    if (client) {
      // Edit mode - set the form data to the selected client's data
      setSelectedClient(client);
      setFormData(client);
    } else {
      // Add mode - reset the form
      setSelectedClient(null);
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        isActive: true,
        emergencyContactName: "",
        emergencyContactPhone: "",
        dietaryRestrictions: "",
        medicalNotes: "",
        deliveryInstructions: "",
        routeId: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    });
  };

  const handleSaveClient = async () => {
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.address) {
        alert(
          "Please fill in all required fields: First Name, Last Name, and Address."
        );
        return;
      }

      if (selectedClient) {
        // Update existing client
        const updatedClients = clients.map((c) =>
          c.id === selectedClient.id
            ? { ...formData, id: selectedClient.id }
            : c
        );
        setClients(updatedClients);
        // In a real app, you would make an API call to update the client
      } else {
        // Add new client
        const newId = Math.max(...clients.map((c) => c.id), 0) + 1;
        const newClient = {
          ...formData,
          id: newId,
          registrationDate: new Date().toISOString().split("T")[0],
        };
        setClients([...clients, newClient]);
        // In a real app, you would make an API call to create a new client
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Failed to save the client. Please try again.");
    }
  };

  const handleToggleStatus = async (client) => {
    try {
      // Update client status
      const updatedClients = clients.map((c) =>
        c.id === client.id ? { ...c, isActive: !c.isActive } : c
      );
      setClients(updatedClients);
      // In a real app, you would make an API call to update the client status
    } catch (err) {
      console.error("Error toggling client status:", err);
      alert("Failed to update client status. Please try again.");
    }
  };

  const handleDeleteClient = async (client) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${client.firstName} ${client.lastName}?`
      )
    ) {
      return;
    }

    try {
      // Remove the client from the list
      const updatedClients = clients.filter((c) => c.id !== client.id);
      setClients(updatedClients);
      // In a real app, you would make an API call to delete the client
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Failed to delete the client. Please try again.");
    }
  };

  const getFullAddress = (client) => {
    return `${client.address}, ${client.city}, ${client.state} ${client.zipCode}`;
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
          Client Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Client
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
              {clients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                    <TableCell>{getFullAddress(client)}</TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>
                      {client.dietaryRestrictions || "None"}
                    </TableCell>
                    <TableCell>
                      {client.isActive ? (
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
                            onClick={() => handleOpenDialog(client)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={client.isActive ? "Deactivate" : "Activate"}
                        >
                          <IconButton
                            color={client.isActive ? "error" : "success"}
                            size="small"
                            onClick={() => handleToggleStatus(client)}
                          >
                            {client.isActive ? (
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
                            onClick={() => handleDeleteClient(client)}
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
          count={clients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Dialog for Adding/Editing Clients */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedClient ? "Edit Client" : "Add New Client"}
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
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Delivery Route</InputLabel>
                  <Select
                    name="routeId"
                    value={formData.routeId}
                    label="Delivery Route"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
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

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="address"
                  label="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
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
                  required
                  fullWidth
                  name="zipCode"
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="deliveryInstructions"
                  label="Delivery Instructions"
                  multiline
                  rows={2}
                  value={formData.deliveryInstructions}
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
              Dietary and Medical Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="dietaryRestrictions"
                  label="Dietary Restrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="medicalNotes"
                  label="Medical Notes"
                  multiline
                  rows={2}
                  value={formData.medicalNotes}
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
          <Button onClick={handleSaveClient} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ClientManagement;
