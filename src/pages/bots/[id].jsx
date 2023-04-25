import BotAttribute from "@/components/bots/botAttribute";
import BotFileList from "@/components/bots/botFileList";
import BotToolList from "@/components/bots/botToolList";
import { getCookie } from "@/components/utility/cookie_helper";
import Layout from "@/components/utility/layout"
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Divider, List, ListItem, ListItemText, Table, TableBody, TableRow, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BotInfo() {
    const router = useRouter()
    const { id } = router.query

    const [bot, setBot] = useState({})
    const [botId, setBotId] = useState(null)



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

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }
        getBotById()
    }, [])

    return (
        <Layout>
            <motion.div
                variants={{
                    hidden: { opacity: 0, x: 200, y: 0 },
                    enter: { opacity: 1, x: 0, y: 0 },
                    exit: { opacity: 0, x: 0, y: 100 }
                }}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{
                    type: "linear"
                }}
                style={{ height: "100%" }}
            >
                <ConversationHeader>
                    <ConversationHeader.Back onClick={() => { router.push("/bots") }} />
                    <ConversationHeader.Content userName={<Typography variant="h6">{bot.name}</Typography>} />
                </ConversationHeader>
                <Table>
                    <TableBody>
                        <BotAttribute name={"Chats"} value={bot.chats && bot.chats.length} />
                        <BotAttribute name={"Sharing Enabled"} value={bot.sharing_enabled || false} onChange={handleSharingChange} />
                        <BotAttribute name={"Sharing Code"} value={renderSharingCode()} />
                    </TableBody>
                </Table>
                <Divider />
                <>
                    <BotFileList name="Files" bot_id={id} />
                    <Divider />
                    <BotToolList bot_id={id} />
                </>

            </motion.div>
        </Layout>
    )
}