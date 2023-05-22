import LayoutWithNav from "@/components/utility/layout_with_nav";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Add, ContentCopy, CopyAll } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Fab, IconButton, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

export default function Tokens() {
    const [tokens, setTokens] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [newTokenName, setNewTokenName] = useState("")
    const [ snackbarOpen, setSnackbarOpen] = useState(false)

    const getTokens = () => {
        getRequest("/token", (data) => {
            setTokens(data)
            console.log(data)
        })
    }

    useEffect(() => {
        getTokens()
    }, [])

    const handleCreate = () => {
        const data = {
            name: newTokenName
        }

        genericRequest("/token", "POST", JSON.stringify(data), (data, status) => {
            if (status === 200){
                setModalOpen(false)
                getTokens()
            }
        })
    }

    return (
        <LayoutWithNav>
            <ConversationHeader >
                <ConversationHeader.Content userName={<Typography variant="h6">Tokens</Typography>} />
            </ConversationHeader>
            <Box sx={{padding: "8px"}}>
                {
                    tokens && tokens.map((item, idx) => {
                        console.log(item)
                        return (
                            <Card
                                elevation={10}
                            >
                                <CardContent>
                                    <Box sx={{display: "flex", alignItems: "bottom"}}>
                                        <Typography sx={{display: "flex", alignItems: "center", paddingRight: "8px"}} variant="subtitle">{item.name}</Typography>
                                        <TextField size="small" value={item.access_token} type="password" disabled/>
                                        <IconButton onClick={() => {navigator.clipboard.writeText(item.access_token); setSnackbarOpen(true)}}><ContentCopy/></IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </Box>
            <Fab onClick={() => { setModalOpen(true) }} sx={{ position: 'absolute', bottom: 64, right: 16 }} >
                <Add />
            </Fab>
            <Dialog open={modalOpen} onClose={() => {setModalOpen(false)}}>
                <DialogTitle>New Token</DialogTitle>
                <DialogContent>
                    <Box>
                        <TextField value={newTokenName} onChange={(e) => { setNewTokenName(e.target.value)}}/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setModalOpen(false) }}>Cancel</Button>
                    <Button onClick={() => { handleCreate() }}>Create</Button>
                </DialogActions>
            </Dialog>
            <Snackbar 
                message="Copied to Clipboard"
                anchorOrigin={{vertical: "top", horizontal: "left"}}
                autoHideDuration={2000}
                onClose={() => {setSnackbarOpen(false)}}
                open={snackbarOpen} 
            />
                

        </LayoutWithNav>
    )
}