import { Dialog, DialogContent, DialogTitle, TextField, Box, Divider, Typography, DialogActions, Button, Select, MenuItem, InputLabel, Alert, AlertTitle, Drawer, List, ListItem, ListItemAvatar, Checkbox, ListItemText, useMediaQuery, Backdrop } from "@mui/material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "../utility/request_helper";
import { useRouter } from "next/router";
import { useUserContext } from "@/context/user";
import { Note } from "@mui/icons-material";
import { theme } from "../utility/theme";

export default function NewBotModal({ open, handleClose }) {
    const [name, setName] = useState("")
    const [personas, setPersonas] = useState([])
    const [botPersona, setBotPersona] = useState(null)
    const [availableTexts, setAvailableTexts] = useState([])
    const [availableTools, setAvailableTools] = useState([])
    const [texts, setTexts] = useState([])
    const [tools, setTools] = useState([])
    const [botCode, setBotCode] = useState("")
    const [user, setUser] = useState({})
    const [showCreation, setShowCreation] = useState(false)
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))
    const router = useRouter()

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

    const getUser = () => {
        getRequest("/profile", (data) => {
            setUser(data)
            if (data.allowed_bots == -1) {
                setShowCreation(true)
            } else if (data.bots_left <= 0) {
                setShowCreation(false)
            } else {
                setShowCreation(true)
            }

            return true
        })
    }

    const sortItems = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== undefined || bot_code !== null) {
            setBotCode(bot_code || "")
        }

        getRequest("/personas", (data) => {
            setPersonas(data)
        })

        getRequest("/texts", (data) => {
            setAvailableTexts(sortItems(data))
        })

        getRequest("/tools", (data) => {
            setAvailableTools(sortItems(data))
        })

        getUser()

        console.log(user)


    }, [])

    const addDisabled = () => {
        if (botCode !== "") {
            return false
        } else if (name !== "" && botPersona !== null) {
            return false
        } else if (!showCreation) {
            return false
        }

        return true
    }

    const isEnabledForBot = (targetList, id) => {
        if (targetList !== undefined) {
            var item = targetList.find(i => i.id === id)
            if (item === undefined) {
                return false
            } else {
                return true
            }
        }
        return false
    }

    const handleCheck = (stateFunc, stateObj, item) => {
        var newStateObj = stateObj
        if (newStateObj.includes(item)) {
            var filtered = newStateObj.filter(i => i.id !== item.id)
            stateFunc(filtered)
        } else {
            stateFunc([...newStateObj, item])
        }
    }


    const renderBotCreation = () => {
        if (showCreation) {
            return (
                <Box sx={{ position: "relative" }}>
                    <Backdrop sx={{ position: "absolute" }} open={botCode !== "" && botCode !== null} />
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Create New Bot</Typography>
                        <TextField disabled={botCode !== "" && botCode !== null} fullWidth label="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                    </Box>
                    <Box sx={{ marginTop: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <TextField select onChange={(e) => { setBotPersona(e.target.value) }} fullWidth label="Persona">
                            {
                                personas && personas.map((p, idx) => {
                                    return (
                                        <MenuItem key={idx} value={p.id}>{p.name}</MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Box>
                    <Box sx={{ mt: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h6">Files & Notes</Typography>
                    </Box>
                    <Box sx={{ maxHeight: "150px", overflowY: "scroll", marginTop: "8px", display: "flex", flexWrap: "wrap", backgroundColor: "#f6f6f6" }}>
                        <List>
                            {
                                availableTexts && availableTexts.map((item, idx) => {
                                    return (
                                        <>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        disabledRipple
                                                        onClick={() => { handleCheck(setTexts, texts, item) }}
                                                        edge="start"
                                                        checked={isEnabledForBot(texts, item.id)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText>
                                                    {item.name || item.id}
                                                </ListItemText>
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </>
                                    )
                                })

                            }
                        </List>
                    </Box>
                    <Box sx={{ mt: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h6">Tools</Typography>
                    </Box>
                    <Box sx={{ maxHeight: "150px", overflowY: "scroll", marginTop: "8px", display: "flex", flexWrap: "wrap", backgroundColor: "#f6f6f6" }}>
                        <List>
                            {
                                availableTools && availableTools.map((item, idx) => {
                                    if (item.user_configurable) {
                                        return (
                                            <>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Checkbox
                                                            tabIndex={-1}
                                                            disabledRipple
                                                            onClick={() => { handleCheck(setTools, tools, item) }}
                                                            edge="start"
                                                            checked={isEnabledForBot(tools, item.id)}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText>
                                                        {item.name}
                                                    </ListItemText>
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </>
                                        )
                                    }
                                })

                            }
                        </List>
                    </Box>
                    <Divider sx={{ mt: "8px", mb: "8px" }} flexItem >OR</Divider>
                    <Box sx={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Backdrop sx={{ position: "absolute" }} open={name !== "" && name !== null} />
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Sharing Code</Typography>
                        <TextField disabled={name !== "" && name !== null} fullWidth label="Code" value={botCode} onChange={(e) => { setBotCode(e.target.value) }} />
                    </Box>
                </Box>
            )
        } else {
            return (
                <>
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Create New Bot</Typography>
                    </Box>
                    <Alert severity="info" onClick={() => { router.push("/profile") }}>
                        <AlertTitle>User Not Subscribed</AlertTitle>
                        You cannot create new bots unless you are subscribed! Click Here!
                    </Alert>
                </>
            )
        }

        return null
    }

    return (
        <Drawer
            anchor={"bottom"}
            open={open}
            onClose={handleClose}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", flexWrap: "wrap", width: "100%" }}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h5">Add Bot</Typography>
                </Box>
                <Box sx={{ marginBottom: "16px" }}>
                    {
                        renderBotCreation()
                    }
                </Box>
                <Box sx={{ width: "100%", display: "flex" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", width: "50%", padding: "0 0 8px 24px" }}>
                        <Button varient="conteint" onClick={() => { handleClose() }}>Cancel</Button>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "50%", padding: "0 24px 8px 0" }}>
                        <Button variant="contained" disabled={addDisabled()} onClick={() => { onAdd() }}>Add</Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    )
}