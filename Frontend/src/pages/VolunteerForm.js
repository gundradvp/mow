import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

// Validation schema for volunteer form
const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipCode: yup.string().required("ZIP code is required"),
  availability: yup.string().required("Availability information is required"),
  emergencyContactName: yup
    .string()
    .required("Emergency contact name is required"),
  emergencyContactPhone: yup
    .string()
    .required("Emergency contact phone is required"),
  skills: yup.string().required("Please provide at least one skill"),
});

const VolunteerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Default state values for a new volunteer
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isActive: true,
    availability: "",
    skills: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    hasDriverLicense: false,
    isWillingToDrive: false,
    canLift20Pounds: false,
    backgroundCheckConsent: false,
    dietaryRestrictions: "",
    medicalConditions: "",
    notes: "",
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    // If ID exists, fetch volunteer data to edit
    if (id) {
      setLoading(true);
      axios
        .get(`/api/Volunteers/${id}`)
        .then((response) => {
          // Set form values from API response
          const volunteerData = response.data;
          formik.setValues({
            firstName: volunteerData.firstName || "",
            lastName: volunteerData.lastName || "",
            email: volunteerData.email || "",
            phoneNumber: volunteerData.phoneNumber || "",
            address: volunteerData.address || "",
            city: volunteerData.city || "",
            state: volunteerData.state || "",
            zipCode: volunteerData.zipCode || "",
            isActive:
              volunteerData.isActive !== undefined
                ? volunteerData.isActive
                : true,
            availability: volunteerData.availability || "",
            skills: volunteerData.skills || "",
            emergencyContactName: volunteerData.emergencyContactName || "",
            emergencyContactPhone: volunteerData.emergencyContactPhone || "",
            emergencyContactRelationship:
              volunteerData.emergencyContactRelationship || "",
            hasDriverLicense: volunteerData.hasDriverLicense || false,
            isWillingToDrive: volunteerData.isWillingToDrive || false,
            canLift20Pounds: volunteerData.canLift20Pounds || false,
            backgroundCheckConsent:
              volunteerData.backgroundCheckConsent || false,
            dietaryRestrictions: volunteerData.dietaryRestrictions || "",
            medicalConditions: volunteerData.medicalConditions || "",
            notes: volunteerData.notes || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching volunteer:", error);
          setError("Failed to load volunteer data. Please try again.");
          setLoading(false);

          // For development purposes, load mock data
          setTimeout(() => {
            formik.setValues({
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
              phoneNumber: "555-123-4567",
              address: "123 Main Street",
              city: "Springfield",
              state: "IL",
              zipCode: "62701",
              isActive: true,
              availability: "Weekdays, Mornings",
              skills: "Driving, Cooking, Administration",
              emergencyContactName: "Jane Doe",
              emergencyContactPhone: "555-987-6543",
              emergencyContactRelationship: "Spouse",
              hasDriverLicense: true,
              isWillingToDrive: true,
              canLift20Pounds: true,
              backgroundCheckConsent: true,
              dietaryRestrictions: "None",
              medicalConditions: "None",
              notes: "Prefers delivery routes in north side of town.",
            });
          }, 500);
        });
    }
  }, [id]);

  const handleSubmit = (values) => {
    setLoading(true);

    if (id) {
      // Update existing volunteer
      axios
        .put(`/api/Volunteers/${id}`, values)
        .then(() => {
          setSuccess("Volunteer updated successfully!");
          setLoading(false);

          // Navigate after a short delay to show the success message
          setTimeout(() => {
            navigate(`/volunteer/${id}`);
          }, 1500);
        })
        .catch((error) => {
          console.error("Error updating volunteer:", error);
          setError("Failed to update volunteer. Please try again.");
          setLoading(false);
        });
    } else {
      // Create new volunteer
      axios
        .post("/api/Volunteers", values)
        .then((response) => {
          setSuccess("Volunteer added successfully!");
          setLoading(false);

          // Navigate after a short delay to show the success message
          setTimeout(() => {
            navigate(`/volunteer/${response.data.id}`);
          }, 1500);
        })
        .catch((error) => {
          console.error("Error creating volunteer:", error);
          setError("Failed to create volunteer. Please try again.");
          setLoading(false);
        });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
      setLoading(true);
      axios
        .delete(`/api/Volunteers/${id}`)
        .then(() => {
          setSuccess("Volunteer deleted successfully!");
          setLoading(false);

          // Navigate after a short delay to show the success message
          setTimeout(() => {
            navigate("/volunteers");
          }, 1500);
        })
        .catch((error) => {
          console.error("Error deleting volunteer:", error);
          setError("Failed to delete volunteer. Please try again.");
          setLoading(false);
        });
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Split the comma-separated skills into an array of chips
  const skillsArray = formik.values.skills
    ? formik.values.skills.split(",").map((skill) => skill.trim())
    : [];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {id ? "Edit Volunteer" : "Add New Volunteer"}
        </Typography>
      </Box>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      {success && (
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Street Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="city"
                  name="city"
                  label="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="state"
                  name="state"
                  label="State"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="zipCode"
                  name="zipCode"
                  label="ZIP Code"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.zipCode && Boolean(formik.errors.zipCode)
                  }
                  helperText={formik.touched.zipCode && formik.errors.zipCode}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Status</FormLabel>
                  <RadioGroup
                    row
                    name="isActive"
                    value={formik.values.isActive}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "isActive",
                        e.target.value === "true"
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Active"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Inactive"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="emergencyContactName"
                  name="emergencyContactName"
                  label="Contact Name"
                  value={formik.values.emergencyContactName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.emergencyContactName &&
                    Boolean(formik.errors.emergencyContactName)
                  }
                  helperText={
                    formik.touched.emergencyContactName &&
                    formik.errors.emergencyContactName
                  }
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  label="Contact Phone"
                  value={formik.values.emergencyContactPhone}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.emergencyContactPhone &&
                    Boolean(formik.errors.emergencyContactPhone)
                  }
                  helperText={
                    formik.touched.emergencyContactPhone &&
                    formik.errors.emergencyContactPhone
                  }
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="emergencyContactRelationship"
                  name="emergencyContactRelationship"
                  label="Relationship to Volunteer"
                  value={formik.values.emergencyContactRelationship}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.emergencyContactRelationship &&
                    Boolean(formik.errors.emergencyContactRelationship)
                  }
                  helperText={
                    formik.touched.emergencyContactRelationship &&
                    formik.errors.emergencyContactRelationship
                  }
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Volunteer Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="availability"
                  name="availability"
                  label="Availability"
                  placeholder="e.g., Weekdays, Mornings, First Saturday of the month"
                  value={formik.values.availability}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.availability &&
                    Boolean(formik.errors.availability)
                  }
                  helperText={
                    formik.touched.availability && formik.errors.availability
                  }
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="skills"
                  name="skills"
                  label="Skills"
                  placeholder="Enter skills separated by commas (e.g., Driving, Cooking, Administration)"
                  value={formik.values.skills}
                  onChange={formik.handleChange}
                  error={formik.touched.skills && Boolean(formik.errors.skills)}
                  helperText={formik.touched.skills && formik.errors.skills}
                  margin="normal"
                />

                {/* Display skills as chips */}
                {skillsArray.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    {skillsArray.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.hasDriverLicense}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "hasDriverLicense",
                          e.target.checked
                        )
                      }
                      name="hasDriverLicense"
                    />
                  }
                  label="Has a valid driver's license"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.isWillingToDrive}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "isWillingToDrive",
                          e.target.checked
                        )
                      }
                      name="isWillingToDrive"
                    />
                  }
                  label="Is willing to drive for deliveries"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.canLift20Pounds}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "canLift20Pounds",
                          e.target.checked
                        )
                      }
                      name="canLift20Pounds"
                    />
                  }
                  label="Can lift 20 pounds"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.backgroundCheckConsent}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "backgroundCheckConsent",
                          e.target.checked
                        )
                      }
                      name="backgroundCheckConsent"
                    />
                  }
                  label="Consents to background check"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  label="Dietary Restrictions"
                  value={formik.values.dietaryRestrictions}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="medicalConditions"
                  name="medicalConditions"
                  label="Medical Conditions"
                  value={formik.values.medicalConditions}
                  onChange={formik.handleChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="notes"
                  name="notes"
                  label="Additional Notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" color="inherit" onClick={handleBack}>
              Cancel
            </Button>

            <Box>
              {id && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ mr: 2 }}
                >
                  Delete
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {id ? "Update Volunteer" : "Add Volunteer"}
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Container>
  );
};

export default VolunteerForm;
