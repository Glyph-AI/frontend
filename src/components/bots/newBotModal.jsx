import { CopyAll } from "@mui/icons-material";
import { Box, Button, Dialog, ListItemButton, ListItemText, SwipeableDrawer, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBot, getBot, updateBotById } from "../api/bots";
import { getPerosonas } from "../api/personas";
import { getAvailableTexts } from "../api/texts";
import { Puller, StyledBox } from "../chats/newChatModal";
import DataSelectTabs from "../utility/common/dataSelectTabs";
import { StyledList } from "../utility/styled/styledList";
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
    const [availableTexts, setAvailableTexts] = useState([])
    const [selectedPersonaId, setSelectedPersonaId] = useState(null)
    const [personas, setPersonas] = useState([])
    const [headerText, setHeaderText] = useState("Create Bot")

    const searchParams = useSearchParams()

    const buttonDisabled = !(selectedPersonaId && name)
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const ContainerComponent = smallScreen ? SwipeableDrawer : Dialog

    const handleCreate = () => {
        if (!editMode) {
            bot.name = name
            bot.persona_id = selectedPersonaId
            createBot(bot, (data) => {
                setName("")
                setSelectedPersonaId(null)
                setBot(emptyBot)
                close()
            })
        } else {
            bot.name = name
            updateBotById(bot.id, bot, (data) => {
                setName("")
                setBot(emptyBot)
                close()
            })
        }

    }

    const close = () => {
        setBot(emptyBot)
        setSelectedPersonaId(null)
        setHeaderText("Create Bot")
        setName("")
        handleClose()
    }


    useEffect(() => {
        // let bot_code = params.bot_code
        // if (bot_code !== undefined || bot_code !== null) {
        //     setBotCode(bot_code || "")
        // }
        getAvailableTexts(setAvailableTexts)
        setBot(emptyBot)
        getPerosonas(setPersonas)
        console.log("Use Effect fired again")
        let bot_id = searchParams.get("bot_id")
        if (editMode && bot_id) {
            console.log("HERE")
            getBot(bot_id, (data) => {
                setBot(data);
                setName(data.name);
                setHeaderText(data.name);
                setSelectedPersonaId(data.persona.id)
            })
        }
    }, [searchParams, smallScreen])

    const toggleSharing = () => {
        const data = {
            id: bot.id,
            sharing_enabled: !bot.sharing_enabled
        }

        updateBotById(bot.id, data, (data) => {
            setBot(data);
            setName(data.name)
            setHeaderText(data.name)
        })
    }

    const handleStore = () => {
        console.log(bot.available_in_store)
        const data = {
            id: bot.id,
            available_in_store: true
        }

        updateBotById(bot.id, data, (data) => {
            setBot(data);
            setName(data.name)
            setHeaderText(data.name)
        })
    }

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
                        <Button variant="text" onClick={toggleSharing}>
                            {bot?.sharing_enabled ? "Disable" : "Enable"} Sharing
                        </Button>
                    </Box>
                    {
                        bot?.sharing_enabled && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <Box sx={{ flex: 1, pl: 1 }}>
                                        <Typography
                                            color={theme.palette.common.textSecondary}
                                            variant="body2"
                                        >
                                            Code: {bot.sharing_code}
                                            <CopyAll
                                                sx={{ ml: "4px", fontSize: "14px" }}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(bot.sharing_code)
                                                }}
                                            />
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <Box sx={{ flex: 1, pl: 1, pt: 1, pb: 1 }}>
                                        <Typography
                                            color={theme.palette.common.textSecondary}
                                            variant="body2"
                                        >
                                            Sharing URL: {`glyphassistant.com/bots?bot_code=${bot.sharing_code}`}
                                            <CopyAll
                                                sx={{ ml: "4px", fontSize: "14px" }}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`glyphassistant.com/bots?bot_code=${bot.sharing_code}`)
                                                }}
                                            />
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )
                    }
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <Box sx={{ flex: 1, pl: 1 }}>
                            <Typography sx={{ fontWeight: 500, fontSize: "16px" }} variant="body2">Bot Store</Typography>
                        </Box>
                        <Button disabled={bot?.available_in_store} variant="text" onClick={handleStore}>
                            {bot?.available_in_store ? "Already In Store" : "Add to Bot Store"}
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
                            personas && personas.map((item, idx) => (
                                <StyledListItem
                                    key={idx}
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
        <ContainerComponent
            anchor="bottom"
            open={open}
            onClose={close}
            onOpen={() => { }}
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
            <Box
                sx={{ padding: "16px" }}
            >
                <Box sx={{ marginTop: smallScreen ? "24px" : 0 }}>
                    <Typography variant="h5">{headerText}</Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", marginTop: "32px", p: 1 }}>
                    <Box sx={{ flex: 1, marginRight: "24px" }}>
                        <TextField
                            value={name}
                            onChange={(ev) => { setName(ev.target.value) }}
                            fullWidth variant="standard"
                            placeholder="Name this bot"
                        />
                    </Box>
                    <Box width={{ width: "20%", display: "flex", justifyContent: "right", "& .MuiButtonBase-root": { padding: "4px 8px" } }}>
                        <Button
                            disabled={buttonDisabled}
                            variant="contained"
                            onClick={handleCreate}

                        >
                            {editMode ? "Update" : "Create"}
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
                        avaialbleTexts={availableTexts}
                        setAvailableTexts={setAvailableTexts}
                    />
                </Box>
            </Box>
        </ContainerComponent>
    )
}