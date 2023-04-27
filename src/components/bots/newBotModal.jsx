import { Dialog, DialogContent, DialogTitle, TextField, Box, Divider, Typography, DialogActions, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { genericRequest } from "../utility/request_helper";

export default function NewBotModal({ open, handleClose, urlBotCode }) {
    const [name, setName] = useState("")
    const [botCode, setBotCode] = useState("")

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
                sharing_enabled: false
            }

            genericRequest("/bots", "POST", JSON.stringify(data), () => {
                setName("")
                handleClose()
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
    }, [])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Add Bot</DialogTitle>
            <DialogContent>
                <Box sx={{}}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Create New Bot</Typography>
                        <TextField disabled={botCode !== "" && botCode !== null} fullWidth label="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                    </Box>
                    <Divider flexItem >or</Divider>
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Sharing Code</Typography>
                        <TextField disabled={name !== "" && name !== null} fullWidth label="Code" value={botCode} onChange={(e) => { setBotCode(e.target.value) }} />
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose() }}>Cancel</Button>
                <Button onClick={() => { onAdd() }}>Add</Button>
            </DialogActions>

        </Dialog>
    )
}