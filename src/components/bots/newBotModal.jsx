import { TextField, Box, Divider, Typography, Button, ListItemText, SwipeableDrawer, ListItemButton, IconButton, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { genericRequest } from "../utility/request_helper";
import { theme } from "../utility/theme";
import { Puller, StyledBox } from "../conversations/newConversationModal";
import DataSelectTabs, { ItemCreate, StyledList } from "../utility/common/dataSelectTabs";
import { getPerosonas } from "../api/personas";
import { createBot, getBot } from "../api/bots";
import { useSearchParams } from "next/navigation";
import { Add, CopyAll } from "@mui/icons-material";
import { StyledListItem } from "../utility/styled/styledListItem";

const emptyBot = {
    id: null,
    name: null,
    persona_id: {},
    enabled_tools: [],
    enabled_texts: [],
    sharing_enabled: false,
    sharing_code: null,
}

export default function NewBotModal({ open, handleClose, user, editMode }) {
    const [name, setName] = useState("")
    const [bot, setBot] = useState(null)
    const [selectedPersonaId, setSelectedPersonaId] = useState(null)
    const [personas, setPersonas] = useState([])
    const [headerText, setHeaderText] = useState("Create Bot")
    const searchParams = useSearchParams()
    const buttonDisabled = !(selectedPersonaId && name)
    const theme = useTheme()

    const handleCreate = () => {
        bot.name = name
        bot.persona_id = selectedPersonaId
        createBot(bot, (data) => {
            setName("")
            setSelectedPersonaId(null)
            setBot(emptyBot)
            handleClose()
        })
    }


    useEffect(() => {
        // let bot_code = params.bot_code
        // if (bot_code !== undefined || bot_code !== null) {
        //     setBotCode(bot_code || "")
        // }
        setBot(emptyBot)
        getPerosonas(setPersonas)

        let bot_id = searchParams.get("bot_id")
        if (editMode && bot_id) {
            getBot(bot_id, (data) => {
                setBot(data);
                setName(data.name);
                setHeaderText(data.name);
                setSelectedPersonaId(data.persona.id)
            })
        }
    }, [searchParams])

    const renderSharing = () => {
        if (editMode) {
            return (
                <>
                    <Box sx={{ mt: "30px", mb: "16px" }}>
                        <Typography sx={{ fontWeight: 700, }} color={theme.palette.common.textSecondary} variant="body2">Sharing Settings</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <Box sx={{ flex: 1, pl: 1 }}>
                            <Typography sx={{ fontWeight: 500, fontSize: "16px" }} variant="body2">Sharing</Typography>
                        </Box>
                        <Button variant="text">
                            Enable Code
                        </Button>
                    </Box>
                    {
                        true && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <Box sx={{ flex: 1, pl: 1 }}>
                                        <Typography color={theme.palette.common.textSecondary} variant="body2">Code: {"code here"}<CopyAll sx={{ ml: "4px", fontSize: "14px" }} /></Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <Box sx={{ flex: 1, pl: 1, pt: 1, pb: 1 }}>
                                        <Typography color={theme.palette.common.textSecondary} variant="body2">Sharing URL: {"glyphassistant.com/bots?bot_code=code"}<CopyAll sx={{ ml: "4px", fontSize: "14px" }} /></Typography>
                                    </Box>
                                </Box>
                            </>
                        )
                    }
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <Box sx={{ flex: 1, pl: 1 }}>
                            <Typography sx={{ fontWeight: 500, fontSize: "16px" }} variant="body2">Bot Store</Typography>
                        </Box>
                        <Button variant="text">
                            Add to Bot Store
                        </Button>
                    </Box>
                </>
            )
        }
    }

    const renderPersonas = () => {
        if (!editMode) {
            return (
                <>
                    <Box sx={{ mt: "30px", mb: "16px" }}>
                        <Typography sx={{ fontWeight: 700, }} color={theme.palette.common.textSecondary} variant="body2">Select Persona</Typography>
                    </Box>
                    <StyledList>
                        {
                            personas && personas.map((item) => (
                                <StyledListItem
                                    onClick={() => { setSelectedPersonaId(item.id) }}
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
                </>
            )
        }

    }

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={handleClose}
            onOpen={() => { }}
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
                    <Typography variant="h5">{headerText}</Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", marginTop: "32px" }}>
                    <Box sx={{ width: "75%", marginRight: "24px" }}>
                        <TextField
                            value={name}
                            onChange={(ev) => { setName(ev.target.value) }}
                            fullWidth variant="standard"
                            placeholder="Name this bot"
                        />
                    </Box>
                    <Box width={{ width: "10%", "& .MuiButtonBase-root": { padding: "4px 8px" } }}>
                        <Button
                            disabled={buttonDisabled}
                            variant="contained"
                        // onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ height: "75%", pb: 4 }}>
                    {
                        renderSharing()
                    }
                    {
                        renderPersonas()
                    }
                    <Box sx={{ mt: "30px", mb: "16px" }}>
                        <Typography sx={{ fontWeight: 700, }} color={theme.palette.common.textSecondary} variant="body2">Enable Notes, Tools & Files</Typography>
                    </Box>
                    <DataSelectTabs
                        contentHeight={"50%"}
                        setBot={setBot}
                        isSelectable={true}
                        bot={bot}
                        user={user}
                        createMode={!editMode}
                    />
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}