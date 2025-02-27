import { Add } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    Icon,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer,
    TextField,
    Typography,
    styled,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { getUserBots } from '../api/bots';
import { createChat } from '../api/chats';
import { ItemCreate } from '../utility/common/dataSelectTabs';
import { StyledList } from '../utility/styled/styledList';
import { StyledListItem } from '../utility/styled/styledListItem';

export const StyledBox = styled(Box)(() => {
    const theme = useTheme()
    return ({
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
    })
});

export const Puller = styled(Box)(() => {
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

export default function NewChatModal({ open, handleClose, updateUserFunc, user }) {
    const [bot, setBot] = useState(null)
    const [userBots, setUserBots] = useState([])
    const [conversationName, setConversationName] = useState("")
    const [showCreation, setShowCreation] = useState(false)
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const ContainerComponent = smallScreen ? SwipeableDrawer : Dialog

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
        <ContainerComponent
            anchor="bottom"
            open={open}
            onClose={handleClose}
            onOpen={() => { }}
            ModalProps={{
                keepMounted: true
            }}
            sx={{ "& .MuiPaper-root": { width: smallScreen ? "100%" : "50%", height: "100%" } }}
        >
            {
                smallScreen && (
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
                )
            }
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
                            <Icon className="button-container">
                                <Add />
                            </Icon>
                        </ItemCreate>
                    )
                }

                <StyledList>
                    {
                        userBots.map((el, idx) => {
                            var bgColor = el === bot ? "rgba(47, 128, 237, 0.1)" : null
                            return (
                                <StyledListItem sx={{ backgroundColor: bgColor }} onClick={() => { setBot(el) }} key={idx}>
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

        </ContainerComponent>
    )
}