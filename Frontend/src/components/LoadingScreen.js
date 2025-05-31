import React from "react";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          color="primary"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          Meals On Wheels
        </Typography>

        <Typography variant="h5" color="secondary" sx={{ mb: 4 }}>
          Driver Delivery System
        </Typography>

        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />

        <Typography variant="body1" color="text.secondary">
          Loading your delivery information...
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingScreen;
