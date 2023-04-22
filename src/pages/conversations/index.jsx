import React, { useState, useEffect, useRef } from 'react';
import {
    ConversationList,
    Conversation,
    Search,
    Avatar
} from '@chatscope/chat-ui-kit-react';
import {
    Box,
    Fab
} from '@mui/material'

import ConversationItem from '@/components/conversations/conversationItem';
import Layout from '@/components/utility/layout';
import { Add } from '@mui/icons-material';
import NewConversationModal from '@/components/conversations/newConversationModal';
import { getRequest } from '@/components/utility/request_helper';
import { motion } from "framer-motion";

export default function Conversations() {
    const [modalVisible, setModalVisible] = useState(false)
    const [userChats, setUserChats] = useState([])

    const getChats = () => {
        getRequest("/chats", (data) => {
            setUserChats(data)
        })
    }

    useEffect(() => {
        getChats()
    }, [])

    const formatLastMessage = (message) => {
        const sender = message.role == "user" ? "You" : "Glyph"
        const formatted_message = `${sender}: ${message.content}`
        if (sender === "You") {
            return (<i>{formatted_message}</i>)
        }

        return formatted_message
    }

    const handleModalClose = () => {
        setModalVisible(false)
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
                    <Box sx={{ height: "5%" }}>
                        <Search placeholder="Search..." style={{ width: "100%" }} />
                    </Box>

                    <ConversationList style={{ height: "95%", overflowY: "scroll", paddingRight: "25px", boxSizing: "content-box", width: "100%" }}>
                        {
                            userChats && userChats.map((record, idx) => {
                                console.log(record.chat_messages[-1])
                                const last_message = record.chat_messages[record.chat_messages.length - 1]
                                return (
                                    <ConversationItem
                                        name={record.name}
                                        info={formatLastMessage(last_message)}
                                        id={record.id}
                                    />
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