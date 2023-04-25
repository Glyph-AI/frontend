import { Delete, ExpandLess, ExpandMore, Folder } from "@mui/icons-material";
import { Collapse, List, TableRow, ListItem, IconButton, ListItemIcon, ListItemAvatar, Checkbox, ListItemText, Avatar, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "../utility/request_helper";

export default function BotFileList({ name, bot_id }) {
    const [listOpen, setListOpen] = useState(false)
    const [uploads, setUploads] = useState([])

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


    return (
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

                </List>
            </Collapse>
        </List>
    )
}