import { ChevronRight, SmartToy } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { useRouter } from "next/router";

export default function BotListItem({ bot }) {
    const router = useRouter()
    console.log("HERE")
    return (
        <ListItem
            secondaryAction={
                <IconButton>
                    <ChevronRight />
                </IconButton>
            }

            onClick={() => { router.push(`/bots/${bot.id}`) }}
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