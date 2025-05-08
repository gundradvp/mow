import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as TruckIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const IncidentReport = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerNotAnsweringCalls: false,
    customerNotPresent: false,
    incorrectContactNumber: false,
    customerUnreachable: false,
    customerRefusedItem: false,
    customerRequestedReschedule: false,
    notes: "",
  });

  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  const handleNotesChange = (event) => {
    setFormData({
      ...formData,
      notes: event.target.value,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    // Check if at least one checkbox is selected and notes are provided
    const isAnyCheckboxSelected = Object.keys(formData).some(
      (key) => key !== "notes" && formData[key] === true
    );

    if (!isAnyCheckboxSelected) {
      setError("Please select at least one incident type.");
      return;
    }

    if (!formData.notes.trim()) {
      setError("Please provide notes about the incident.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In a real app, this would make an API call to report the incident
      // For now, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Submitting incident report:", {
        deliveryId,
        ...formData,
      });

      setSuccess(true);
      setLoading(false);

      // Navigate back after a brief delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Error submitting incident report:", error);
      setError("Failed to submit incident report. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header with Order ID */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TruckIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
              Order ID: {deliveryId}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Incident Report Form
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Incident report submitted successfully!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FormGroup sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customerNotAnsweringCalls}
                  onChange={handleCheckboxChange}
                  name="customerNotAnsweringCalls"
                />
              }
              label="Customer not answering calls"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customerNotPresent}
                  onChange={handleCheckboxChange}
                  name="customerNotPresent"
                />
              }
              label="Reached location, customer not present"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.incorrectContactNumber}
                  onChange={handleCheckboxChange}
                  name="incorrectContactNumber"
                />
              }
              label="Incorrect contact number"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customerUnreachable}
                  onChange={handleCheckboxChange}
                  name="customerUnreachable"
                />
              }
              label="Customer unreachable (phone off/no response)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customerRefusedItem}
                  onChange={handleCheckboxChange}
                  name="customerRefusedItem"
                />
              }
              label="Delivery attempted, customer refused item"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customerRequestedReschedule}
                  onChange={handleCheckboxChange}
                  name="customerRequestedReschedule"
                />
              }
              label="Customer requested reschedule for delivery"
            />
          </FormGroup>

          <TextField
            label="Note*"
            multiline
            rows={4}
            fullWidth
            required
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="Please provide details about the incident"
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default IncidentReport;
