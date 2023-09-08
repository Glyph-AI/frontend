import { Box, Paper, Typography, useTheme } from "@mui/material";
import MessageContent from "./messageContent";

export default function IncomingMessage({ content, borderRadius, ...props }) {
    const theme = useTheme()
    return (
        <Box className="incoming-msg-container" sx={{ display: "flex", justifyContent: "left" }} {...props}>
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.common.offWhite,
                    color: theme.palette.common.darkBlue,
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "left",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: "8px 8px 8px 8px",
                    maxWidth: "80%"
                }}
            >
                <MessageContent content={content} />
            </Paper>
        </Box>
    )
}