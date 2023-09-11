import { Cancel, UploadFile } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Snackbar, TextField, Typography, styled, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { archiveUrl, uploadFile } from "../api/user_uploads";

const StyledDialog = styled(Dialog)(() => {
    const theme = useTheme()
    return (
        {
            '& .MuiDialogContent-root': {
                padding: theme.spacing(2),
            },
            '& .MuiDialogActions-root': {
                padding: theme.spacing(1),
            },
            '& .MuiPaper-root': {
                background: theme.palette.common.backgroundGradient
            }
        }
    )
})

export default function UserUploadModal({ open, handleClose }) {

    const [file, setFile] = useState(null)
    const [url, setUrl] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState(null)
    const theme = useTheme()
    const inputFile = useRef()

    const openSnackbar = (message) => {
        setSnackbarMessage(message)
        setSnackbarOpen(true)
    }

    const requestCallback = (message) => {
        openSnackbar(message)
        setUrl(null)
        setFile(null)
        handleClose()
    }

    const handleSubmit = () => {
        let message = ""
        if (url) {
            const data = {
                url: url
            }
            archiveUrl(data, (resp) => {
                if (resp.success) {
                    message = `${url} Successfully Stored.`
                    requestCallback(message)
                } else {
                    message = data.message
                    requestCallback(message)
                }
            })
        } else if (file) {
            const formData = new FormData()
            formData.append('file', file)

            uploadFile(formData, (data, status) => {
                if (resp.success) {
                    message = `${file.name} Successfully Uploaded. File will appear in list once processing is completed.`
                    requestCallback(message)
                } else {
                    message = data.message
                    requestCallback(message)
                }
            })
        }
    }

    const handleFileSelect = (ev) => {
        ev.preventDefault()
        const file = ev.target.files[0]
        if (file.size / 1024 / 1024 > 50) {
            setSnackbarMessage("File size too large.")
            setSnackbarOpen(true)
            return false
        }
        setFile(file)
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen}
                audoHideDuration={6000}
                onClick={() => { setSnackbarOpen(false) }}
                onClose={() => { setSnackbarOpen(false) }}
                message={snackbarMessage}
            />
            <StyledDialog
                open={open}
                onClose={handleClose}
                sx={{
                    padding: "16px 24px",
                }}
            >
                <DialogTitle sx={{ pl: 2, color: theme.palette.common.darkBlue }}>
                    Add File
                </DialogTitle>
                <DialogContent>
                    <Typography color={theme.palette.common.subtitleBlue} sx={{ fontWeight: 600 }} variant="body2">Select a File: </Typography>
                    <Box sx={{ padding: 3, width: "100%" }}>
                        <Button
                            disabled={url}
                            fullWidth
                            startIcon={<UploadFile />}
                            variant="outlined"
                            onClick={() => { inputFile.current.click() }}
                        >
                            Upload a File
                        </Button>
                        {
                            file && (
                                <List>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => { setFile(null) }} >
                                                <Cancel />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText>
                                            <Typography>{file.name}</Typography>
                                        </ListItemText>
                                    </ListItem>
                                </List>

                            )
                        }
                    </Box>
                    <Divider sx={{ pb: 2, width: "100%" }} ><Typography color={theme.palette.common.subtitleBlue} variant="body2">OR</Typography></Divider>
                    <Typography color={theme.palette.common.subtitleBlue} sx={{ fontWeight: 600 }} variant="body2">Archive a URL: </Typography>
                    <Box sx={{ padding: 3 }}>
                        <TextField sx={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #ececec"
                        }} placeholder="URL" fullWidth size="small" disabled={file} onChange={(ev) => setUrl(ev.target.value)} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </StyledDialog>

            <input
                onChange={(ev) => { handleFileSelect(ev) }}
                accept="text/*,application/csv,application/pdf,image/*,.mp3,audio/mp3,.yaml,.json"
                type='file'
                id='file'
                ref={inputFile}
                style={{ display: 'none' }}
            />
        </>
    )
}