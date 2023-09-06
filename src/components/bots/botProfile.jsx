import { Box, SwipeableDrawer, Typography } from "@mui/material";
import { Puller, StyledBox } from "../conversations/newConversationModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBot } from "../api/bots";

export default function BotProfile({ open, setOpen, handleClose }) {
    const [bot, setBot] = useState({})
    const searchParams = useSearchParams()
    useEffect(() => {
        let bot_id = searchParams.get("bot_id")
        if (bot_id === undefined || bot_id === null) {
            setOpen(false)
        } else {
            getBot(bot_id, setBot)
        }



    })

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={handleClose}
            onOpen={() => { }}
            ModalProps={{
                keepMounted: true
            }}
            sx={{ "& .MuiPaper-root": { height: "100%" } }}
        >
            <StyledBox
                sx={{
                    position: 'absolute',
                    top: 10,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    visibility: 'visible',
                    right: 0,
                    left: 0,
                    marginBottom: "8px"
                }}
            >
                <Puller />
            </StyledBox>
            <Box
                sx={{ padding: "16px" }}
            >

                <Box sx={{ marginTop: "24px" }}>
                    <Typography variant="h5">{bot.name}</Typography>
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}