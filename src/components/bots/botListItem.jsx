import { ChevronRight, SmartToy } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useRouter } from "next/router";

export default function BotListItem({ bot, displayLink }) {
    const router = useRouter()

    const handleClick = () => {
        if (displayLink) {
            router.push(`/bots/${bot.id}`)
        }
    }

    return (
        <ListItem
            sx={{ cursor: "pointer", backgroundColor: "white" }}
            secondaryAction={
                displayLink && <IconButton>
                    <ChevronRight />
                </IconButton>
            }

            onClick={handleClick}
        >
            <ListItemAvatar>
                <Avatar>
                    <SmartToy />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={bot.name} />
        </ListItem>
    )
}