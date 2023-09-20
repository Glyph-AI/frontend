import { Masonry } from "@mui/lab";
import { Box, Paper, SwipeableDrawer } from "@mui/material";
import { useEffect, useState } from "react";
import { getStoreBots } from "../api/bots";
import { Puller } from "../chats/newChatModal";
import BaseHeader from "../utility/headers/baseHeader";
import BotCard from "./botCard";

export default function BotStoreModal({ open, handleClose, handleOpen }) {
    const [storeBots, setStoreBots] = useState([])

    useEffect(() => {
        getStoreBots(setStoreBots)
    }, [])

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={handleClose}
            disableSwipeToOpen={false}
            onOpen={handleOpen}
            hideBackdrop
            ModalProps={{
                keepMounted: true,
            }}
            swipeAreaWidth={112}
            sx={{
                height: "100%",
                "& .MuiDrawer-paper": {
                    height: "50%"
                },
            }}
        >
            <Paper
                elevation={7}
                sx={{
                    position: 'absolute',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    visibility: 'visible',
                    right: 0,
                    left: 0,
                    top: "-112px",
                    transition: "all .3s ease-out",
                    height: "130%",
                    borderRadius: "4px",
                }}>

                <Box sx={{ height: "112px", paddingBottom: "64px", position: "absolute", width: "100%", flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box className="pullerContainer" sx={{ width: "100%", display: "flex", justifyContent: "center", zIndex: 1300 }}>
                        <Puller />
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <BaseHeader title="Bot Store" showSearch={open} showProfile={false} />
                    </Box>
                </Box>
                <Box
                    sx={{
                        height: "100%",
                        px: 1,
                        overflow: 'auto',
                        pt: 8,
                        pb: 8
                    }}
                >
                    <Box
                        sx={{
                            // padding: "8px",
                            width: "100%",
                            height: "95%",
                            overflowY: "scroll",
                            display: "flex",
                            justifyContent: "center",
                            boxSizing: "content-box"
                        }}
                    >
                        <Masonry columns={2} spacing={2} sx={{ display: "-webkit-box", minHeight: "90%", pb: "50px" }}>
                            {
                                storeBots.map((item, idx) => {
                                    return (<BotCard key={idx} bot={item} isStore={true} />)
                                })
                            }
                        </Masonry>
                    </Box>
                </Box>
            </Paper>

        </SwipeableDrawer>
    )
}