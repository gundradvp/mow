import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  FlashOn as FlashOnIcon,
  FlashOff as FlashOffIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

// Sample QR code SVG image
const qrCodeSampleImage = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOTAgMjkwIiB3aWR0aD0iMjkwIiBoZWlnaHQ9IjI5MCI+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI5MCIgaGVpZ2h0PSIyOTAiIGZpbGw9IiNmZmZmZmYiPjwvcmVjdD4KICA8Zz4KICAgIDwhLS0gUVIgY29kZSBzZWN0aW9uIC0tPgogICAgPGcgZmlsbD0iIzAwMDAwMCI+CiAgICAgIDxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJ3aGl0ZSI+PC9yZWN0PgogICAgICAKICAgICAgPHJlY3QgeD0iNDAiIHk9IjEwMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjYwIiB5PSIxMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSI4MCIgeT0iMTAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgCiAgICAgIDxyZWN0IHg9IjEwMCIgeT0iNDAiIHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIxMDAiIHk9IjYwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMTIwIiB5PSI2MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjE0MCIgeT0iNjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICAKICAgICAgPHJlY3QgeD0iMjAwIiB5PSI0MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjIxMCIgeT0iNTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiPjwvcmVjdD4KICAgICAgCiAgICAgIDxyZWN0IHg9IjE2MCIgeT0iMTAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMTgwIiB5PSIxMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjIyMCIgeT0iMTAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMjQwIiB5PSIxMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICAKICAgICAgPHJlY3QgeD0iNDAiIHk9IjE0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjYwIiB5PSIxNDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSI4MCIgeT0iMTQwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgCiAgICAgIDxyZWN0IHg9IjEyMCIgeT0iMTIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMTQwIiB5PSIxMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICAKICAgICAgPHJlY3QgeD0iMTIwIiB5PSIxNDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIxNDAiIHk9IjE0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIAogICAgICA8cmVjdCB4PSIxNjAiIHk9IjE0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjE4MCIgeT0iMTQwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMjAwIiB5PSIxNDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIyMjAiIHk9IjE0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjI0MCIgeT0iMTQwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgCiAgICAgIDxyZWN0IHg9IjQwIiB5PSIyMDAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSI1MCIgeT0iMjEwIiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIj48L3JlY3Q+CiAgICAgIAogICAgICA8cmVjdCB4PSIxMjAiIHk9IjE4MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjE0MCIgeT0iMTgwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgCiAgICAgIDxyZWN0IHg9IjE2MCIgeT0iMjAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMTgwIiB5PSIyMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIyMDAiIHk9IjIwMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjIyMCIgeT0iMjAwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMjQwIiB5PSIyMDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICAKICAgICAgPHJlY3QgeD0iMTYwIiB5PSIyMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIxODAiIHk9IjIyMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjIwMCIgeT0iMjIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMjIwIiB5PSIyMjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIyNDAiIHk9IjIyMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIAogICAgICA8cmVjdCB4PSIxNjAiIHk9IjI0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjE4MCIgeT0iMjQwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgICAgPHJlY3QgeD0iMjAwIiB5PSIyNDAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PC9yZWN0PgogICAgICA8cmVjdCB4PSIyMjAiIHk9IjI0MCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48L3JlY3Q+CiAgICAgIDxyZWN0IHg9IjI0MCIgeT0iMjQwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvcmVjdD4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==`;

// Mock QR code scanning animation
const QRScanAnimation = () => {
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const [scanDirection, setScanDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLinePosition((prevPos) => {
        if (prevPos >= 100) {
          setScanDirection(-1);
          return 100;
        } else if (prevPos <= 0) {
          setScanDirection(1);
          return 0;
        } else {
          return prevPos + scanDirection * 5;
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [scanDirection]);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          left: "0",
          right: "0",
          top: `${scanLinePosition}%`,
          height: "2px",
          backgroundColor: "#ff0000",
          boxShadow: "0 0 8px rgba(255, 0, 0, 0.7)",
          transition: "top 0.1s linear",
        }}
      />
    </Box>
  );
};

const BarcodeScan = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scanAttempts, setScanAttempts] = useState(0);

  // In a real app, we would use a QR code scanning library like react-qr-reader
  // Here we're simulating the scanning process
  useEffect(() => {
    if (scanning && scanAttempts < 3) {
      const scanTimeout = setTimeout(() => {
        // Simulate a successful scan after 3 seconds
        handleSuccessfulScan("MOW-DELIVERY-" + deliveryId);
      }, 3000);

      return () => clearTimeout(scanTimeout);
    }
  }, [scanning, deliveryId, scanAttempts]);

  const handleBack = () => {
    // Navigate back to delivery navigation
    navigate(`/app/delivery-navigation/${deliveryId}`);
  };

  const toggleFlashlight = () => {
    // In a real app, this would toggle the device's flashlight
    setFlashlightOn(!flashlightOn);
  };

  const handleSuccessfulScan = (qrValue) => {
    setScanning(false);
    setLoading(true);

    // In a real app, this would validate the QR code with an API call
    setTimeout(() => {
      if (qrValue === "MOW-DELIVERY-" + deliveryId) {
        console.log("Successfully scanned QR code:", qrValue);
        setSuccess(true);
        setError(null);
        setLoading(false);

        // Navigate to delivery complete page after successful scan
        setTimeout(() => {
          navigate(`/app/delivery-complete/${deliveryId}`);
        }, 1500);
      } else {
        setScanAttempts((prev) => prev + 1);
        setError("Invalid QR code. Please try again.");
        setLoading(false);
        setScanning(true);
      }
    }, 1000);
  };

  // Handle maximum scan attempts
  useEffect(() => {
    if (scanAttempts >= 3) {
      setScanning(false);
      setError(
        "Maximum scan attempts reached. Please try again later or report an issue."
      );
    }
  }, [scanAttempts]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        bgcolor: "#1a1a1a",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            aria-label="back"
            size="large"
            sx={{ color: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Scan QR Code
          </Typography>
          <Box sx={{ width: 48 }} /> {/* Placeholder for symmetry */}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          px: 2,
        }}
      >
        {/* Flashlight button */}
        <IconButton
          color="inherit"
          onClick={toggleFlashlight}
          sx={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: "white",
            bgcolor: "rgba(0,0,0,0.4)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.6)",
            },
          }}
        >
          {flashlightOn ? <FlashOnIcon /> : <FlashOffIcon />}
        </IconButton>

        {/* Scanning frame */}
        <Box
          sx={{
            border: "2px solid white",
            borderRadius: 1,
            width: "80%",
            height: 280,
            maxWidth: 280,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            p: 2,
          }}
        >
          {/* Sample QR code image */}
          <Box
            component="img"
            src={qrCodeSampleImage}
            alt="Sample QR code"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />

          {/* Scanning animation */}
          {scanning && <QRScanAnimation />}
        </Box>

        {/* Loading indicator */}
        {loading && (
          <CircularProgress
            color="secondary"
            size={40}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Success feedback */}
        {success && (
          <Alert
            severity="success"
            sx={{ position: "absolute", bottom: 100, width: "80%" }}
          >
            QR code scanned successfully!
          </Alert>
        )}

        {/* Error feedback */}
        {error && (
          <Alert
            severity="error"
            sx={{ position: "absolute", bottom: 100, width: "80%" }}
          >
            {error}
          </Alert>
        )}

        {/* Instruction text */}
        <Typography
          variant="subtitle1"
          color="white"
          textAlign="center"
          sx={{ mt: 2 }}
        >
          Place the QR code Inside the Frame.
        </Typography>
      </Box>
    </Box>
  );
};

export default BarcodeScan;
