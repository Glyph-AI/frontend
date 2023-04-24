import { Dialog, DialogContent, DialogTitle, TextField, Box, Divider, Typography, DialogActions, Button } from "@mui/material";
import { useState } from "react";

export default function NewBotModal({ open, handleClose }) {
    const [name, setName] = useState("")
    const [botCode, setBotCode] = useState("")

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
                        <TextField disabled={botCode !== ""} fullWidth label="Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                    </Box>
                    <Divider flexItem >or</Divider>
                    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                        <Typography sx={{ width: "100%", textAlign: "center", fontSize: 20, marginBottom: "8px" }}>Input Sharing Code</Typography>
                        <TextField disabled={name !== ""} fullWidth label="Code" value={botCode} onChange={(e) => { setBotCode(e.target.value) }} />
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose() }}>Cancel</Button>
                <Button onClick={() => { handleClose() }}>Create</Button>
            </DialogActions>

        </Dialog>
    )
}