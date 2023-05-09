import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { genericRequest } from "../utility/request_helper";
import { useRouter } from "next/router";

export default function NewNoteModal({ open, handleClose }) {
    const [name, setName] = useState("")
    const router = useRouter()

    const handleCreate = () => {
        const data = {
            name: name,
            text_type: "note",
            content: ""
        }

        genericRequest("/texts", "POST", JSON.stringify(data), (data, status) => {
            handleClose()
            router.push(`/notes/${data.id}`)
        })
    }

    return (
        <Dialog
            open={open}
            handleClose={handleClose}
        >
            <DialogTitle>Create Note</DialogTitle>
            <DialogContent>
                <Box sx={{ padding: "8px 8px 8px" }}>
                    <TextField onChange={(ev) => { setName(ev.target.value) }} label="Name"></TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}