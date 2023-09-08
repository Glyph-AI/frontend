import { Avatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { StyledList } from "../utility/styled/styledList";
import { StyledListItem } from "../utility/styled/styledListItem";
import { useState } from "react";
import { getUserBots } from "../api/bots";
import NewBotModal from "./newBotModal";
import { useRouter } from "next/router";

function CondensedBotListItem({ bot, ...props }) {
    return (
        <StyledListItem {...props}>
            <ListItemButton disableRipple>
                <ListItemIcon>
                    <Avatar src={bot.avatar_location || "/glyph-avatar.png"} />
                </ListItemIcon>
                <ListItemText
                    primary={bot.name}
                />
            </ListItemButton>
        </StyledListItem>
    )
}

export default function CondensedBotList({ bots, setBots, user }) {
    const [botModalVisible, setBotModalVisible] = useState(false)
    const [selectedBot, setSelectedBot] = useState(null)
    const router = useRouter()

    const handleBotProfileClose = () => {
        getUserBots(setBots)
        setBotModalVisible(false)
    }

    const handleBotClick = (item) => {
        setSelectedBot(item)
        setBotModalVisible(true)
        router.push(`/home?bot_id=${item.id}`)
    }

    return (
        <>
            <StyledList>
                {
                    bots && bots.map((item, idx) => {
                        return (
                            <CondensedBotListItem key={idx} onClick={() => { handleBotClick(item) }} bot={item} />
                        )
                    })
                }
            </StyledList>
            <NewBotModal
                user={user}
                editMode={true}
                handleClose={handleBotProfileClose}
                open={botModalVisible}
            />
        </>
    )
}