import BotAttribute from "@/components/bots/botAttribute";
import BotFileList from "@/components/bots/botFileList";
import BotToolList from "@/components/bots/botToolList";
import Layout from "@/components/utility/layout"
import { getRequest } from "@/components/utility/request_helper";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Divider, List, ListItem, ListItemText, Table, TableBody, TableRow } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function BotInfo() {
    const [bot, setBot] = useState({})

    const router = useRouter()
    const { id } = router.query

    const getBotById = () => {
        getRequest(`/bots/${id}`, (data) => {
            setBot(data)
        })
    }

    useEffect(() => {
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
                    <ConversationHeader.Content userName={bot.name} />
                </ConversationHeader>
                <Table>
                    <TableBody>
                        <BotAttribute name={"Chats"} value={bot.chats && bot.chats.length} />
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