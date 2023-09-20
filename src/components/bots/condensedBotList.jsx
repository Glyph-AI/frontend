import { Avatar, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { getUserBots } from "../api/bots";
import { StyledList } from "../utility/styled/styledList";
import { StyledListItem } from "../utility/styled/styledListItem";
import NewBotModal from "./newBotModal";

function CondensedBotListItem({ bot, ...props }) {
    return (
        <StyledListItem {...props} sx={{
            "&:hover": {
                background: "rgba(0, 0, 0, 0.04)"
            }
        }}>
            <ListItemIcon>
                <Avatar src={bot.avatar_location || "/glyph-avatar.png"} />
            </ListItemIcon>
            <ListItemText
                primary={bot.name}
            />
        </StyledListItem>
    )
}

export default function CondensedBotList({ bots, setBots, user, desktopMode }) {
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
        router.push(desktopMode ? `${router.pathname}?bot_id=${item.id}` : `/home?bot_id=${item.id}`)
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