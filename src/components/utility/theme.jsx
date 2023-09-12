import { createTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";

export const darkTheme = createTheme({
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
    mode: 'dark',
    common: {
      blue: "#2F80ED",
      darkBlue: "#1b1a57",
      subtitleBlue: "#4e5d7b",
      lightBlue: "#30d7f9",
      offWhite: "#e3e3e3",
      textSecondary: "#4F5E7B",
      selectedBackground: "rgba(47, 128, 237, 0.1)",
      backgroundGradient: "linear-gradient(180deg, rgb(0, 0, 0) 0%, rgb(12, 12, 12) 100%)"
    },
    primary: {
      main: '#2F80ED',
    },
    secondary: {
      main: "#4E5664",
    },
    success: {
      main: "#000000"
    }
  },
});

export const theme = createTheme({
  typography: {
    fontFamily: [
      "Kumbh Sans-Medium",
      "Helvetica"
    ],
    h6: {
      fontSize: "20px"
    },
    body: {
      color: "#1b1a57",
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
      lightBlue: "#30d7f9",
      lightBlueHighlight: "#A3F4FF",
      offWhite: "#e3e3e3",
      textSecondary: "#4F5E7B",
      selectedBackground: "rgba(47, 128, 237, 0.1)",
      backgroundGradient: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(244, 244, 244) 100%)"
    },
    primary: {
      main: "#2F80ED",
    },
    secondary: {
      main: '#4E5664',
    },
    background: {
      main: "#ffffff",
      secondary: "#f7f7f7"
    }
  },
});
