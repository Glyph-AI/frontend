import { Box, Paper, Typography, useTheme } from "@mui/material";

export default function OutgoingMessage({content, borderRadius}) {
    const theme = useTheme()
    return (
        <Box className="outoing-msg-container" sx={{paddingLeft: "30%"}}>
            <Paper 
            elevation={0}
                sx={{
                    backgroundColor: theme.palette.common.blue, 
                    color: "white", 
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