import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

const OtpInput = ({ length = 6, value, onChange }) => {
  const theme = useTheme();
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const newValue = e.target.value;

    if (!/^[0-9]*$/.test(newValue)) {
      return;
    }

    // Create a new array based on current value
    const valueArray = value ? value.split("") : Array(length).fill("");

    // Update the value at current index
    valueArray[index] = newValue.slice(-1);

    // Join array to get the new value
    const newOtpValue = valueArray.join("");

    // Call the onChange callback
    onChange(newOtpValue);

    // Auto-focus next input if value was added
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    // Get pasted data
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted data contains only numbers
    if (!/^[0-9]*$/.test(pastedData)) {
      return;
    }

    // Get the digits up to the OTP length
    const otpValue = pastedData.slice(0, length);

    // Update the OTP value
    onChange(otpValue.padEnd(length, ""));

    // Focus the last filled input or the first empty one
    const lastFilledIndex = Math.min(otpValue.length - 1, length - 1);
    if (lastFilledIndex >= 0) {
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1,
      }}
    >
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
                padding: "8px",
              },
            }}
            sx={{
              width: "40px",
              height: "56px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.grey[300],
                  borderRadius: 2,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            value={value ? value[index] || "" : ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            autoComplete="off"
            placeholder="•"
          />
        ))}
    </Box>
  );
};

const DeliveryComplete = () => {
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(true); // Start with success since QR scan was successful
  const [otpValue, setOtpValue] = useState("424314"); // Pre-filled OTP for demonstration
  const [photos, setPhotos] = useState([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleOtpChange = (value) => {
    setOtpValue(value);
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);

    // In a real app, you'd upload these to a server
    setPhotos((prevPhotos) => [...prevPhotos, ...files]);

    // Create preview URLs for the selected photos
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  const handleRemovePhoto = (index) => {
    // Create new arrays without the removed photo
    const newPhotos = [...photos];
    const newPhotoPreviewUrls = [...photoPreviewUrls];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPhotoPreviewUrls[index]);

    // Remove the photo and preview URL
    newPhotos.splice(index, 1);
    newPhotoPreviewUrls.splice(index, 1);

    setPhotos(newPhotos);
    setPhotoPreviewUrls(newPhotoPreviewUrls);
  };

  const handleCompleteDelivery = async () => {
    // Validate OTP
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // In a real app, this would make an API call to verify OTP and upload photos
      // For now, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const deliveryDetails = {
        clientName: "John Doe",
        address: "123 Main St, Anytown, USA",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        photoCount: photos.length,
      };

      console.log("Completing delivery:", {
        deliveryId,
        otp: otpValue,
        photoCount: photos.length,
      });

      setLoading(false); // Navigate to confirmation page
      navigate(`/app/delivery-confirmation/${deliveryId}`, {
        state: {
          deliveryCompleted: true,
          deliveryDetails,
        },
      });
    } catch (error) {
      console.error("Error completing delivery:", error);
      setError("Failed to complete delivery. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Proceed to Checkout
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* QR Code Scan Success Indicator */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ position: "relative", mb: 2 }}>
            <QrCodeIcon
              sx={{
                fontSize: 100,
                color: theme.palette.grey[300],
              }}
            />
            <CheckCircleIcon
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 44,
                color: theme.palette.primary.main,
                bgcolor: "white",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            color="success.main"
            fontWeight="medium"
            textAlign="center"
          >
            QR Code Successfully Scanned
          </Typography>
        </Box>

        {/* OTP Entry */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 3,
            border: `1px solid ${theme.palette.grey[300]}`,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            Enter OTP
          </Typography>
          <OtpInput length={6} value={otpValue} onChange={handleOtpChange} />
        </Paper>

        {/* Photo Upload */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${theme.palette.grey[300]}`,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            Click Pictures of the product at Doorstep
          </Typography>

          <Box
            sx={{
              border: `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: 2,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              mb: 2,
              "&:hover": {
                borderColor: theme.palette.primary.main,
              },
            }}
            onClick={handlePhotoClick}
          >
            <CameraIcon
              sx={{ fontSize: 40, color: theme.palette.grey[500], mb: 1 }}
            />
            <Typography color="text.secondary">
              Click or upload Pictures
            </Typography>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />
          </Box>

          {/* Photo previews */}
          {photoPreviewUrls.length > 0 && (
            <Grid container spacing={1} sx={{ mt: 1 }}>
              {photoPreviewUrls.map((url, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "100%", // 1:1 aspect ratio
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`Photo ${index + 1}`}
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.7)",
                        },
                        p: 0.5,
                      }}
                      onClick={() => handleRemovePhoto(index)}
                    >
                      ✕
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Complete Button */}
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          onClick={handleCompleteDelivery}
          disabled={loading || otpValue.length !== 6}
          sx={{ py: 1.5, fontSize: "1rem" }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Complete Delivery"
          )}
        </Button>
      </Container>
    </Box>
  );
};

export default DeliveryComplete;
