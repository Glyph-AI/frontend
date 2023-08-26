import { Box, Paper, Typography, useTheme } from "@mui/material";
import MessageContent from "./messageContent";

export default function OutgoingMessage({ content, borderRadius }) {
    const theme = useTheme()
    return (
        <Box className="outoing-msg-container" sx={{ display: "flex", justifyContent: "right" }}>
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.common.blue,
                    color: "white",
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "right",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: "8px 8px 8px 8px",
                    maxWidth: "80%"
                }}
            >
                {/* <Typography variant="body2">{content}</Typography> */}
                <MessageContent content={content} />
            </Paper>
        </Box>
    )
}