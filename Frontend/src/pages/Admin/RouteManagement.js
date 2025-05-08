import React, { useState, useEffect } from "react";
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
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";

// Icons
import AddRoadIcon from "@mui/icons-material/AddRoad";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RouteIcon from "@mui/icons-material/Route";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "name", label: "Route Name", minWidth: 150 },
  { id: "description", label: "Description", minWidth: 200 },
  { id: "clients", label: "Clients", minWidth: 100, align: "center" },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 150, align: "center" },
];

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedDurationMinutes: 0,
    isActive: true,
  });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await DeliveryRoutesService.getAllRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load routes. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (route = null) => {
    setError("");
    if (route) {
      setSelectedRoute(route);
      setFormData({
        name: route.name || "",
        description: route.description || "",
        estimatedDurationMinutes: route.estimatedDurationMinutes || 0,
        isActive: route.isActive !== undefined ? route.isActive : true,
      });
    } else {
      setSelectedRoute(null);
      setFormData({
        name: "",
        description: "",
        estimatedDurationMinutes: 0,
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoute(null);
    setError("");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "estimatedDurationMinutes"
          ? parseInt(value, 10) || 0
          : value,
    });
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSaveRoute = async () => {
    if (!formData.name) {
      setError("Please enter a route name.");
      return;
    }
    if (formData.estimatedDurationMinutes < 0) {
      setError("Estimated duration cannot be negative.");
      return;
    }

    const routeData = {
      name: formData.name,
      description: formData.description,
      estimatedDurationMinutes: formData.estimatedDurationMinutes,
      isActive: formData.isActive,
    };

    try {
      setError("");
      if (selectedRoute) {
        await DeliveryRoutesService.updateRoute(selectedRoute.id, routeData);
        showNotification("Route updated successfully!");
      } else {
        await DeliveryRoutesService.createRoute(routeData);
        showNotification("Route added successfully!");
      }
      handleCloseDialog();
      fetchRoutes();
    } catch (err) {
      console.error("Error saving route:", err);
      const errorMsg =
        err.response?.data?.title ||
        err.response?.data?.message ||
        "Failed to save the route. Please check console.";
      setError(errorMsg);
    }
  };

  const handleToggleStatus = async (route) => {
    const newStatus = !route.isActive;
    const action = newStatus ? "activate" : "deactivate";
    if (
      !window.confirm(
        `Are you sure you want to ${action} route "${route.name}"?`
      )
    ) {
      return;
    }

    try {
      setError("");
      await DeliveryRoutesService.toggleRouteStatus(route.id, route);
      showNotification(`Route ${action}d successfully!`);
      fetchRoutes();
    } catch (err) {
      console.error(`Error ${action}ing route:`, err);
      const errorMsg =
        err.response?.data?.message ||
        `Failed to ${action} route. Please try again.`;
      setError(errorMsg);
      showNotification(errorMsg, "error");
    }
  };

  const handleDeleteRoute = async (route) => {
    if (route.clientCount > 0) {
      showNotification(
        `Cannot delete route "${route.name}" because it has ${route.clientCount} clients assigned. Please reassign clients before deleting.`,
        "error"
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to permanently delete route "${route.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setError("");
      await DeliveryRoutesService.deleteRoute(route.id);
      showNotification("Route deleted successfully!");
      fetchRoutes();
    } catch (err) {
      console.error("Error deleting route:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to delete the route. Please try again.";
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
          Route Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRoadIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Route
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
              {routes.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No routes found.
                  </TableCell>
                </TableRow>
              ) : (
                routes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((route) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={route.id}
                    >
                      <TableCell>{route.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <RouteIcon sx={{ color: "primary.main", mr: 1 }} />
                          {route.name}
                        </Box>
                      </TableCell>
                      <TableCell>{route.description || "N/A"}</TableCell>
                      <TableCell align="center">
                        <Badge
                          badgeContent={
                            route.clientCount !== undefined
                              ? route.clientCount
                              : "?"
                          }
                          color="primary"
                          showZero
                        >
                          <PersonIcon />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {route.isActive ? (
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
                              onClick={() => handleOpenDialog(route)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={route.isActive ? "Deactivate" : "Activate"}
                          >
                            <IconButton
                              color={route.isActive ? "error" : "success"}
                              size="small"
                              onClick={() => handleToggleStatus(route)}
                            >
                              {route.isActive ? (
                                <CancelIcon />
                              ) : (
                                <CheckCircleIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDeleteRoute(route)}
                                disabled={route.clientCount > 0}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </span>
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
          count={routes.length}
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
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedRoute ? "Edit Route" : "Add New Route"}
        </DialogTitle>
        <DialogContent>
          {error && openDialog && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  autoFocus
                  name="name"
                  label="Route Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  name="estimatedDurationMinutes"
                  label="Estimated Duration (Minutes)"
                  value={formData.estimatedDurationMinutes}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
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
                  label="Active Route"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRoute} variant="contained">
            {selectedRoute ? "Update Route" : "Add Route"}
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

export default RouteManagement;
