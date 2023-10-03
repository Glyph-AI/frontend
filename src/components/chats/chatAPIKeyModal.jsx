import { Box, Button, Dialog, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { getChatTokenById } from "../api/chats";

export default function ChatApiKeyModal({ open, handleClose, chatId }) {
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [token, setToken] = useState("")

    const handleGenerate = () => {
        getChatTokenById(chatId, (token) => {
            setToken(token)
            navigator.clipboard.writeText(token)
            setSnackbarOpen(true)
        })
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <Snackbar
                open={snackbarOpen}
                onClose={() => { setSnackbarOpen(false) }}
                message="API Key Copied to Clipboard"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            />
            <Box
                sx={{ padding: "32px" }}
            >
                <Box sx={{ marginTop: 0, display: "flex", justifyContent: "center" }}>
                    <Typography variant="h5">API Access</Typography>
                </Box>
                <Box sx={{ mt: "32px", display: "flex", justifyContent: "center" }}>
                    <Button onClick={handleGenerate} variant="contained">Generate API Key</Button>
                </Box>
            </Box>
        </Dialog>
    )
}