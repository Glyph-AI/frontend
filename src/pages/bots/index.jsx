import Layout from "@/components/utility/layout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { Divider, List, Fab, Box, Select, TextField, Typography } from "@mui/material";
import BotListItem from "@/components/bots/botListItem";
import { getRequest } from "@/components/utility/request_helper";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import NewBotModal from "@/components/bots/newBotModal";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { Masonry } from "@mui/lab";

export default function Bots() {
    const [userBots, setUserBots] = useState([])
    const [user, setUser] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [urlBotCode, setUrlBotCode] = useState(null)
    const router = useRouter()

    const getUserBots = () => {
        getRequest("/bots", (data) => {
            setUserBots(data)
        })

        getRequest("/profile", (data) => {
            setUser(data)
        })
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }

        getUserBots()

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== null) {
            setUrlBotCode(bot_code)
            setModalVisible(true)
        }
    }, [])

    const handleModalClose = () => {
        setModalVisible(false);
        getUserBots()
    }

    return (
        <LayoutWithNav>
            <Box
                sx={{
                    padding: "8px",
                    width: "100%",
                    height: "95%",
                    overflowY: "scroll",
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Masonry
                    columns={1}
                    spacing={2}
                    sx={{ minHeight: "90%" }}
                >
                    {
                        userBots && userBots.map((item) => (
                            <BotListItem bot={item} displayLink={item.creator_id == user.id} />
                        ))
                    }
                </Masonry>
            </Box>

            {
                Math.abs(user.bots_left) > 0 && (
                    <Fab onClick={() => { setModalVisible(true) }} sx={{ position: 'absolute', bottom: 64, right: 16 }} >
                        <Add />
                    </Fab>
                )
            }

            <NewBotModal urlBotCode={urlBotCode} open={modalVisible} handleClose={handleModalClose} />
        </LayoutWithNav>
    )
}