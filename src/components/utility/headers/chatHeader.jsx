import { ArrowBack, MoreVert } from "@mui/icons-material";
import { AppBar, Avatar, Box, Divider, IconButton, Toolbar, Typography, styled, useTheme } from "@mui/material";

export default function ChatHeader({bot}) {
    const theme = useTheme()
    return (
        <>
        <AppBar 
            position="sticky" 
            elevation={0} 
            sx={{
                backgroundColor: theme.palette.background.main,
                color: theme.palette.common.darkBlue,
                fontWeight: 500
            }}
        >
            <Toolbar sx={{pl: 0}}>
                <IconButton  sx={{color: theme.palette.common.darkBlue}}>
                    <ArrowBack/>
                </IconButton>
                <Avatar src={"/glyph-avatar.png"}/>
                <Box sx={{paddingLeft: "8px", width: "80%"}}>
                    <Typography variant="body" sx={{color: theme.palette.common.darkBlue}}>Mialee</Typography>
                    <Typography variant="body2" sx={{color: theme.palette.common.subtitleBlue}}>3 tools, 2 files, 1 note</Typography>
                </Box>
                <IconButton edge="end">
                    <MoreVert/>
                </IconButton>
            </Toolbar>
            <Divider sx={{width: "100%"}}/>
        </AppBar>

        </>
    )
}