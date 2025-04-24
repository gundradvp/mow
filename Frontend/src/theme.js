import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green for Meals on Wheels theme
      light: "#80e27e",
      dark: "#087f23",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2196F3", // Blue for accents
      light: "#6ec6ff",
      dark: "#0069c0",
      contrastText: "#fff",
    },
    error: {
      main: "#F44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default theme;
