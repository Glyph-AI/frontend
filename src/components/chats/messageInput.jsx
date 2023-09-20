import { Mic, Send } from "@mui/icons-material";
import { Box, Divider, IconButton, TextField, useTheme } from "@mui/material";

export default function MessageInput({ user, inputProps, sendProps, onSubmit, desktopMode }) {
    const theme = useTheme()
    return (
        <Box
            component="form"
            sx={{
                height: "56px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                padding: "0px 8px 0px 0px",
                width: "100%",
                borderRadius: desktopMode ? "0 0 16px 16px" : 0,
                backgroundColor: desktopMode ? theme.palette.background.secondary : theme.palette.background.main,
                '& .MuiTextField-root': { m: 1, width: '35ch' }
            }}
            onSubmit={onSubmit}
        >
            <Divider />
            <TextField
                size="small"
                name="message"
                placeholder="Write a message..."
                multilline
                sx={{
                    flex: 1,
                    input: {
                        color: theme.palette.common.darkBlue,
                        fontWeight: 400,
                        pl: "8px"
                    }
                }}
                {...inputProps}
            />
            <IconButton name="submit" type="submit" {...sendProps} sx={{ marginRight: "8px" }}>
                <Send />
            </IconButton>
            {
                user.conversation_mode && (
                    <IconButton sx={{ backgroundColor: theme.palette.common.blue }}>
                        <Mic sx={{ color: "white" }} />
                    </IconButton>
                )
            }

        </Box>
    )
}