import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Restaurant as FoodIcon,
  QrCode as QrCodeIcon,
  QrCodeScanner as QrCodeScannerIcon,
} from "@mui/icons-material";

const DriverLoadingSheet = ({
  open,
  onClose,
  routeNumber,
  deliveries,
  onLoadStatusChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState([]);
  const [allItemsChecked, setAllItemsChecked] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState("");
  const scanInputRef = useRef(null);
  useEffect(() => {
    if (open && deliveries && deliveries.length > 0) {
      // Create loading items with address and sequence number, not food items
      const items = [];
      deliveries.forEach((delivery) => {
        // Create one entry per delivery with address and sequence info
        items.push({
          id: delivery.id,
          recipientName: delivery.recipientName,
          address: delivery.address,
          sequenceNumber: delivery.sequenceNumber,
          parcelCount: delivery.items.length, // Just count of items, not details
          qrCode: delivery.id, // Using delivery ID as QR code for scanning
          checked: false,
        });
      });

      setLoadingItems(items);
      setLoading(false);
    }
  }, [open, deliveries]);

  useEffect(() => {
    if (loadingItems.length > 0) {
      const allChecked = loadingItems.every((item) => item.checked);
      setAllItemsChecked(allChecked);
    } else {
      setAllItemsChecked(false);
    }
  }, [loadingItems]);

  const handleToggleItem = (id) => {
    setLoadingItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const handleMarkAllLoaded = () => {
    setLoadingItems((prev) => prev.map((item) => ({ ...item, checked: true })));
  };

  const handleToggleScanMode = () => {
    setScanMode(!scanMode);
    setScanError("");
    setScanSuccess(false);
    setScannedCode("");

    if (!scanMode) {
      // Focus the input when entering scan mode
      setTimeout(() => {
        if (scanInputRef.current) {
          scanInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleScanCodeChange = (e) => {
    setScannedCode(e.target.value);
  };

  const handleScanComplete = () => {
    if (!scannedCode.trim()) {
      setScanError("Please enter or scan a valid QR code");
      return;
    }

    // Find the item with the matching ID or QR code
    const matchedItem = loadingItems.find(
      (item) => item.id === scannedCode.trim()
    );

    if (matchedItem) {
      // Mark this item as checked
      handleToggleItem(matchedItem.id);
      setScanSuccess(true);
      setScanError("");

      // Reset form after a short delay to show success
      setTimeout(() => {
        setScannedCode("");
        setScanSuccess(false);
        if (scanInputRef.current) {
          scanInputRef.current.focus();
        }
      }, 1000);
    } else {
      setScanError(`No item found with ID ${scannedCode}`);
      setScanSuccess(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleScanComplete();
    }
  };

  const handleCompleteLoading = () => {
    // Calculate the loading status
    const totalItems = loadingItems.length;
    const checkedItems = loadingItems.filter((item) => item.checked).length;
    const loadingPercentage = Math.floor((checkedItems / totalItems) * 100);

    let status = "Not Started";
    if (loadingPercentage === 100) {
      status = "Fully Loaded";
    } else if (loadingPercentage > 0) {
      status = "Partially Loaded";
    }

    // Call the parent component with the updated status
    onLoadStatusChange(status, loadingPercentage);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            Route #{routeNumber} Loading Sheet
          </Typography>
          <Chip
            label={allItemsChecked ? "All Items Checked" : "Items Pending"}
            color={allItemsChecked ? "success" : "warning"}
          />
        </Box>
      </DialogTitle>{" "}
      <DialogContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Please check off all items as you load them into your vehicle
        </Typography>

        {/* QR Code Scanner Section */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant={scanMode ? "contained" : "outlined"}
            color={scanMode ? "secondary" : "primary"}
            onClick={handleToggleScanMode}
            startIcon={scanMode ? <QrCodeIcon /> : <QrCodeScannerIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            {scanMode ? "Exit Scan Mode" : "Scan QR Code"}
          </Button>

          {scanMode && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Scan QR Code or Enter Order ID
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  inputRef={scanInputRef}
                  fullWidth
                  label="Order ID / QR Code"
                  variant="outlined"
                  size="small"
                  value={scannedCode}
                  onChange={handleScanCodeChange}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  error={!!scanError}
                  placeholder="Scan or type order ID"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={handleScanComplete}
                        color="primary"
                      >
                        <QrCodeScannerIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Box>

              {scanError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {scanError}
                </Alert>
              )}

              {scanSuccess && (
                <Alert severity="success" sx={{ mb: 1 }}>
                  Item successfully marked as loaded!
                </Alert>
              )}

              <Typography variant="caption" color="text.secondary">
                Tip: You can use a barcode/QR scanner device or manually enter
                the order ID
              </Typography>
            </Paper>
          )}
        </Box>

        <Paper
          variant="outlined"
          sx={{ mb: 2, maxHeight: 400, overflow: "auto" }}
        >
          <List dense>
            {loadingItems.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => handleToggleItem(item.id)}
                sx={{
                  bgcolor: item.checked ? "success.50" : "transparent",
                  "&:hover": {
                    bgcolor: item.checked ? "success.100" : "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.checked}
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body1" fontWeight="medium">
                          Stop {item.sequenceNumber}
                        </Typography>
                        <Chip
                          label={`${item.parcelCount} items`}
                          size="small"
                          sx={{ ml: 1, fontSize: "0.7rem" }}
                        />
                      </Box>
                      <Tooltip title="Order ID/QR Code">
                        <Chip
                          icon={<QrCodeIcon fontSize="small" />}
                          label={item.id.slice(-6)}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      </Tooltip>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.primary"
                      >
                        {item.recipientName}
                      </Typography>
                      <br />
                      <Typography variant="caption" component="span" noWrap>
                        {item.address}
                      </Typography>
                    </>
                  }
                  secondaryTypographyProps={{
                    sx: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleMarkAllLoaded}
            startIcon={<CheckCircleIcon />}
          >
            Mark All Loaded
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteLoading}
            disabled={loadingItems.length === 0}
          >
            Complete Loading
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DriverLoadingSheet;
