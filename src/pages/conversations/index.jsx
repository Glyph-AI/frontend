import React, { useState, useEffect, useRef } from 'react';
import {
    ConversationList,
    Conversation,
    Search,
} from '@chatscope/chat-ui-kit-react';
import {
    Box,
    Fab,
    Divider,
    Avatar
} from '@mui/material'
import { getCookie } from '@/components/utility/cookie_helper';

import ConversationItem from '@/components/conversations/conversationItem';
import Layout from '@/components/utility/layout';
import { Add } from '@mui/icons-material';
import NewConversationModal from '@/components/conversations/newConversationModal';
import { getRequest } from '@/components/utility/request_helper';
import { motion } from "framer-motion";
import { useRouter } from 'next/router';

export default function Conversations() {
    const [modalVisible, setModalVisible] = useState(false)
    const [userChats, setUserChats] = useState([])
    const [displayChats, setDisplayChats] = useState([])
    const [searchValue, setSearchValue] = useState([])
    const router = useRouter()

    const getChats = () => {
        getRequest("/chats", (data) => {
            setUserChats(data)
            setDisplayChats(data)
        })
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }
        getChats()
    }, [])

    const formatLastMessage = (message) => {
        if (message === undefined) {
            return <i>Start Chatting...</i>
        }
        const sender = message.role == "user" ? "You" : "Glyph"
        const formatted_message = `${sender}: ${message.content}`
        if (sender === "You") {
            return (<i>{formatted_message}</i>)
        }

        return formatted_message
    }

    const searchFunction = (searchTerm, array) => {
        return array.filter(chat => (chat.name.includes(searchTerm) || chat.chat_messages.filter(m => m.content.includes(searchTerm)).length > 0))
    }

    const handleSearchValueChange = (newValue) => {
        setSearchValue(newValue)
        const newDisplayChats = searchFunction(newValue, userChats)
        setDisplayChats(newDisplayChats)
    }

    const handleModalClose = () => {
        setModalVisible(false);
        getChats()
    }

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
                <Box sx={{ height: "100%", padding: "8px", overflow: "hidden" }}>
                    <Box sx={{ height: "5%", display: "flex", marginBottom: "16px", alignContent: "center" }}>
                        <Search placeholder="Search..." style={{ flex: 1 }} value={searchValue} onChange={(val) => { handleSearchValueChange(val) }} />
                        <Avatar
                            onMouseEnter={(e) => { e.target.style.cursor = "pointer" }}
                            sx={{ marginLeft: "16px", width: 40, height: 40 }}
                            alt="User"
                            onClick={() => { router.push("/profile") }}
                        />
                    </Box>

                    <ConversationList style={{ height: "95%", overflowY: "scroll", paddingRight: "25px", boxSizing: "content-box", width: "100%" }}>
                        {
                            displayChats && displayChats.map((record, idx) => {
                                const last_message = record.chat_messages[record.chat_messages.length - 1]
                                return (
                                    <>
                                        <ConversationItem
                                            name={record.name}
                                            info={formatLastMessage(last_message)}
                                            id={record.id}
                                        />
                                        <Divider component="li" />
                                    </>
                                )
                            })
                        }
                    </ConversationList>
                    <Fab onClick={() => { setModalVisible(true) }} variant="extended" sx={{ position: 'absolute', bottom: 32, right: 16 }} >
                        <Add sx={{ mr: 1 }} />
                        New Chat
                    </Fab>
                    <NewConversationModal open={modalVisible} handleClose={handleModalClose} />
                </Box>
            </motion.div>
        </Layout>
    )
}