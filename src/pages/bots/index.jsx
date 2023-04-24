import Layout from "@/components/utility/layout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { Divider, List, Fab, Box, Select, TextField } from "@mui/material";
import BotListItem from "@/components/bots/botListItem";
import { getRequest } from "@/components/utility/request_helper";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import NewBotModal from "@/components/bots/newBotModal";

export default function Bots() {
    const [userBots, setUserBots] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const router = useRouter()

    const getUserBots = () => {
        getRequest("/bots", (data) => {
            setUserBots(data)
        })
    }

    useEffect(() => {
        getUserBots()
    }, [])

    const handleModalClose = () => {
        setModalVisible(false);
        getUserBots()
    }

    console.log(userBots)

    return (
        <Layout>
            <motion.div
                variants={{
                    hidden: { opacity: 0, x: 200, y: 0 },
                    enter: { opacity: 1, x: 0, y: 0 },
                    exit: { opacity: 0, x: 0, y: 100 }
                }}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{
                    type: "linear"
                }}
                style={{ height: "100%" }}
            >
                <ConversationHeader >
                    <ConversationHeader.Back onClick={() => { router.push("/profile") }} />
                    <ConversationHeader.Content userName="Bots" />
                </ConversationHeader>
                <List>
                    {
                        userBots && userBots.map((item) => (
                            <>
                                <BotListItem bot={item} />
                                <Divider />
                            </>
                        ))
                    }
                </List>
                <Fab onClick={() => { setModalVisible(true) }} variant="extended" sx={{ position: 'absolute', bottom: 32, right: 16 }} >
                    <Add sx={{ mr: 1 }} />
                    Add Bot
                </Fab>
                <NewBotModal open={modalVisible} handleClose={handleModalClose} />
            </motion.div>
        </Layout>
    )
}