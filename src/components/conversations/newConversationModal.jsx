import React, { useState, useEFfect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    SwipeableDrawer,
    useTheme,
    styled,
    ListItemIcon,
    Avatar,
    ListItemText,
    IconButton
} from '@mui/material'
import { useEffect } from 'react';
import { grey } from '@mui/material/colors';
import { getUserBots } from '../api/bots';
import { StyledListItem } from './conversationList';
import { ItemCreate, StyledList } from '../utility/common/dataSelectTabs';
import { Add } from '@mui/icons-material';
import { createChat } from '../api/chats';

export const StyledBox = styled(Box)(({ theme }) => {
    const theme = useTheme()
    return ({
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
    })
});

export const Puller = styled(Box)(({ theme }) => {
    const theme = useTheme()
    return ({
        width: 30,
        height: 6,
        backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
    })
});

export default function NewConversationModal({ open, handleClose, updateUserFunc, user }) {
    const [bot, setBot] = useState(null)
    const [userBots, setUserBots] = useState([])
    const [conversationName, setConversationName] = useState("")
    const [showCreation, setShowCreation] = useState(false)
    const theme = useTheme()

    const createNewChat = () => {
        const data = {
            name: conversationName,
            bot_id: bot.id,
            bot: bot
        }

        createChat(data, handleClose)
    }

    const handleCreate = () => {
        createNewChat();
        updateUserFunc()
    }

    const buttonDisabled = () => {
        if (conversationName !== null && bot !== null) {
            return false
        }

        return true
    }

    useEffect(() => {
        getUserBots(setUserBots)
    }, [])

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={handleClose}
            onOpen={() => { }}
            ModalProps={{
                keepMounted: true
            }}
            sx={{ "& .MuiPaper-root": { height: "100%" } }}
        >
            <StyledBox
                sx={{
                    position: 'absolute',
                    top: 10,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    visibility: 'visible',
                    right: 0,
                    left: 0,
                    marginBottom: "8px"
                }}
            >
                <Puller />
            </StyledBox>
            <Box sx={{ padding: "16px" }}>
                <Box sx={{ marginTop: "24px" }}>
                    <Typography variant="h5">Create Chat</Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", marginTop: "32px" }}>
                    <Box sx={{ width: "75%", marginRight: "24px" }}>
                        <TextField
                            value={conversationName}
                            onChange={(ev) => { setConversationName(ev.target.value) }}
                            fullWidth variant="standard"
                            placeholder="Name this chat"
                        />
                    </Box>
                    <Box width={{ width: "10%", "& .MuiButtonBase-root": { padding: "4px 8px" } }}>
                        <Button
                            disabled={buttonDisabled()}
                            variant="contained"
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ mt: "30px", mb: "16px" }}>
                    <Typography sx={{ fontWeight: 700, }} color={theme.palette.common.textSecondary} variant="body2">Select Bot to Chat With</Typography>
                </Box>
                {
                    Math.abs(user.bots_left) > 0 && (
                        <ItemCreate>
                            <Box className="text-container" sx={{}}>
                                <Typography variant="body2">Create New</Typography>
                            </Box>
                            <IconButton className="button-container">
                                <Add />
                            </IconButton>
                        </ItemCreate>
                    )
                }

                <StyledList>
                    {
                        userBots.map((el) => {
                            var bgColor = el === bot ? "rgba(47, 128, 237, 0.1)" : null
                            return (
                                <StyledListItem sx={{ backgroundColor: bgColor }} onClick={() => { setBot(el) }} >
                                    <ListItemIcon>
                                        <Avatar src={el.avatar_location || "/glyph-avatar.png"} />
                                    </ListItemIcon>
                                    <ListItemText primary={el.name} />
                                </StyledListItem>
                            )
                        })
                    }
                </StyledList>
            </Box>

        </SwipeableDrawer>
    )
}