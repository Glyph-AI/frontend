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


export default function ConversationItem({ name, info, id }) {
    const [chatsVisible, setChatsVisible] = useState(false)
    const router = useRouter()
    return (
        <>
            <Conversation name={name} style={{ marginTop: "2px" }} info={info} onClick={() => { router.push(`/chats/${id}`) }}>
                <Avatar src={"/glyph-avatar.png"} name={"Glyph"} />
            </Conversation>
        </>
    )
}