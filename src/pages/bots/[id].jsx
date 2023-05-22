import BotAttribute from "@/components/bots/botAttribute";
import BotFileList from "@/components/bots/botFileList";
import BotToolList from "@/components/bots/botToolList";
import { getCookie } from "@/components/utility/cookie_helper";
import FileUploadModal from "@/components/utility/fileUploadModal";
import Layout from "@/components/utility/layout"
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { useUserContext } from "@/context/user";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Edit, FileUpload, Share } from "@mui/icons-material";
import { Avatar, Badge, Box, Divider, IconButton, List, ListItem, ListItemText, Snackbar, Table, TableBody, TableRow, TextField, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    color: "rgba(255, 255, 255, 1)",
    '&:hover': {
        border: "2px solid #fff"
    }
}));

export default function BotInfo() {
    const router = useRouter()
    const { id } = router.query

    const [bot, setBot] = useState({})
    const [botName, setBotName] = useState("")
    const [botId, setBotId] = useState(null)
    const [user, setUser] = useState({})
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [backButtonURL, setBackButtonURL] = useState("/bots")
    const [isNameFocused, setIsNameFocused] = useState(false)
    const [uploadModalOpen, setUploadModalOpen] = useState(false)

    const handleUploadClose = () => {
        setUploadModalOpen(false)
    }

    const getUser = () => {
        getRequest("/profile", (data) => {
            setUser(data)
        })
    }

    const getBotById = () => {
        getRequest(`/bots/${id}`, (data) => {
            setBot(data)
            setBotName(data.name)
            setBotId(id)
        })
    }

    const handleSharingChange = (e) => {
        const data = {
            sharing_enabled: !bot.sharing_enabled
        }
        genericRequest(`/bots/${botId}`, "PATCH", JSON.stringify(data), (data) => {
            setBot(data)
        }, { "Content-Type": "application/json" })
    }

    const renderSharingCode = () => {
        if (!bot.sharing_enabled) {
            return ""
        }

        return bot.sharing_code
    }

    const handleCopy = (url) => {
        setSnackbarOpen(true)
        navigator.clipboard.writeText(url)
    }

    const renderSharingUrl = () => {
        if (!bot.sharing_enabled) {
            return ""
        }
        let host = window.location.host
        let url = `${host}/bots/share?bot_code=${bot.sharing_code}`

        return (
            <IconButton onClick={() => { handleCopy(url) }}>
                <Share />
            </IconButton>
        )
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }

        getUser()

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let chat_id = params.chat_id
        if (chat_id !== null) {
            setBackButtonURL(`/chats/${chat_id}`)
        }
        getBotById()
    }, [])

    const personaData = () => {
        if (bot.persona !== undefined) {
            return bot.persona.name
        }

        return ""
    }

    const handleNameChange = (val) => {
        setBotName(val)
    }

    const handleNameSubmit = () => {
        if (botName !== bot.name) {
            const data = {
                name: botName
            }

            genericRequest(`/bots/${botId}`, "PATCH", JSON.stringify(data), (data) => {
                setBot(data);
                setBotName(data.name)
                setIsNameFocused(false)
            }, { "Content-Type": "application/json" })
        }

    }

    return (
        <LayoutWithNav>
            <Snackbar
                message="Copied to Clipboard"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                open={snackbarOpen}
            >

            </Snackbar>
            <ConversationHeader>
                <ConversationHeader.Back onClick={() => { router.push(backButtonURL) }} />
            </ConversationHeader>
            <Box sx={{height: "83%", overflowY: "scroll"}}>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: "8px"}}>
                    <Badge
                        overlap="circular"
                        sx={{ padding: "-8px" }}
                        onClick={() => { setUploadModalOpen(true) }}
                        badgeContent={
                            <SmallAvatar>
                                <FileUpload />
                            </SmallAvatar>
                        }
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                        <Avatar
                            src={
                                bot.avatar_location
                            }
                            sx={{ height: 128, width: 128, fontSize: 90, backgroundColor: "#fff" }}
                            alt={bot.name}
                        />
                    </Badge>
                    <Box sx={{ marginTop: "8px", display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
                        <Box sx={{ fontWeight: 600, width: "100%", textAlign: "center" }}>
                            {
                                !isNameFocused ? (
                                    <Badge sx={{ padding: "4px" }} badgeContent={<Edit sx={{ color: "gray", fontSize: 16 }} />}>
                                        <Typography variant="h5" onClick={() => { setIsNameFocused(true) }}>{botName}</Typography>
                                    </Badge>
                                ) : (
                                    <TextField
                                        autoFocus
                                        variant="standard"
                                        placeholder={botName}
                                        onChange={(e) => { handleNameChange(e.target.value) }}
                                        onBlur={(e) => { handleNameSubmit() }}
                                    />
                                )
                            }

                        </Box>
                    </Box>
                </Box>
                <Table>
                    <TableBody>
                        <BotAttribute name={"Chats"} value={bot.chats && bot.chats.length} />
                        <BotAttribute name={"Sharing Enabled"} value={bot.sharing_enabled || false} onChange={handleSharingChange} />
                        <BotAttribute name={"Persona"} value={personaData()} />
                        <BotAttribute name={"Sharing Code"} value={renderSharingCode()} />
                        <BotAttribute name={"Sharing URL"} value={renderSharingUrl()} />
                    </TableBody>
                </Table>
                <Divider />
                <>
                    <BotFileList name="Files" bot_id={id} user={user} bot={bot} setBot={setBot} />
                    <Divider />
                    <BotToolList bot={bot} setBot={setBot} />
                </>
            </Box>
            <FileUploadModal setRecord={setBot} open={uploadModalOpen} handleClose={handleUploadClose} uploadUrl={`/bots/${bot.id}/avatar`} />
        </LayoutWithNav>
    )
}