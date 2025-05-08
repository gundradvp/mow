import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

const DeliveryConfirmation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { deliveryId } = useParams();
  const location = useLocation();

  const deliveryDetails = location.state?.deliveryDetails || {
    clientName: "John Doe",
    address: "123 Main St, Anytown, USA",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // Trigger confetti effect on component mount
  useEffect(() => {
    // Confetti effect for celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const runConfetti = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [theme.palette.primary.main, theme.palette.success.main],
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [theme.palette.primary.main, theme.palette.success.main],
      });

      if (Date.now() < end) {
        requestAnimationFrame(runConfetti);
      }
    };

    runConfetti();

    return () => {
      // Cleanup function to cancel any animations
      // No specific cleanup needed for confetti
    };
  }, [theme.palette.primary.main, theme.palette.success.main]);

  const handleBackToHome = () => {
    navigate("/volunteer-dashboard");
  };

  const handleNextDelivery = () => {
    // Navigate to the next delivery if available, otherwise go to dashboard
    navigate("/volunteer-dashboard", {
      state: { checkForNextDelivery: true },
    });
  };

  return (
    <Box
      sx={{
        pb: 4,
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBackToHome}
            aria-label="back"
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Delivery Confirmation
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        {/* Success animation */}
        <Box
          sx={{
            mt: 3,
            mb: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "success.light",
              mb: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, color: "white" }} />
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "success.main" }}
          >
            Delivery Completed Successfully!
          </Typography>

          <Typography variant="body1" color="text.secondary">
            The meal has been delivered and verified with OTP and photos.
          </Typography>
        </Box>

        {/* Delivery details summary */}
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${theme.palette.grey[200]}`,
            textAlign: "left",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
            Delivery Summary
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LocalShippingIcon sx={{ color: theme.palette.grey[500], mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Delivered to
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {deliveryDetails.clientName}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ pl: 5, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body1">{deliveryDetails.address}</Typography>
          </Box>

          <Box sx={{ pl: 5 }}>
            <Typography variant="body2" color="text.secondary">
              Delivery Time
            </Typography>
            <Typography variant="body1">{deliveryDetails.time}</Typography>
          </Box>
        </Paper>

        {/* Action buttons */}
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleNextDelivery}
            sx={{ py: 1.5, fontSize: "1rem" }}
          >
            Proceed to Next Delivery
          </Button>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            onClick={handleBackToHome}
            sx={{ py: 1.5, fontSize: "1rem" }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DeliveryConfirmation;
