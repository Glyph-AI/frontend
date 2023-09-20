import { getBotById, getUserBots } from "@/components/api/bots";
import { getChatById, getChats } from "@/components/api/chats";
import { getAvailableTexts, getTextById } from "@/components/api/texts";
import { getCurrentUser } from "@/components/api/users";
import CondensedBotList from "@/components/bots/condensedBotList";
import ChatList from "@/components/chats/chatList";
import ChatsContainer from "@/components/chats/chatsContainer";
import DesktopNavbar from "@/components/navbar/desktop_navbar";
import NotesContainer from "@/components/notes/notesContainer";
import EditableTextField from "@/components/settings/editableTextField";
import UsageBars from "@/components/settings/usageBars";
import CollapsibleCard from "@/components/utility/cardTypes/collapsibleCard";
import DataSelectTabs from "@/components/utility/common/dataSelectTabs";
import { getCookie } from "@/components/utility/cookie_helper";
import DesktopLayout from "@/components/utility/layouts/desktop_layout";
import { darkTheme, theme } from "@/components/utility/theme";
import { ChatBubble, Contacts, Search, Settings } from "@mui/icons-material";
import { Avatar, Box, Divider, InputAdornment, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SettingsContainer from "../components/settings/settingsContainer";

export default function Index() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const currentTheme = prefersDarkMode ? darkTheme : theme
    const smallScreen = useMediaQuery(currentTheme.breakpoints.down("md"))
    const router = useRouter()
    const searchParams = useSearchParams()

    const [user, setUser] = useState({})
    const [name, setName] = useState("")
    const [availableTexts, setAvailableTexts] = useState([])
    const [chats, setChats] = useState([])
    const [bots, setBots] = useState([])
    const [activeTab, setActiveTab] = useState("bots")
    const [selectedChat, setSelectedChat] = useState({})
    const [selectedNote, setSelectedNote] = useState({})
    const [selectedBot, setSelectedBot] = useState({})


    useEffect(() => {
        if (smallScreen) {
            router.push("/chats")
        }

        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            console.log("REDIRECTING TO LOGIN")
            router.push("/login")
        }

        getCurrentUser((data) => {
            setUser(data)
            setName(`${data.first_name} ${data.last_name}`)
        })

        getUserBots(setBots)
        getChats(setChats)
        getAvailableTexts(setAvailableTexts)

        let chat_id = searchParams.get("chat_id")
        if (chat_id) {
            getChatById(chat_id, (data) => {
                setSelectedChat(data)
                setSelectedNote({})
                getBotById(data.bot_id, setSelectedBot)
            })

        }

        let note_id = searchParams.get("note_id")
        if (note_id) {
            getTextById(note_id, (data) => {
                setSelectedNote(data)
                setSelectedChat({})
                setSelectedBot({})
            })
        }

    }, [searchParams])

    const handleNameChange = (val) => {
        var split = val.split(" ")
        var first_name = split[0]
        split.splice(0, 1)
        var last_name = split.join(" ")
        setName(`${first_name} ${last_name}`)
    }

    const handleNameSubmit = () => {
        setIsNamedFocused(false)
        var split = name.split(" ")
        var first_name = split[0]
        split.splice(0, 1)
        var last_name = split.join(" ")
        if (first_name !== user.first_name || last_name !== user.last_name) {
            const data = {
                id: user.id,
                first_name: first_name,
                last_name: last_name
            }

            genericRequest("/profile", "PATCH", JSON.stringify(data), (data) => {
                setUser(data)
                setName(`${data.first_name} ${data.last_name}`)
            })
        }
    }

    const botsTitle = bots.length === 1 ? `${bots.length} Bot` : `${bots.length} Bots`
    const chatsTitle = chats.length === 1 ? `${chats.length} Chat` : `${chats.length} Chats`
    const subscriptionText = () => {
        if (!user.subscribed) {
            return "Glyph Free"
        } else {
            return `${user.subscription_price_tier.name} / ${user.subscription_renewal_date}`
        }
    }

    return (
        <DesktopLayout>
            <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
                <DesktopNavbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
                <Box sx={{ width: "30%", minWidth: "500px", p: "0px 32px" }}>
                    <Box sx={{ pb: "32px" }}>
                        <TextField
                            sx={{
                                backgroundColor: "white",
                                borderRadius: "8px"
                            }}
                            placeholder="Search"
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            }}
                        />
                    </Box>
                    <Paper
                        elevation={0}
                        sx={
                            {
                                p: 4,
                                borderRadius: 3,
                                maxHeight: "calc(100% - 88px)",
                                background: theme.palette.background.main,
                                overflowY: "scroll",
                                "-ms-overflow-style": "none",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    display: "none"
                                }
                            }
                        }
                    >
                        <Box sx={{ width: "100%", pb: 4, height: "40%" }}>
                            <DataSelectTabs
                                contentHeight={"100%"}
                                isSelectable={false}
                                user={user}
                                seeMore={true}
                                tabState={activeTab === "files" ? 1 : 0}
                                availableTexts={availableTexts}
                                setAvailableTexts={setAvailableTexts}
                            />
                        </Box>
                        <Divider sx={{ width: "100%", mb: 2 }} />
                        <Box sx={{ width: "100%", pb: 4 }}>
                            <CollapsibleCard
                                expand={activeTab === "profile"}
                                avatar={
                                    <Avatar src={user.profile_picture_location} />
                                }
                                newItemFunc={() => { setConversationModalVisible(true) }}
                                title={<Typography variant="body2">Profile</Typography>}
                            >
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box sx={{ pl: 1 }}>
                                        <EditableTextField placeholder={name} handleChange={handleNameChange} handleSubmit={handleNameSubmit} />
                                    </Box>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <Typography color={theme.palette.common.subtitleBlue} variant="body2">{subscriptionText()}</Typography>
                                </Box>
                                <UsageBars user={user} dense={false} />
                            </CollapsibleCard>
                        </Box>
                        <Box sx={{ width: "100%", pb: 4 }}>
                            <CollapsibleCard
                                expand={activeTab === "chats"}
                                avatar={
                                    <ChatBubble color="primary" />
                                }
                                newItemFunc={() => { setConversationModalVisible(true) }}
                                title={<Typography variant="body2">{chatsTitle}</Typography>}
                            >
                                <ChatList chats={chats} desktopMode={true} />
                            </CollapsibleCard>
                        </Box>
                        <Box sx={{ width: "100%", pb: 4 }}>
                            <CollapsibleCard
                                expand={activeTab === "bots"}
                                avatar={
                                    <Contacts color="primary" />
                                }
                                newItemFunc={() => { setNewBotModalVisible(true) }}
                                title={<Typography variant="body2">{botsTitle}</Typography>}
                            >
                                <CondensedBotList user={user} setBots={setBots} bots={bots} desktopMode={true} />
                            </CollapsibleCard>
                        </Box>
                        <Box sx={{ width: "100%", pb: 4 }}>
                            <CollapsibleCard
                                expand={activeTab === "settings"}
                                avatar={
                                    <Settings color="primary" />
                                }
                                title={<Typography variant="body2">Settings</Typography>}
                            >
                                <SettingsContainer user={user} />

                            </CollapsibleCard>
                        </Box>

                    </Paper>
                </Box>
                <Paper elevation={0} sx={{ flex: 1, p: 4, borderRadius: 3, minHeight: "100%" }}>
                    {
                        Object.keys(selectedChat).length !== 0 && (
                            <ChatsContainer
                                chat={selectedChat}
                                user={user}
                                bot={selectedBot}
                                setBot={setSelectedBot}
                                desktopMode={true}
                            />
                        )
                    }
                    {
                        Object.keys(selectedNote).length !== 0 && (
                            <NotesContainer
                                note={selectedNote}
                                setNote={setSelectedNote}
                                desktopMode={true}
                                setAvailableTexts={setAvailableTexts}
                            />
                        )
                    }
                    {/* {
                        Object.keys(selectedChat).length === 0 && (
                            <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Icon sx={{ height: "50%", width: "50%", opacity: "0.1" }}>
                                    <ChatBubble sx={{ height: "100%", width: "100%" }} />
                                </Icon>
                            </Box>
                        )
                    } */}
                </Paper >
            </Box>
        </DesktopLayout>
    )
}