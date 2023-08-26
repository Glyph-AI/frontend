import { Box, Paper, Typography, useTheme } from "@mui/material";

export default function IncomingMessage({content, borderRadius}) {
    const theme = useTheme()
    return (
        <Box className="incoming-msg-container" sx={{paddingRight: "30%"}}>
            <Paper 
                elevation={0}
                sx={{
                    backgroundColor: theme.palette.common.offWhite, 
                    color: theme.palette.common.darkBlue,
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column", 
                    position: "relative",
                    borderRadius: "8px 8px 8px 8px"
                }}
            >
                <Typography variant="body2">{content}</Typography>
            </Paper>
        </Box>
    )
}