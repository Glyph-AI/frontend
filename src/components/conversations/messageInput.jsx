import { Mic, Send } from "@mui/icons-material";
import { Box, Divider, IconButton, TextField, useTheme } from "@mui/material";

export default function MessageInput() {
    const theme = useTheme()
    return (
        <Box 
            component="form"
            sx={{
                height: "56px", 
                fontSize: "16px", 
                display: "flex", 
                alignItems: "center",
                padding: "0px 8px 0px 8px",
                width: "100%",
                backgroundColor: "white",
                '& .MuiTextField-root': { m: 1, width: '35ch' }
            }}
        >
            <Divider/>
            <TextField 
                size="small" 
                placeholder="Write a message..." 
                multilline
                sx={{
                    width: "75%",
                    input: {
                        color: theme.palette.common.darkBlue,
                        fontWeight: 400
                    }
                }}
            />
            <IconButton sx={{marginRight: "8px"}}>
                <Send/>
            </IconButton>
            <IconButton sx={{backgroundColor: theme.palette.common.blue}}>
                <Mic sx={{color: "white"}}/>
            </IconButton>
        </Box>
    )
}