import { genericRequest, getRequest } from "@/components/utility/request_helper"
import { Avatar, Backdrop, Box, CircularProgress, IconButton, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { CallEnd, Mic, MicOff } from "@mui/icons-material";
import { API_ROOT } from '@/components/utility/apiConfig';

export default function Voice() {
    const [botId, setBotId] = useState(0)
    const [bot, setBot] = useState({})
    const [chat, setChat] = useState({})
    const [muted, setMuted] = useState(false)
    const [speechRecog, setSpeechRecog] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { id } = router.query

    useEffect(() => {
        getChatById(id, (chatData) => {
            setChat(chatData)
            getBotById(chatData.bot_id, (botData) => {
                setBot(botData)
            })
            setBotId(chatData.bot_id)
        })


        if (window) {
            const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (typeof speechRecognition === "undefined") {
                router.push(`/chats/${id}`)
            } else {
                setMuted(false)
                const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                const recog = new speechRecognition()
                recog.continuous = false
                const onResult = (e, chatId, recog) => {
                    const text = e.results[0][0].transcript
                    handleNewMessage(text, chatId, recog)
                }
                recog.addEventListener("result", (e) => { onResult(e, id, recog) })
                recog.start()
            }
        }
    }, [])

    const playAudio = (url) => {
        return new Promise((resolve, reject) => {
            var audio = new Audio();
            audio.preload = "auto"
            audio.autoplay = true
            audio.onerror = reject
            audio.onended = resolve

            audio.src = url
        })
    }

    const getLastMessageId = (dbChats) => {
        const chats = dbChats.filter((dbMessage) => (!dbMessage.hidden)).map((dbMessage, index) => ({
            id: dbMessage.id,
            created_at: Date.parse(dbMessage.created_at)
        })).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

        return chats[chats.length - 1].id

    }

    const handleNewMessage = (messageContent, chatId, recog) => {
        setMuted(true)
        setLoading(true)
        const newMessageJson = {
            role: "user",
            content: messageContent,
            chat_id: chatId,
            tts: true
        }

        genericRequest(`/chats/${chatId}/message`, "POST", JSON.stringify(newMessageJson), (data) => {
            const last_id = getLastMessageId(data.chat_messages)
            const url = `${API_ROOT}/chats/${chatId}/message/${last_id}/tts`
            playAudio(url).then(() => {
                recog.start();
                setMuted(false)
                setLoading(false)
            })
        })
    }

    const getChatById = (chat_id, callback = () => { }) => {
        getRequest(`/chats/${chat_id}`, (data) => {
            callback(data)
        })
    }

    const getBotById = (bot_id, callback = () => { }) => {
        getRequest(`/bots/${bot_id}`, (data) => {
            callback(data)
        })
    }

    const handleMuteClick = () => {
        setMuted(!muted);
        speechRecog.stop()
    }

    return (
        <LayoutWithNav showNavigation={false}>
            <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                    <Box>
                        <Box sx={{ position: "relative" }}>
                            <Avatar sx={{ height: 256, width: 256 }} src={bot.avatar_location || "/glyph-avatar.png"} name={bot.name} />
                            <Backdrop open={loading} sx={{ borderRadius: "100%", position: "absolute" }}>
                                <CircularProgress color="secondary" />
                            </Backdrop>
                        </Box>
                        <Typography variant="h4" sx={{ textAlign: "center", width: "100%" }}>{bot.name}</Typography>
                        <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>{chat.name}</Typography>
                        <Box sx={{ paddingTop: "45%", display: "flex", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <IconButton onClick={() => { router.push(`/chats/${router.query.id}`) }}>
                                <CallEnd sx={{ fontSize: 40 }}></CallEnd>
                            </IconButton>
                            <IconButton onClick={handleMuteClick}>
                                {
                                    muted ? <MicOff sx={{ fontSize: 40 }} /> : <Mic sx={{ color: "red", fontSize: 40 }} />
                                }
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
                <Box>

                </Box>
            </Box>
        </LayoutWithNav >
    )
}