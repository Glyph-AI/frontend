import React, { useState, useEffect, useRef } from 'react';
import {
    Conversation,
    Avatar
} from '@chatscope/chat-ui-kit-react'
import {
    List,
    ListItem,
    ListItemText,
    Divider,
    Collapse
} from '@mui/material'

import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { useRouter } from 'next/router';


export default function ConversationItem({ name, info, id, bot }) {
    const [chatsVisible, setChatsVisible] = useState(false)
    const router = useRouter()
    console.log(bot)
    return (
        <>
            <Conversation name={name} style={{ marginTop: "2px" }} info={info} onClick={() => { router.push(`/chats/${id}`) }}>
                <Avatar src={bot.avatar_location || "/glyph-avatar.png"} name={bot.name} alt={bot.name} />
            </Conversation>
        </>
    )
}