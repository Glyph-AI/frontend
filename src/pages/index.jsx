import { getBotById, getUserBots } from "@/components/api/bots";
import { getChatById, getChats } from "@/components/api/chats";
import { getAvailableTexts, getTextById } from "@/components/api/texts";
import { getCurrentUser, updateProfile } from "@/components/api/users";
import CondensedBotList from "@/components/bots/condensedBotList";
import NewBotModal from "@/components/bots/newBotModal";
import ChatList from "@/components/chats/chatList";
import ChatsContainer from "@/components/chats/chatsContainer";
import NewChatModal from "@/components/chats/newChatModal";
import DesktopNavbar from "@/components/navbar/desktop_navbar";
import NotesContainer from "@/components/notes/notesContainer";
import EditableTextField from "@/components/settings/editableTextField";
import UsageBars from "@/components/settings/usageBars";
import CollapsibleCard from "@/components/utility/cardTypes/collapsibleCard";
import DataSelectTabs from "@/components/utility/common/dataSelectTabs";
import { getIsSsrMobile } from "@/components/utility/contexts/isSsrMobileContext";
import { getCookie } from "@/components/utility/cookie_helper";
import DesktopLayout from "@/components/utility/layouts/desktop_layout";
import { theme } from "@/components/utility/theme";
import { ChatBubble, Contacts, Settings } from "@mui/icons-material";
import { Avatar, Box, Divider, Icon, Paper, Typography, useMediaQuery } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SettingsContainer from "../components/settings/settingsContainer";

export default function Index() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const [user, setUser] = useState({})
    const [name, setName] = useState("")
    const [availableTexts, setAvailableTexts] = useState([])
    const [chats, setChats] = useState([])
    const [bots, setBots] = useState([])
    const [activeTab, setActiveTab] = useState("bots")
    const [selectedChat, setSelectedChat] = useState({})
    const [selectedNote, setSelectedNote] = useState({})
    const [selectedBot, setSelectedBot] = useState({})
    const [newBotModalVisible, setNewBotModalVisible] = useState(false)
    const [conversationModalVisible, setConversationModalVisible] = useState(false)


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

    }, [searchParams, smallScreen])

    const handleBotProfileClose = () => {
        getUserBots(setBots)
        setNewBotModalVisible(false)
    }

    const handleNameChange = (val) => {
        var split = val.split(" ")
        var first_name = split[0]
        split.splice(0, 1)
        var last_name = split.join(" ")
        setName(`${first_name} ${last_name}`)
    }

    const handleNameSubmit = () => {
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

            updateProfile(data, (data) => {
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
            const d = user.subscription_renewal_date
            const renewal_date = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`
            return `${user.subscription_price_tier.name} / ${renewal_date}`
        }
    }

    const botSearchFunc = (val) => {
        if (val === "" || val === null) {
            getUserBots(setBots)
        } else {
            const matchingBots = bots.filter((item) => item.name.toLowerCase().includes(val.toLowerCase()))
            setBots(matchingBots)
        }
    }

    const botSearchBlur = () => {
        getUserBots(setBots)
    }

    const chatSearchFunc = (val) => {
        if (val === "" || val === null) {
            getChats(setChats)
        } else {
            const matchingChats = chats.filter((item) => item.name.toLowerCase().includes(val.toLowerCase()))
            setChats(matchingChats)
        }
    }

    const chatSearchBlur = () => {
        getChats(setChats)
    }

    return (
        <DesktopLayout>
            <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
                <DesktopNavbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
                <Box sx={{ width: "30%", minWidth: "500px", p: "0px 32px" }}>
                    {/* <Box sx={{ pb: "32px" }}>
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
                    </Box> */}
                    <Paper
                        elevation={0}
                        sx={
                            {
                                p: 4,
                                borderRadius: 3,
                                maxHeight: "103%",
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
                                searchFunc={chatSearchFunc}
                                searchBlurFunc={chatSearchBlur}
                            >
                                <ChatList chats={chats} desktopMode={true} />
                                <NewChatModal
                                    open={conversationModalVisible}
                                    handleClose={() => { setConversationModalVisible(false) }}
                                    updateUserFunc={setUser}
                                    user={user}
                                />
                            </CollapsibleCard>
                        </Box>
                        <Box sx={{ width: "100%", pb: 4 }}>
                            <CollapsibleCard
                                expand={activeTab === "bots"}
                                avatar={
                                    <Contacts color="primary" />
                                }
                                searchFunc={botSearchFunc}
                                searchBlurFunc={botSearchBlur}
                                newItemFunc={() => { setNewBotModalVisible(true) }}
                                title={<Typography variant="body2">{botsTitle}</Typography>}
                            >
                                <CondensedBotList
                                    user={user}
                                    setBots={setBots}
                                    bots={bots}
                                    desktopMode={true}
                                />
                                <NewBotModal
                                    user={user}
                                    handleClose={handleBotProfileClose}
                                    open={newBotModalVisible}
                                />
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
                    {
                        Object.keys(selectedChat).length === 0 && Object.keys(selectedNote).length === 0 && (
                            <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Icon sx={{ height: "50%", width: "50%", opacity: "0.1" }}>
                                    <ChatBubble sx={{ height: "100%", width: "100%" }} />
                                </Icon>
                            </Box>
                        )
                    }
                </Paper >
            </Box>
        </DesktopLayout>
    )
}

export async function getServerSideProps(context) {
    const isMobile = getIsSsrMobile(context)
    if (isMobile) {
        return {
            redirect: {
                permanent: false,
                destination: "/chats"
            }
        }
    }

    return { props: {} }
}