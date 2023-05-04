import BotAttribute from "@/components/bots/botAttribute";
import BotFileList from "@/components/bots/botFileList";
import BotToolList from "@/components/bots/botToolList";
import { getCookie } from "@/components/utility/cookie_helper";
import Layout from "@/components/utility/layout"
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Share } from "@mui/icons-material";
import { Divider, IconButton, List, ListItem, ListItemText, Snackbar, Table, TableBody, TableRow, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BotInfo() {
    const router = useRouter()
    const { id } = router.query

    const [bot, setBot] = useState({})
    const [botId, setBotId] = useState(null)
    const [currentUser, setCurrentUser] = useState({})
    const [snackbarOpen, setSnackbarOpen] = useState(false)



    const getBotById = () => {
        getRequest(`/bots/${id}`, (data) => {
            setBot(data)
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

    const getCurrentUser = () => {
        getRequest("/profile", (data) => {
            setCurrentUser(data)
        })
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }
        getBotById()
        getCurrentUser()
    }, [])

    const personaData = () => {
        if (bot.persona !== undefined) {
            return bot.persona.name
        }

        return ""
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
                <ConversationHeader.Back onClick={() => { router.push("/bots") }} />
                <ConversationHeader.Content userName={<Typography variant="h6">{bot.name}</Typography>} />
            </ConversationHeader>
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
                <BotFileList name="Files" bot_id={id} user={currentUser} />
                <Divider />
                <BotToolList bot={bot} setBot={setBot} />
            </>
        </LayoutWithNav>
    )
}