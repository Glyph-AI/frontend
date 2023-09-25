import { ArrowBack, InfoOutlined, MoreVert, Notifications } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { StyledList } from "../styled/styledList";
import { StyledListItem } from "../styled/styledListItem";
import { StyledSwitch } from "../styled/styledSwitch";

export default function GlyphImageHeader() {
    const theme = useTheme()
    const router = useRouter()
    return (
        <Box sx={{ backgroundColor: "white" }}>
            <Box sx={{ height: "100px", width: "100%" }} />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar src={"/glyph-avatar.png"} sx={{ width: "100%", height: "100%" }} />
            </Box>
            <Box sx={{ pt: 2, pl: 2, display: 'flex', alignItems: "center" }}>
                <IconButton onClick={() => router.back()}>
                    <ArrowBack />
                </IconButton>
                <Box sx={{ display: "flex", pr: 2, justifyContent: "center", flex: 1 }}>
                    <Typography variant="h6">Glyph</Typography>
                </Box>
                <IconButton onClick={() => router.push("/profile")}>
                    <MoreVert />
                </IconButton>
            </Box>
            <Box sx={{ pt: 4 }}>
                <StyledList>
                    <StyledListItem
                        isButton={true}
                        onClick={() => { router.push("https://discord.com/channels/1103348778104279110/1107050513696030871/1126965614930571356") }}
                        sx={{ pl: 4 }}
                    >
                        <ListItemIcon>
                            <InfoOutlined />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography color={theme.palette.common.subtitleBlue} variant="body2">
                                Need help? Get support on our discord here
                            </Typography>
                        </ListItemText>
                    </StyledListItem>
                    <StyledListItem
                        sx={{ pl: 4 }}
                        secondaryAction={
                            <Box sx={{ pr: 2 }}>
                                <StyledSwitch />
                            </Box>
                        }
                    >
                        <ListItemIcon>
                            <Notifications />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography color={theme.palette.common.subtitleBlue} variant="body2">
                                Notifications
                            </Typography>
                        </ListItemText>
                    </StyledListItem>
                </StyledList>
            </Box>
            <Divider sx={{ width: "100%", mb: 2 }} />
        </Box>
    )
}