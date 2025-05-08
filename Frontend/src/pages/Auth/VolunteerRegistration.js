import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Grid,
  Link,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  FormHelperText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Home as HomeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import volunteerService from "../../services/volunteerService";

// Validation schemas for each step
const validationSchemas = [
  // Step 0 - Account Information
  yup.object({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  }),

  // Step 1 - Personal Information
  yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipCode: yup.string().required("ZIP code is required"),
  }),

  // Step 2 - Volunteer Information
  yup.object({
    availability: yup.string().required("Please provide your availability"),
    skills: yup.string().required("Please provide at least one skill"),
    backgroundCheckConsent: yup
      .boolean()
      .oneOf([true], "You must consent to a background check")
      .required("Background check consent is required"),
  }),

  // Step 3 - Emergency Contact
  yup.object({
    emergencyContactName: yup
      .string()
      .required("Emergency contact name is required"),
    emergencyContactPhone: yup
      .string()
      .required("Emergency contact phone is required"),
  }),
];

const VolunteerRegistration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const steps = [
    "Account Setup",
    "Personal Information",
    "Volunteer Details",
    "Emergency Contact",
  ];

  // Initialize formik with all form fields
  const formik = useFormik({
    initialValues: {
      // Step 0 - Account Information
      username: "",
      email: "",
      password: "",
      confirmPassword: "",

      // Step 1 - Personal Information
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",

      // Step 2 - Volunteer Information
      availability: "",
      skills: "",
      hasDriverLicense: false,
      isWillingToDrive: false,
      canLift20Pounds: false,
      backgroundCheckConsent: false,
      preferences: "",

      // Step 3 - Emergency Contact
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        // If not on the last step, move to the next step
        setActiveStep(activeStep + 1);
        return;
      }

      // On the last step, submit the form
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = values;

      // Call the API to register the volunteer
      await volunteerService.registerVolunteer(registrationData);

      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/volunteer-login");
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Create Your Account
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              id="username"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormHelperText>
              Password must be at least 6 characters and include uppercase,
              lowercase, number, and special character.
            </FormHelperText>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin="normal"
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="address"
              name="address"
              label="Street Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="city"
                  name="city"
                  label="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="state"
                  name="state"
                  label="State"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                />
              </Grid>

              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="zipCode"
                  name="zipCode"
                  label="ZIP Code"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.zipCode && Boolean(formik.errors.zipCode)
                  }
                  helperText={formik.touched.zipCode && formik.errors.zipCode}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Volunteer Details
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              id="availability"
              name="availability"
              label="Availability"
              placeholder="e.g., Weekdays, Mornings, First Saturday of the month"
              value={formik.values.availability}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.availability &&
                Boolean(formik.errors.availability)
              }
              helperText={
                formik.touched.availability && formik.errors.availability
              }
              multiline
              rows={2}
            />

            <TextField
              fullWidth
              margin="normal"
              id="skills"
              name="skills"
              label="Skills"
              placeholder="Enter skills separated by commas (e.g., Driving, Cooking, Administration)"
              value={formik.values.skills}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.skills && Boolean(formik.errors.skills)}
              helperText={formik.touched.skills && formik.errors.skills}
            />

            <TextField
              fullWidth
              margin="normal"
              id="preferences"
              name="preferences"
              label="Preferences (Optional)"
              placeholder="Any preferences for volunteer work"
              value={formik.values.preferences}
              onChange={formik.handleChange}
              multiline
              rows={2}
            />

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.hasDriverLicense}
                    onChange={formik.handleChange}
                    name="hasDriverLicense"
                  />
                }
                label="I have a valid driver's license"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isWillingToDrive}
                    onChange={formik.handleChange}
                    name="isWillingToDrive"
                  />
                }
                label="I am willing to drive for deliveries"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.canLift20Pounds}
                    onChange={formik.handleChange}
                    name="canLift20Pounds"
                  />
                }
                label="I can lift 20 pounds"
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.backgroundCheckConsent}
                    onChange={formik.handleChange}
                    name="backgroundCheckConsent"
                  />
                }
                label="I consent to a background check"
              />
              {formik.touched.backgroundCheckConsent &&
                formik.errors.backgroundCheckConsent && (
                  <FormHelperText error>
                    {formik.errors.backgroundCheckConsent}
                  </FormHelperText>
                )}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              id="emergencyContactName"
              name="emergencyContactName"
              label="Emergency Contact Name"
              value={formik.values.emergencyContactName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.emergencyContactName &&
                Boolean(formik.errors.emergencyContactName)
              }
              helperText={
                formik.touched.emergencyContactName &&
                formik.errors.emergencyContactName
              }
            />

            <TextField
              fullWidth
              margin="normal"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              label="Emergency Contact Phone"
              value={formik.values.emergencyContactPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.emergencyContactPhone &&
                Boolean(formik.errors.emergencyContactPhone)
              }
              helperText={
                formik.touched.emergencyContactPhone &&
                formik.errors.emergencyContactPhone
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="emergencyContactRelationship"
              name="emergencyContactRelationship"
              label="Relationship to You"
              value={formik.values.emergencyContactRelationship}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                By clicking "Submit", you agree to our{" "}
                <Link href="#" target="_blank" rel="noopener">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" target="_blank" rel="noopener">
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper sx={{ p: 4, borderRadius: "12px", textAlign: "center" }}>
          <Box sx={{ mb: 3 }}>
            <CheckIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Thank you for registering as a volunteer. Your application has
              been received and is being reviewed.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will be redirected to the login page in a few seconds...
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/volunteer-login")}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: "12px" }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Volunteer Registration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our team of volunteers and make a difference in your community.
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          {getStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                "Submit"
              ) : (
                "Continue"
              )}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/volunteer-login"
              variant="body2"
              color="primary"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default VolunteerRegistration;
