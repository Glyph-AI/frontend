import { Box, useTheme } from "@mui/material";

export default function BackgroundBox({ children, sx }) {
    const theme = useTheme()
    return (
        <Box sx={{ ...sx, background: theme.palette.common.backgroundGradient, height: "calc(100% - 56px)" }}>
            {children}
        </Box>
    )
}