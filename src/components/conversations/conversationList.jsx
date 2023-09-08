import { Avatar, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Delete } from "@mui/icons-material"
import { StyledListItem } from "../utility/styled/styledListItem"
import { StyledList } from "../utility/styled/styledList"


function ChatListItem({ chat }) {
    const [secondaryAction, setSecondaryAction] = useState(null)
    const [inContext, setInContext] = useState(false)
    const theme = useTheme()
    const unreadBackground = "rgba(47, 128, 237, 0.1)"
    const unread = chat.last_message.role !== "user"
    const router = useRouter()

    useEffect(() => {
        setSecondaryAction(defaultSecondaryAction())
    }, [])

    const defaultSecondaryAction = () => {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                <Typography variant="body2" sx={{ opacity: 0.6, pt: "2px", textAlign: "center", width: "100%", paddingRight: "8px" }}>{formatTime()}</Typography>
            </Box>
        )
    }

    const contextSecondaryAction = () => {
        return (
            <Delete />
        )
    }

    const formatLastMessage = (message, bot_name) => {
        if (message === null) {
            return <i>Start Chatting...</i>
        }
        const sender = message.role == "user" ? "You" : bot_name
        const formatted_message = `${sender}: ${message.content}...`
        if (sender === "You") {
            return (<i>{formatted_message}</i>)
        }

        return formatted_message
    }

    const formatTime = () => {
        var lastDate = new Date(chat.last_message.created_at)
        var currDate = new Date()
        var diff = (currDate - lastDate) / (1000 * 3600 * 24)

        if (diff < 1) {
            return `${lastDate.getHours()}.${lastDate.getMinutes()}`
        } else if (diff < 2) {
            return "Yesterday"
        } else {
            return `${Math.round(diff)} Days Ago`
        }
    }

    const handleRightClick = (ev) => {
        ev.preventDefault()
        if (inContext) {
            setInContext(false)
            setSecondaryAction(defaultSecondaryAction())
        } else {
            setInContext(true)
            setSecondaryAction(contextSecondaryAction())
        }

    }

    const backgroundColor = () => {
        if (inContext) {
            return "rgba(256, 0, 0, 0.2)"
        } else if (unread) {
            return unreadBackground
        }
    }

    return (
        <StyledListItem
            sx={
                {
                    backgroundColor: backgroundColor,
                    transition: "all 0.3s ease-out"
                }
            }
            secondaryAction={
                secondaryAction
            }
            onClick={() => router.push(`/chats/${chat.id}`)}
            onContextMenu={handleRightClick}
            inContext={inContext}
        >
            <ListItemButton disableRipple>
                <ListItemIcon>
                    <Avatar />
                </ListItemIcon>
                <ListItemText
                    sx={{ marginTop: 0, marginBottom: 0 }}
                    primaryTypographyProps={{ sx: { mb: "8px" } }}
                    primary={chat.name}
                    secondaryTypographyProps={
                        {
                            sx: { width: "85%", overflow: "hidden", maxHeight: "20px", textOverflow: "ellipsis", whiteSpace: "nowrap" }
                        }
                    }
                    secondary={formatLastMessage(chat.last_message, chat.bot.name)}
                />
            </ListItemButton>
        </StyledListItem>
    )

}

export default function ConversationList({ chats, setChats }) {
    return (
        <StyledList dense={false}>
            {
                chats.map((el, idx) => (
                    <ChatListItem
                        key={idx}
                        chat={el}
                    />
                ))
            }
        </StyledList>
    )
}