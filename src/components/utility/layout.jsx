import { theme, darkTheme } from './theme.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material';

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}