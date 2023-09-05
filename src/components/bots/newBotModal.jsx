import { Dialog, DialogContent, DialogTitle, TextField, Box, Divider, Typography, DialogActions, Button, Select, MenuItem, InputLabel, Alert, AlertTitle, Drawer, List, ListItem, ListItemAvatar, Checkbox, ListItemText, useMediaQuery, Backdrop, SwipeableDrawer, ListItemButton } from "@mui/material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "../utility/request_helper";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/user";
import { Note } from "@mui/icons-material";
import { theme } from "../utility/theme";
import { Puller, StyledBox } from "../conversations/newConversationModal";
import DataSelectTabs, { StyledList } from "../utility/common/dataSelectTabs";
import { StyledListItem } from "../conversations/conversationList";
import { getPerosonas } from "../api/personas";

export default function NewBotModal({ open, handleClose, user }) {
    const [name, setName] = useState("")
    const [botPersona, setBotPersona] = useState(null)
    const [selectedPersonaId, setSelectedPersonaId] = useState(null)
    const [texts, setTexts] = useState([])
    const [tools, setTools] = useState([])
    const [botCode, setBotCode] = useState("")
    const [personas, setPersonas] = useState([])

    const onAdd = () => {
        if (botCode !== "") {
            // we're adding a shared bot
            const data = {
                sharing_code: botCode
            }
            genericRequest("/bots/add-shared", "POST", JSON.stringify(data), () => {
                setBotCode("")
                handleClose()
            }, { "Content-Type": "application/json" })
        } else {
            const data = {
                name: name,
                sharing_enabled: false,
                persona_id: botPersona,
                enabled_texts: texts,
                enabled_tools: tools
            }

            genericRequest("/bots", "POST", JSON.stringify(data), () => {
                setName("")
                setBotPersona(null)
                setTexts([])
                setTools([])
                handleClose()
            }, { "Content-Type": "application/json" })
        }
    }

    const sortItems = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    const buttonDisabled = () => {
        if (selectedPersonaId && name) {
            return false
        }

        return true
    }

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== undefined || bot_code !== null) {
            setBotCode(bot_code || "")
        }

        getPerosonas(setPersonas)
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
            <Box
                sx={{ padding: "16px" }}
            >
                <Box sx={{ marginTop: "24px" }}>
                    <Typography variant="h5">Create Bot</Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", marginTop: "32px" }}>
                    <Box sx={{ width: "75%", marginRight: "24px" }}>
                        <TextField
                            value={name}
                            onChange={(ev) => { setName(ev.target.value) }}
                            fullWidth variant="standard"
                            placeholder="Name this chat"
                        />
                    </Box>
                    <Box width={{ width: "10%", "& .MuiButtonBase-root": { padding: "4px 8px" } }}>
                        <Button
                            disabled={buttonDisabled()}
                            variant="contained"
                        // onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ overflowY: "scroll", height: "75%", pb: 4 }}>
                    <Box sx={{ mt: "30px", mb: "16px" }}>
                        <Typography sx={{ fontWeight: 700, }} color={theme.palette.common.textSecondary} variant="body2">Enable Notes, Tools & Files</Typography>
                    </Box>
                    <DataSelectTabs contentHeight={"50%"} isSelectable={true} bot={{ enabled_texts: [], enabledTools: [] }} user={user} />
                    <Box sx={{ mt: "30px", mb: "16px" }}>
                        <Typography sx={{ fontWeight: 700, }} color={theme.palette.common.textSecondary} variant="body2">Select Persona</Typography>
                    </Box>
                    <StyledList>
                        {
                            personas && personas.map((item) => (
                                <StyledListItem
                                    onClick={() => { console.log(item); setSelectedPersonaId(item.id) }}
                                    sx={{ backgroundColor: item.id === selectedPersonaId ? theme.palette.common.selectedBackground : null }}
                                >
                                    <ListItemButton disableRipple>
                                        <ListItemText>
                                            {item.name}
                                        </ListItemText>
                                    </ListItemButton>
                                </StyledListItem>
                            ))
                        }
                    </StyledList>
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}