import { Alert, AlertTitle, Divider, Paper, Snackbar } from "@mui/material"
import ChatHeader from "../utility/headers/chatHeader"
import MessageContainer from "./messageContainer"
import ToolDrawer from "./toolDrawer"
import MessageInput from "./messageInput"
import { useEffect, useRef, useState } from "react"
import { sendMessage } from "../api/chats"

export default function ChatsContainer({ bot, setBot, user, chat, desktopMode }) {
    const [glyphTyping, setGlyphTyping] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [toolsExt, setToolsExt] = useState(false)
    const [chatData, setChatData] = useState([])
    const [ttsActive, setTtsActive] = useState(false)
    const inputRef = useRef();
    const showTts = user.conversation_mode

    useEffect(() => {
        setChatData(formatChatData(chat.chat_messages))
    }, [chat])

    const formatSentTime = (sentTime) => {
        var currentDateTime = Date.now()
        if ((currentDateTime - sentTime) <= (1 * 60 * 1000)) {
            return "Just now"
        } else {
            return sentTime
        }
    }

    const roleFormatter = (role) => {
        if (role === "assistant") {
            return "Glyph"
        } else if (role === "system") {
            return "system"
        } else {
            return "You"
        }
    }

    const directionFormatter = (role) => {
        if (role === "assistant") {
            return "incoming"
        } else if (role === "system") {
            return "incoming"
        } else {
            return "outgoing"
        }
    }

    const formatChatData = (dbChats) => {
        if (typeof dbChats === "undefined") {
            return []
        }
        const formattedChats = dbChats.filter((dbMessage) => (!dbMessage.hidden)).map((dbMessage, index) => ({
            content: dbMessage.content,
            sender: roleFormatter(dbMessage.role),
            sentTime: formatSentTime(dbMessage.created_at),
            direction: directionFormatter(dbMessage.role),
            tts: dbMessage.tts,
            id: dbMessage.id
        })).sort((a, b) => new Date(a.sentTime) - new Date(b.sentTime))

        return formattedChats
    }

    const renderBotSettings = () => {
        if (user.id === bot.creator_id) {
            return true
        }

        return false
    }

    const outOfMessagesError = () => {
        if (user.subscribed && user.messages_left <= 0) {
            return "You are out of messages for the month."
        } else {
            return "You are out of free messages! Please subscribe to continue using Glyph!"
        }
    }



    const messageInputDisabled = () => {
        if (user.messages_left <= 0) {
            return true
        }

        return false
    }

    const handleNewMessage = (ev) => {
        ev.preventDefault()
        const newMessageJson = {
            role: "user",
            content: newMessage,
            chat_id: chat.id,
            tts: false
        }
        setGlyphTyping(true)
        setTtsActive(false)
        const newChatData = [...chatData, { content: newMessage, sender: "You", sentTime: "Just now", direction: "outgoing" }]
        setChatData(newChatData)
        setNewMessage("")

        sendMessage(JSON.stringify(newMessageJson), chat.id, (data) => {
            const newChatData = formatChatData(data.chat_messages)
            setChatData(newChatData)
            setGlyphTyping(false)
        })

        inputRef.current.focus();
    }


    return (
        <div style={{ position: "relative", height: "100%" }}>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={user.messages_left <= 0}
                onClick={() => { router.push("/profile") }}
            >
                <Alert severity="error">
                    <AlertTitle>Out of Messages!</AlertTitle>
                    {outOfMessagesError()} Click Here to subscribe!
                </Alert>
            </Snackbar>
            <ChatHeader bot={bot} user={user} chat={chat} desktopMode={desktopMode} />
            <MessageContainer messageArray={chatData} typingIndicator={glyphTyping} toolsExt={toolsExt} renderSettings={renderBotSettings()} desktopMode={desktopMode} />
            <Paper elevation={desktopMode ? 0 : 5} sx={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: "white" }}>
                {
                    renderBotSettings() && (
                        <ToolDrawer desktopMode={desktopMode} bot={bot} setBot={setBot} setToolsExt={setToolsExt} toolsExt={toolsExt} user={user} />
                    )
                }
                <Divider sx={{ width: "100%" }} />
                <MessageInput
                    user={user}
                    onSubmit={handleNewMessage}
                    desktopMode={desktopMode}
                    inputProps={
                        {
                            disabled: messageInputDisabled(),
                            onChange: (ev) => { setNewMessage(ev.target.value) },
                            value: newMessage,
                            ref: inputRef,
                        }
                    }
                    sendProps={
                        {
                            disabled: messageInputDisabled()
                        }

                    }
                />
            </Paper>
        </div >
    )
}