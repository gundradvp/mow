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
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Badge from "@mui/material/Badge";

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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    area: "",
    estimatedDuration: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call to your backend
        // For now, we'll simulate the data with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for routes
        const mockRoutes = [
          {
            id: 1,
            name: "Route A",
            description: "Downtown area - North side",
            area: "Downtown",
            estimatedDuration: "45 minutes",
            isActive: true,
            clientCount: 12,
          },
          {
            id: 2,
            name: "Route B",
            description: "Eastside residential",
            area: "East Springfield",
            estimatedDuration: "35 minutes",
            isActive: true,
            clientCount: 8,
          },
          {
            id: 3,
            name: "Route C",
            description: "Westside and university area",
            area: "West Springfield",
            estimatedDuration: "50 minutes",
            isActive: true,
            clientCount: 15,
          },
          {
            id: 4,
            name: "Route D",
            description: "South suburb route",
            area: "South Springfield",
            estimatedDuration: "40 minutes",
            isActive: false,
            clientCount: 0,
          },
        ];

        setRoutes(mockRoutes);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Failed to load routes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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
    if (route) {
      // Edit mode - set the form data to the selected route's data
      setSelectedRoute(route);
      setFormData({
        name: route.name,
        description: route.description,
        area: route.area,
        estimatedDuration: route.estimatedDuration,
        isActive: route.isActive,
      });
    } else {
      // Add mode - reset the form
      setSelectedRoute(null);
      setFormData({
        name: "",
        description: "",
        area: "",
        estimatedDuration: "",
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoute(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? checked : value,
    });
  };

  const handleSaveRoute = async () => {
    try {
      // Validate required fields
      if (!formData.name) {
        alert("Please enter a route name.");
        return;
      }

      if (selectedRoute) {
        // Update existing route
        const updatedRoutes = routes.map((r) =>
          r.id === selectedRoute.id
            ? {
                ...selectedRoute,
                ...formData,
              }
            : r
        );
        setRoutes(updatedRoutes);
        // In a real app, you would make an API call to update the route
      } else {
        // Add new route
        const newId = Math.max(...routes.map((r) => r.id), 0) + 1;
        const newRoute = {
          ...formData,
          id: newId,
          clientCount: 0,
        };
        setRoutes([...routes, newRoute]);
        // In a real app, you would make an API call to create a new route
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving route:", err);
      alert("Failed to save the route. Please try again.");
    }
  };

  const handleToggleStatus = async (route) => {
    try {
      // Update route status
      const updatedRoutes = routes.map((r) =>
        r.id === route.id ? { ...r, isActive: !r.isActive } : r
      );
      setRoutes(updatedRoutes);
      // In a real app, you would make an API call to update the route status
    } catch (err) {
      console.error("Error toggling route status:", err);
      alert("Failed to update route status. Please try again.");
    }
  };

  const handleDeleteRoute = async (route) => {
    // Prevent deletion if the route has clients
    if (route.clientCount > 0) {
      alert(
        `Cannot delete route "${route.name}" because it has ${route.clientCount} clients assigned to it. Please reassign clients before deleting.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${route.name}"?`)) {
      return;
    }

    try {
      // Remove the route from the list
      const updatedRoutes = routes.filter((r) => r.id !== route.id);
      setRoutes(updatedRoutes);
      // In a real app, you would make an API call to delete the route
    } catch (err) {
      console.error("Error deleting route:", err);
      alert("Failed to delete the route. Please try again.");
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
              {routes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((route) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={route.id}>
                    <TableCell>{route.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <RouteIcon sx={{ color: "primary.main", mr: 1 }} />
                        {route.name}
                      </Box>
                    </TableCell>
                    <TableCell>{route.description}</TableCell>
                    <TableCell align="center">
                      <Badge
                        badgeContent={route.clientCount}
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
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteRoute(route)}
                            disabled={route.clientCount > 0}
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
          count={routes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Dialog for Adding/Editing Routes */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedRoute ? "Edit Route" : "Add New Route"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
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
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="area"
                  label="Area/Neighborhood"
                  value={formData.area}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="estimatedDuration"
                  label="Estimated Duration"
                  value={formData.estimatedDuration}
                  onChange={handleInputChange}
                  placeholder="e.g., 45 minutes"
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
          <Button onClick={handleSaveRoute} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RouteManagement;
