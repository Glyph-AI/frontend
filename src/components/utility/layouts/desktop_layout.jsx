import { Box, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { theme } from "../theme";

export default function DesktopLayout({ children }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? theme : theme}>
            <CssBaseline />
            <Box sx={{ backgroundColor: "#f7f7f7", height: "100%", p: "32px 24px" }}>
                {children}
            </Box>
        </ThemeProvider>
    )
}   