import { FileUpload } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { genericRequest } from "./request_helper";

export default function FileUploadModal({ open, handleClose, setRecord, uploadUrl }) {
    const [file, setFile] = useState(null)

    const handleSubmit = (ev) => {
        ev.preventDefault()
        const formData = new FormData()
        formData.append('file', file)
        genericRequest(uploadUrl, "POST", formData, (data, status) => {
            if (status === 200) {
                setRecord(data)
                handleClose()
            }
        }, {})
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Upload</DialogTitle>
            <DialogContent>
                <Button sx={{ overflow: "hidden", textOverflow: "ellipsis" }} className="standardButton confirmButton" startIcon={<FileUpload />} variant="outlined" component="label">
                    {
                        file === null ? "Choose a File" : null
                    }
                    <input hidden accept="image/*" multiple type="file" onChange={(ev) => { setFile(ev.target.files[0]) }} />
                    {
                        file && (
                            <Box component="span" sx={{ paddingLeft: "4px", maxWidth: "80%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</Box>
                        )
                    }
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}