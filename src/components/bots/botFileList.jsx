import { Add, Delete, ExpandLess, ExpandMore, Folder } from "@mui/icons-material";
import { Collapse, List, TableRow, ListItem, IconButton, ListItemIcon, ListItemAvatar, Checkbox, ListItemText, Avatar, Divider, Snackbar, Dialog, DialogTitle, DialogContentText, DialogActions, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { genericRequest, getRequest } from "../utility/request_helper";

export default function BotFileList({ name, bot_id, user, bot, setBot }) {
    const [listOpen, setListOpen] = useState(false)
    const [availableTexts, setAvailableTexts] = useState([])
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const inputFile = useRef(null)
    const inputRef = useRef();

    const sortTexts = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    const getAvailableTexts = () => {
        getRequest("/texts", (data) => {
            setAvailableTexts(sortTexts(data))
        })
    }

    useEffect(() => {
        getAvailableTexts()
    }, [])

    const handleUploadDelete = () => {
        genericRequest(`/texts/${deleteTarget}`, "DELETE", null, (data) => {
            setAvailableTexts(sortTexts(data))
            setDeleteTarget(null)
            setDeleteConfirmOpen(false)
        })
    }

    const showDeleteConfirm = (id) => {
        setDeleteConfirmOpen(true)
        setDeleteTarget(id)
    }

    const handleFileHiding = (idx) => {
        const targetText = availableTexts[idx]
        genericRequest(`/bots/${bot.id}/texts/${targetText.id}`, "PATCH", null, (data) => {
            setBot(data)
        })
    }

    const isEnabledForBot = (id) => {
        if (bot.enabled_texts !== undefined) {
            var bot_text = bot.enabled_texts.find(item => item.id === id)
            if (bot_text === undefined) {
                return false
            } {
                return true
            }
        }
        return false
    }

    const handleUpload = (ev) => {
        ev.preventDefault()
        const file = ev.target.files[0]
        const formData = new FormData()
        formData.append('file', file)

        if (file.size / 1024 / 1024 > 50) {
            setSnackbarMessage("File size too large.")
            setSnackbarOpen(true)
            return false
        }

        genericRequest(`/bots/${bot_id}/user_upload`, "POST", formData, (data, status) => {
            if (status === 200) {
                setSnackbarMessage(`${file.name} Uploaded. File will appear in list once processing is completed.`)
                setSnackbarOpen(true)
            }
        }, {})
    }

    const handleUploadClick = (ev) => {
        inputFile.current.click()
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
            <List sx={{ width: "100%" }}>
                <ListItem
                    secondaryAction={
                        <IconButton edge="end">
                            {listOpen ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    }
                    onClick={() => { setListOpen(!listOpen) }}
                >
                    <ListItemText primary={name} primaryTypographyProps={{ sx: { fontSize: 18 } }} />
                </ListItem>
                <Collapse in={listOpen} unmountOnExit>
                    <List component="div" disablePadding sx={{ overflowY: "scroll", maxHeight: "300px" }}>
                        {
                            availableTexts && availableTexts.map((item, idx) => {
                                return (
                                    <>
                                        <ListItem key={idx} sx={{ pl: 4 }} secondaryAction={
                                            <IconButton edge="end" onClick={() => { showDeleteConfirm(item.id) }}>
                                                <Delete />
                                            </IconButton>
                                        }>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={isEnabledForBot(item.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    onClick={(ev) => { handleFileHiding(idx) }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={item.name || "No Filename Given"} secondary={item.processed ? "Processing Complete" : "Processing in Progress"} />
                                        </ListItem>
                                        <Divider />
                                    </>
                                )
                            })
                        }
                        {
                            Math.abs(user.files_left) > 0 && (
                                <ListItem id="upload-file-button" ref={inputRef} onClick={handleUploadClick} key={0} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <Add />
                                    </ListItemIcon>
                                    <ListItemText primary={<b>Upload New File</b>} />
                                </ListItem>
                            )
                        }
                    </List>
                </Collapse>
                <input
                    onChange={(ev) => { handleUpload(ev) }}
                    accept="text/*,application/csv,application/pdf,image/*,.mp3,audio/mp3,.yaml,.json"
                    type='file'
                    id='file'
                    ref={inputFile}
                    style={{ display: 'none' }}
                />
            </List>
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => { setDeleteConfirmOpen(false) }}
            >
                <DialogTitle>
                    Are you sure?
                </DialogTitle>
                <DialogContentText sx={{ padding: "8px" }}>
                    Deleting this file will delete it FOR ALL BOTS. If this is not what you want
                    use the checkbox to DISABLE it for this bot instead.
                </DialogContentText>
                <DialogActions>
                    <Button onClick={() => { setDeleteConfirmOpen(false) }}>Cancel</Button>
                    <Button onClick={handleUploadDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}