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
import LayoutWithNav from '@/components/utility/layout_with_nav';
import { useUserContext } from '@/context/user';

export default function Conversations() {
    const [modalVisible, setModalVisible] = useState(false)
    const [userChats, setUserChats] = useState([])
    const [displayChats, setDisplayChats] = useState([])
    const [searchValue, setSearchValue] = useState([])
    const [user, setUser] = useState({})
    const router = useRouter()

    const getUser = () => {
        getRequest("/profile", (data) => {
            setUser(data)
        })
    }

    const getChatDateSafe = (chat) => {
        if (chat.chat_messages.length === 0) {
            return chat.created_at
        } else {
            return chat.chat_messages[chat.chat_messages.length - 1].created_at
        }
    }

    const sortChats = (chats) => {
        var chatsWithMessagesSorted = chats.map((item) => {
            item.chat_messages = item.chat_messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            return item
        })

        var sortedChats = chatsWithMessagesSorted.sort((a, b) => new Date(getChatDateSafe(b)) - new Date(getChatDateSafe(a)))
        return sortedChats

    }

    const getChats = () => {
        getRequest("/chats", (data) => {
            setUserChats(sortChats(data))
            setDisplayChats(sortChats(data))
        })
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }
        getChats()
        getUser()
    }, [])

    const formatLastMessage = (message, bot_name) => {
        if (message === undefined) {
            return <i>Start Chatting...</i>
        }
        const sender = message.role == "user" ? "You" : bot_name
        const formatted_message = `${sender}: ${message.content}`
        if (sender === "You") {
            return (<i>{formatted_message}</i>)
        }

        return formatted_message
    }

    const searchFunction = (searchTerm, array) => {
        return array.filter(chat => (chat.name.toLowerCase().includes(searchTerm) || chat.chat_messages.filter(m => m.content.toLowerCase().includes(searchTerm)).length > 0))
    }

    const handleSearchValueChange = (newValue) => {
        setSearchValue(newValue)
        const newDisplayChats = searchFunction(newValue, userChats)
        setDisplayChats(newDisplayChats)
    }

    const handleModalClose = () => {
        getRequest("/chats", (data) => {
            setUserChats(sortChats(data));
            setDisplayChats(sortChats(data));
            setModalVisible(false);
        })
    }

    return (
        <LayoutWithNav>
            <Box sx={{ height: "100%", padding: "8px", overflow: "hidden" }}>
                <Box sx={{ height: 40, display: "flex", marginBottom: "16px", alignContent: "center" }}>
                    <Search placeholder="Search..." style={{ flex: 1, fontSize: 16 }} value={searchValue} onChange={(val) => { handleSearchValueChange(val) }} />
                    <Avatar
                        onMouseEnter={(e) => { e.target.style.cursor = "pointer" }}
                        sx={{ marginLeft: "16px", width: 40, height: 40 }}
                        alt={user.first_name}
                        src={user.profile_picture_location}
                        onClick={() => { router.push("/profile") }}
                    />
                </Box>

                <ConversationList style={{ height: "95%", overflowY: "scroll", paddingRight: "25px", boxSizing: "content-box", width: "100%" }}>
                    {
                        displayChats && displayChats.map((record, idx) => {
                            const last_message = record.chat_messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[record.chat_messages.length - 1]
                            return (
                                <>
                                    <ConversationItem
                                        name={record.name}
                                        info={formatLastMessage(last_message, record.bot.name)}
                                        id={record.id}
                                        bot={record.bot}
                                        getChats={getChats}
                                    />
                                    <Divider component="li" />
                                </>
                            )
                        })
                    }
                </ConversationList>
                <Fab onClick={() => { setModalVisible(true) }} variant="extended" sx={{ position: 'absolute', bottom: 64, right: 16 }} >
                    <Add />
                </Fab>
                <NewConversationModal open={modalVisible} handleClose={handleModalClose} />
            </Box>
        </LayoutWithNav>
    )
}