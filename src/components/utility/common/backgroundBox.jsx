import { Box, useTheme } from "@mui/material";

export default function BackgroundBox({ children, sx, innerRef, ...props }) {
    const theme = useTheme()
    return (
        <Box sx={{ background: theme.palette.common.backgroundGradient, height: "calc(100% - 56px)", ...sx }} ref={innerRef} {...props}>
            {children}
        </Box>
    )
}