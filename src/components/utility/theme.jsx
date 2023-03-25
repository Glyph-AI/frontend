import { createTheme } from '@mui/material/styles';
import { grey } from "@mui/material/colors";

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b36b5',
    },
    secondary: {
      main: grey[900],
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
      main: grey[900],
    },
    secondary: {
      main: '#3b36b5',
    }
  },
});
