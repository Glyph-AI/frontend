import { Avatar, Box, Button, ButtonBase, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Delete } from "@mui/icons-material"
import { StyledListItem } from "../utility/styled/styledListItem"
import { StyledList } from "../utility/styled/styledList"


function ChatListItem({ chat, desktopMode }) {
    const [secondaryAction, setSecondaryAction] = useState(null)
    const [inContext, setInContext] = useState(false)
    const theme = useTheme()
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
        }
    }

    return (
        <ButtonBase sx={{ width: "100%" }}>
            <StyledListItem
                sx={
                    {
                        backgroundColor: backgroundColor,
                        transition: "all 0.3s ease-out",
                        "&:hover": {
                            background: "rgba(0, 0, 0, 0.04)"
                        }
                    }
                }
                secondaryAction={
                    secondaryAction
                }
                onClick={() => { desktopMode ? router.push(`${router.pathname}?chat_id=${chat.id}`) : router.push(`/chats/${chat.id}`) }}
                onContextMenu={handleRightClick}
                inContext={inContext}
            >
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
            </StyledListItem>
        </ButtonBase>
    )

}

export default function ChatList({ chats, setChats, desktopMode }) {
    return (
        <StyledList dense={false}>
            {
                chats.map((el, idx) => (
                    <ChatListItem
                        key={idx}
                        chat={el}
                        desktopMode={desktopMode}
                    />
                ))
            }
        </StyledList>
    )
}