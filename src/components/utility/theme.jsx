import { createTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    common: {
      blue: "#2F80ED"
    },
    primary: {
      main: '#2F80ED',
    },
    secondary: {
      main: "#4E5664",
    },
    success: {
      main: "#00cb69"
    }
  },
});

export const theme = createTheme({
  typography: {
    fontFamily: [
      "Kumbh Sans-Medium",
      "Helvetica"
    ],
    body: {
      fontSize: "18px"
    },
    body2: {
      fontSize: "14px"
    }
  },
  palette: {
    mode: 'light',
    common: {
      blue: "#2F80ED",
      darkBlue: "#1b1a57",
      subtitleBlue: "#4e5d7b",
      offWhite: "#e3e3e3",
      textSecondary: "#4F5E7B",
      selectedBackground: "rgba(47, 128, 237, 0.1)"
    },
    primary: {
      main: "#2f80ed",
    },
    secondary: {
      main: '#4E5664',
    },
    background: {
      main: "#f7f7f7"
    }
  },
});
