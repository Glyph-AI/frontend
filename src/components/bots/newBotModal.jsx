import { Dialog, DialogContent, DialogTitle, TextField, Box, Divider, Typography, DialogActions, Button, Select, MenuItem, InputLabel, Alert, AlertTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "../utility/request_helper";
import { useRouter } from "next/router";

export default function NewBotModal({ open, handleClose }) {
    const [name, setName] = useState("")
    const [personas, setPersonas] = useState([])
    const [botPersona, setBotPersona] = useState(null)
    const [botCode, setBotCode] = useState("")
    const [showCreation, setShowCreation] = useState(false)
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
                persona_id: botPersona
            }

            genericRequest("/bots", "POST", JSON.stringify(data), () => {
                setName("")
                handleClose()
                setBotPersona(null)
            }, { "Content-Type": "application/json" })
        }
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

        getRequest("/profile", (data) => {
            setShowCreation(data.subscribed)
        })
    }, [])

    const addDisabled = () => {
        console.log(botPersona)
        if (botCode !== "") {
            return false
        } else if (name !== "" && botPersona !== null) {
            return false
        }

        return true
    }

    const renderBotCreation = () => {
        console.log(showCreation)
        if (showCreation) {
            return (
                <>
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

                </>
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
                    <Divider flexItem >or</Divider>
                </>
            )
        }

        return null
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Add Bot</DialogTitle>
            <DialogContent>
                <Box sx={{}}>
                    {
                        renderBotCreation()
                    }
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Sharing Code</Typography>
                        <TextField disabled={name !== "" && name !== null} fullWidth label="Code" value={botCode} onChange={(e) => { setBotCode(e.target.value) }} />
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose() }}>Cancel</Button>
                <Button disabled={addDisabled()} onClick={() => { onAdd() }}>Add</Button>
            </DialogActions>

        </Dialog>
    )
}