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
    Collapse,
    Popover,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon
} from '@mui/material'

import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { useRouter } from 'next/router';
import { Delete, MoreVert } from '@mui/icons-material';
import { genericRequest } from '../utility/request_helper';


export default function ConversationItem({ name, info, id, bot, getChats }) {
    const [chatsVisible, setChatsVisible] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const router = useRouter()
    console.log(bot)

    const contextHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
    }

    const handleDelete = () => {
        genericRequest(`/chats/${id}`, "DELETE", null, () => {
            setAnchorEl(null)
            getChats()
        })
    }

    const popoverOpen = Boolean(anchorEl)
    
    return (
        <>
            <Conversation name={name} style={{ marginTop: "2px" }} info={info} onClick={() => { router.push(`/chats/${id}`) }}>
                <Avatar src={bot.avatar_location || "/glyph-avatar.png"} name={bot.name} alt={bot.name} />
                <Conversation.Operations>
                    <IconButton onClick={(e) => {contextHandler(e)}}>
                        <MoreVert/>
                    </IconButton>
                </Conversation.Operations>
            </Conversation>
            <Menu 
                open={popoverOpen} 
                onClose={() => {setAnchorEl(null)}} 
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <Delete/>
                    </ListItemIcon>
                    <ListItemText>
                        Delete
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
}