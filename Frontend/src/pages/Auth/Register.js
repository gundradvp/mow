import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

// MUI components
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  phoneNumber: Yup.string().nullable(),
});

function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      setSuccess("");

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;

      await register(registerData);
      setSuccess("Registration successful! You can now login.");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register for MOW Scheduler
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
            {success}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form noValidate sx={{ mt: 3, width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={isSubmitting}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Register"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Register;
