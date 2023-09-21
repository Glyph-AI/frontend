import { Close } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { AppBar, Box, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getStoreBots } from "../api/bots";
import BotCard from "./botCard";

export default function DesktopStoreModal({ open, handleClose }) {
    const [storeBots, setStoreBots] = useState([])

    useEffect(() => {
        getStoreBots(setStoreBots)
    }, [])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Bot Store
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    height: "100%",
                    px: 1,
                    overflow: 'auto',
                    pt: 2,
                    pb: 8
                }}
            >
                <Box
                    sx={{
                        // padding: "8px",
                        width: "100%",
                        height: "95%",
                        overflowY: "scroll",
                        "-ms-overflow-style": "none",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            display: "none"
                        },
                        display: "flex",
                        justifyContent: "center",
                        boxSizing: "content-box"
                    }}
                >
                    <Masonry columns={6} spacing={2} sx={{ display: "-webkit-box", minHeight: "90%", pb: "50px" }}>
                        {
                            storeBots.map((item, idx) => {
                                return (<BotCard key={idx} bot={item} isStore={true} setBots={setStoreBots} />)
                            })
                        }
                    </Masonry>
                </Box>
            </Box>


        </Dialog>
    )
}