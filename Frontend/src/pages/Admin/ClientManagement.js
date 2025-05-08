import React, { useState, useEffect } from "react";
import ClientService from "../../services/client-service";
import DeliveryRoutesService from "../../services/delivery-routes-service";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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
    dietaryRestrictionIds: [],
    eligibilityCriteriaIds: [],
    medicalNotes: "",
    deliveryInstructions: "",
    routeId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [clientsData, routesData] = await Promise.all([
          ClientService.getAllClients(),
          DeliveryRoutesService.getAllRoutes(),
        ]);

        setClients(clientsData);
        setRoutes(routesData.filter((r) => r.isActive));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load data. Please check the console and try again."
        );
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
    setError("");
    if (client) {
      setSelectedClient(client);
      setFormData({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        phoneNumber: client.phoneNumber || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        isActive: client.isActive !== undefined ? client.isActive : true,
        emergencyContactName: client.emergencyContactName || "",
        emergencyContactPhone: client.emergencyContactPhone || "",
        dietaryRestrictionIds:
          client.clientDietaryRestrictions?.map(
            (cdr) => cdr.dietaryRestrictionId
          ) || [],
        eligibilityCriteriaIds:
          client.clientEligibilityCriteria?.map(
            (cec) => cec.eligibilityCriterionId
          ) || [],
        medicalNotes: client.medicalNotes || "",
        deliveryInstructions: client.deliveryInstructions || "",
        routeId: client.routeId || null,
      });
    } else {
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
        dietaryRestrictionIds: [],
        eligibilityCriteriaIds: [],
        medicalNotes: "",
        deliveryInstructions: "",
        routeId: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
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
    const { name, value, type, checked } = e.target;

    if (name === "dietaryRestrictionIds" || name === "eligibilityCriteriaIds") {
      const selectedValues =
        typeof value === "string" ? value.split(",") : value;
      setFormData({
        ...formData,
        [name]: selectedValues,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSaveClient = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      setError(
        "Please fill in all required fields: First Name, Last Name, Address, City, State, ZIP Code."
      );
      return;
    }

    const clientData = {
      ...formData,
      routeId:
        formData.routeId === "" || formData.routeId === null
          ? null
          : parseInt(formData.routeId, 10),
      dietaryRestrictionIds: formData.dietaryRestrictionIds.map((id) =>
        parseInt(id, 10)
      ),
      eligibilityCriteriaIds: formData.eligibilityCriteriaIds.map((id) =>
        parseInt(id, 10)
      ),
    };

    try {
      setError("");
      let updatedClientData;
      if (selectedClient) {
        // Use the API response directly
        updatedClientData = await ClientService.updateClient(
          selectedClient.id,
          clientData
        );
        setClients(
          clients.map((c) =>
            c.id === selectedClient.id ? updatedClientData : c
          )
        );
        showNotification("Client updated successfully!");
      } else {
        // Use the API response directly
        updatedClientData = await ClientService.createClient(clientData);
        setClients([...clients, updatedClientData]);
        showNotification("Client added successfully!");
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving client:", err);
      const errorMsg =
        err.response?.data?.title ||
        err.response?.data?.message ||
        "Failed to save the client. Please check console.";
      setError(errorMsg);
    }
  };

  const handleToggleStatus = async (client) => {
    const newStatus = !client.isActive;
    const action = newStatus ? "activate" : "deactivate";
    if (
      !window.confirm(
        `Are you sure you want to ${action} ${client.firstName} ${client.lastName}?`
      )
    ) {
      return;
    }

    try {
      setError("");
      const clientToUpdate = { ...client, isActive: newStatus };
      delete clientToUpdate.clientDietaryRestrictions;
      delete clientToUpdate.clientEligibilityCriteria;
      delete clientToUpdate.route;

      await ClientService.updateClient(client.id, clientToUpdate);

      setClients(
        clients.map((c) =>
          c.id === client.id ? { ...c, isActive: newStatus } : c
        )
      );
      showNotification(`Client ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing client:`, err);
      const errorMsg =
        err.response?.data?.message ||
        `Failed to ${action} client. Please try again.`;
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const handleDeleteClient = async (client) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${client.firstName} ${client.lastName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setError("");
      await ClientService.deleteClient(client.id);

      setClients(clients.filter((c) => c.id !== client.id));
      showNotification("Client deleted successfully!");
    } catch (err) {
      console.error("Error deleting client:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to delete the client. Please try again.";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const getFullAddress = (client) => {
    const parts = [
      client?.address,
      client?.city,
      client?.state,
      client?.zipCode,
    ];
    return parts.filter(Boolean).join(", ");
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
              {clients.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                clients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((client) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={client.id}
                    >
                      <TableCell>{client.id}</TableCell>
                      <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                      <TableCell>{getFullAddress(client)}</TableCell>
                      <TableCell>{client.phoneNumber || "N/A"}</TableCell>
                      <TableCell>
                        {client.dietaryRestrictions
                          ? Array.isArray(client.dietaryRestrictions)
                            ? client.dietaryRestrictions
                                .map((dr) => dr.restrictionName)
                                .join(", ")
                            : typeof client.dietaryRestrictions === "object"
                            ? client.dietaryRestrictions.restrictionName
                            : client.dietaryRestrictions
                          : "None"}
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
                  ))
              )}
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
                    value={formData.routeId || ""}
                    label="Delivery Route"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {routes
                      .filter((r) => r.isActive)
                      .map((route) => (
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
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.state}
                    label="State"
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="AL">Alabama</MenuItem>
                    <MenuItem value="AK">Alaska</MenuItem>
                    <MenuItem value="AZ">Arizona</MenuItem>
                    <MenuItem value="AR">Arkansas</MenuItem>
                    <MenuItem value="CA">California</MenuItem>
                    <MenuItem value="IL">Illinois</MenuItem>
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
                  label="Dietary Restrictions (Text)"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  helperText="Separate multiple restrictions with commas"
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
                  label="Active Client"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveClient} variant="contained">
            {selectedClient ? "Update Client" : "Add Client"}
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

export default ClientManagement;
