import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { IconButton, List, ListItem, ListItemText } from "@mui/material"
import { useState } from "react"

export default function BotToolList({ bot_id }) {
    const [listOpen, setListOpen] = useState(false)

    return (
        <List>
            <ListItem
                secondaryAction={
                    <IconButton edge="end">
                        {listOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                }
            >
                <ListItemText primary="Tools" secondary="Coming Soon!" />
            </ListItem>
        </List>
    )
}