import { ChevronRight, SmartToy } from "@mui/icons-material";
import { Avatar, Card, CardContent, CardHeader, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function BotListItem({ bot, displayLink }) {
    const router = useRouter()

    const handleClick = () => {
        if (displayLink) {
            router.push(`/bots/${bot.id}`)
        }
    }

    return (
        <Card
            elevation={displayLink ? 10 : 2}
            onClick={handleClick}
        >
            <CardHeader
                sx={{ paddingBottom: 0 }}
                title={bot.name}
                action={
                    displayLink && <IconButton>
                        <ChevronRight />
                    </IconButton>
                }
            />
            <CardContent>
                <Typography variant="body2">
                    Persona: {bot.persona.name}
                </Typography>
                <Typography variant="body2">
                    Owned by: {displayLink ? "You" : "Another User"}
                </Typography>
            </CardContent>
        </Card>

    )
}