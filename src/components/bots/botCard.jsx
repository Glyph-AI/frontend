import { useTheme } from "@emotion/react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { addShared, getStoreBots } from "../api/bots";

export default function BotCard({ bot, isStore, setBots, CardProps }) {
    const ownedBackground = "rgba(47, 128, 237, 0.1)"
    const theme = useTheme()

    const handleSharingAdd = () => {
        addShared(bot.sharing_code, (data) => {
            getStoreBots(setBots)
        })
    }

    return (
        <Box {...CardProps} sx={{ width: "50%", backgroundColor: isStore ? theme.palette.background.secondary : ownedBackground, borderRadius: "8px", padding: "16px" }}>
            <Box sx={{ width: "100%", display: "flex" }}>
                <Box sx={{ marginRight: "8px" }}>
                    <Avatar src={bot.avatar_location || "/glyph-avatar.png"} sx={{ height: "36px", width: "36px" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: "500" }} variant="body">{bot.name}</Typography>
                </Box>
            </Box>
            <Box sx={{ width: "100%", display: "flex", marginTop: "10px" }}>
                <Box>
                    <Typography sx={{ fontStyle: bot.description ? "normal" : "italic", opacity: bot.description ? 1.0 : 0.6 }} variant="body2">{bot.description || "No Description"}</Typography>
                </Box>
            </Box>
            <Box sx={{ width: "100%", display: "flex", marginTop: "10px" }}>
                <Box>
                    <Typography color={theme.palette.common.textSecondary} sx={{ fontWeight: "700", opacity: "0.6" }} variant="body2">Shares: {bot.share_count}</Typography>
                </Box>
            </Box>
            {
                isStore && (
                    <Box sx={{ display: "flex", width: "100%", marginTop: "8px" }}>
                        {/* <Box sx={{ flex: 1, display: 'flex', alignItems: "center", width: "90%" }}>
                            <Button
                                startIcon={<Star />}
                                sx={{
                                    // padding: "4px 8px", 
                                    width: "46px",
                                    height: "28px",
                                    fontSize: "14px",
                                    color: "white",
                                    minWidth: 0,
                                    backgroundColor: theme.palette.common.textSecondary,
                                    "& .MuiButton-startIcon": {
                                        marginRight: "0",
                                    }
                                }}
                            >
                                12
                            </Button>
                        </Box> */}
                        <Box sx={{ display: 'flex', alignItems: "center", }}>
                            <Button
                                sx={{
                                    float: "right",
                                    fontSize: "14px",
                                    width: "46px",
                                    height: "28px",
                                    color: "white",
                                    minWidth: 0,
                                    backgroundColor: theme.palette.common.blue,
                                }}
                                onClick={handleSharingAdd}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                )
            }
        </Box>
    )
}