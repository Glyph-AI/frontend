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


export default function ConversationItem({name, info, id}) {
    const [ chatsVisible, setChatsVisible] = useState(false)
    const router = useRouter()
    return (
        <>
        <Conversation name={name} info={info} onClick={() => {router.push(`/chats/${id}`)}}>
            <Avatar src={"/glpyh-avatar.png"} name={"Glyph"} />
            {/* <Conversation.Operations>
                {chatsVisible ? <ExpandLess /> : <ExpandMore />}
            </Conversation.Operations> */}
        </Conversation>
        {/* <Collapse in={chatsVisible}>
            <List>
                <ListItem>
                    <ListItemText>TESTTEST</ListItemText>
                </ListItem>
            </List>
        </Collapse> */}
        
        </>
    )
}