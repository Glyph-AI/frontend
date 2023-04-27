import { createTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0F5FD7',
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
  palette: {
    mode: 'light',
    primary: {
      main: "#4E5664",
    },
    secondary: {
      main: '#0F5FD7',
    },
    background: {
      default: "#dbeaea"
    }
  },
});
