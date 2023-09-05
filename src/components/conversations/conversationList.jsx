import { Avatar, Box, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Typography, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { StyledList } from "../utility/common/dataSelectTabs"


export const StyledListItem = styled(ListItem)(() => ({
    borderRadius: "8px",
    width: "100%",
    paddingLeft: "8px",
    "& .MuiListItemButton-root": {
        padding: "0"
    },
    "& .MuiListItemSecondaryAction-root": {
        right: "0px",
        height: "100%",
        paddingTop: "8px",
        paddingRight: "4px"
    }
}))

function ChatListItem({ chat }) {
    const theme = useTheme()
    const unreadBackground = "rgba(47, 128, 237, 0.1)"
    const unread = chat.last_message.role !== "user"
    const router = useRouter()

    const formatLastMessage = (message, bot_name) => {
        if (message === null) {
            return <i>Start Chatting...</i>
        }
        const sender = message.role == "user" ? "You" : bot_name
        const formatted_message = `${sender}: ${message.content.slice(0, 20)}...`
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

    return (
        <StyledListItem
            sx={
                {
                    backgroundColor: unread ? unreadBackground : null,
                }
            }
            secondaryAction={
                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    <Typography variant="body2" sx={{ opacity: 0.6, pt: "2px", textAlign: "center", width: "100%", paddingRight: "8px" }}>{formatTime()}</Typography>
                </Box>

            }
            onClick={() => router.push(`/chats/${chat.id}`)}
        >
            <ListItemButton disableRipple>
                <ListItemIcon>
                    <Avatar />
                </ListItemIcon>
                <ListItemText
                    sx={{ marginTop: 0, marginBottom: 0 }}
                    primaryTypographyProps={{ sx: { mb: "8px" } }}
                    primary={chat.name}
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
                chats.map((el) => (
                    <ChatListItem
                        chat={el}
                    />
                ))
            }
        </StyledList>
    )
}