import { Add, Delete, ExpandLess, ExpandMore, Folder } from "@mui/icons-material";
import { Collapse, List, TableRow, ListItem, IconButton, ListItemIcon, ListItemAvatar, Checkbox, ListItemText, Avatar, Divider, Snackbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { genericRequest, getRequest } from "../utility/request_helper";

export default function BotFileList({ name, bot_id }) {
    const [listOpen, setListOpen] = useState(false)
    const [uploads, setUploads] = useState([])
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const inputFile = useRef(null)
    const inputRef = useRef();

    const sortUserUploads = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    useEffect(() => {
        if (bot_id !== undefined) {
            getRequest(`/user_uploads?bot_id=${bot_id}`, (data) => {
                setUploads(sortUserUploads(data));
            })
        }
    }, [])

    const handleUploadDelete = (id) => {
        genericRequest(`/user_uploads/${id}`, "DELETE", null, (data) => {
            setUploads(sortUserUploads(data))
        })
    }

    const handleFileHiding = (idx) => {
        const targetFile = uploads[idx]
        genericRequest(`/user_uploads/${targetFile.id}`, "PATCH", null, (data) => {
            setUploads(sortUserUploads(data))
        })
    }

    const handleUpload = (ev) => {
        ev.preventDefault()
        const file = ev.target.files[0]
        const formData = new FormData()
        formData.append('file', file)

        console.log(file)

        genericRequest(`/bots/${bot_id}/user_upload`, "POST", formData, (data, status) => {
            if (status === 200) {
                console.log("Upload Successful")
                setSnackbarMessage(`${file.name} Uploaded`)
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
                    <List component="div" disablePadding>
                        {
                            uploads && uploads.map((item, idx) => {
                                return (
                                    <>
                                        <ListItem key={idx} sx={{ pl: 4 }} secondaryAction={
                                            <IconButton edge="end" onClick={() => { handleUploadDelete(item.id) }}>
                                                <Delete />
                                            </IconButton>
                                        }>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={item.include_in_context}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    onClick={(ev) => { handleFileHiding(idx) }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={item.filename || item.id || "No Filename Given"} secondary={item.processed ? "Processing Complete" : "Processing In Progress"} />
                                        </ListItem>
                                        <Divider />
                                    </>
                                )
                            })
                        }
                        <ListItem ref={inputRef} onClick={handleUploadClick} key={0} sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <Add />
                            </ListItemIcon>
                            <ListItemText primary={<b>Upload New File</b>} />
                        </ListItem>

                    </List>
                </Collapse>
                <input
                    onChange={(ev) => { handleUpload(ev) }}
                    accept="text/*,application/csv,application/pdf,image/*,.mp3,audio/mp3"
                    type='file'
                    id='file'
                    ref={inputFile}
                    style={{ display: 'none' }}
                />
            </List>
        </>
    )
}