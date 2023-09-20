"use client"
import { getUserBots } from "@/components/api/bots";
import { getChats } from "@/components/api/chats";
import { getAvailableTexts } from "@/components/api/texts";
import { getCurrentUser } from "@/components/api/users";
import CondensedBotList from "@/components/bots/condensedBotList";
import NewBotModal from "@/components/bots/newBotModal";
import ConversationList from "@/components/chats/chatList";
import NewChatModal from "@/components/chats/newChatModal";
import CollapsibleCard from "@/components/utility/cardTypes/collapsibleCard";
import BackgroundBox from "@/components/utility/common/backgroundBox";
import DataSelectTabs from "@/components/utility/common/dataSelectTabs";
import GlyphImageHeader from "@/components/utility/headers/glyphImageHeader";
import LayoutWithNav from "@/components/utility/layouts/layout_with_nav";
import { ChatBubble, Contacts } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Home() {
    const [scrollPosition, setScrollPosition] = useState(0)
    const [user, setUser] = useState({})
    const [chats, setChats] = useState([])
    const [bots, setBots] = useState([])
    const [availableTexts, setAvailableTexts] = useState([])
    const [conversationModalVisible, setConversationModalVisible] = useState(false)
    const [newBotModalVisible, setNewBotModalVisible] = useState(false)
    const [tabState, setTabState] = useState(0)
    const searchParams = useSearchParams()
    const theme = useTheme()
    const bodyRef = useRef(null)

    useEffect(() => {
        getAvailableTexts(setAvailableTexts)
        getCurrentUser(setUser)
        getUserBots(setBots)
        getChats(setChats)
        setScrollPosition(spacerHeight())

        let files = searchParams.get("files")
        if (files) {
            setTabState(1)

        }

        bodyRef.current.scrollTo({ top: scrollPosition })
    }, [scrollPosition])

    const handleScroll = useDebouncedCallback(
        (ev) => {
            let currentScroll = ev.target.scrollTop
            if (currentScroll <= spacerHeight()) {
                bodyRef.current.scrollTo({ top: spacerHeight(), behavior: "smooth" })
            }
        }, 100
    )

    const spacerHeight = () => {
        if (typeof window === "undefined") {
            return 0
        }

        return (window.innerWidth / 2) + 100 + 10
    }

    const handleConversationModalClose = () => {
        getChats((data) => {
            setChats(data);
            setConversationModalVisible(false)
        })
    }

    const handleNewBotModalClose = () => {
        setNewBotModalVisible(false)
        getUserBots(setBots)
    }

    const botsTitle = bots.length === 1 ? `${bots.length} Bot` : `${bots.length} Bots`
    const chatsTitle = chats.length === 1 ? `${chats.length} Chat` : `${chats.length} Chats`

    return (
        <LayoutWithNav showNavigation={false}>
            <BackgroundBox onScroll={handleScroll} id="backgroundBox" innerRef={bodyRef} sx={{ background: "linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(250, 250, 250) 100%)", overflowY: "scroll", height: "calc(100% + 200px)" }}>
                <Box className="container" sx={{ minHeight: `calc(100% + ${spacerHeight()}px)` }}>
                    <GlyphImageHeader />
                    <DataSelectTabs
                        tabState={tabState}
                        isSelectable={false}
                        contentHeight
                        user={user}
                        seeMore={true}
                        availableTexts={availableTexts}
                        setAvailableTexts={setAvailableTexts}
                    />
                    <Box sx={{ padding: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <CollapsibleCard
                            avatar={
                                <ChatBubble color="primary" />
                            }
                            newItemFunc={() => { setConversationModalVisible(true) }}
                            title={<Typography variant="body2">{chatsTitle}</Typography>}
                        >
                            <ConversationList chats={chats} />
                        </CollapsibleCard>
                        <CollapsibleCard
                            avatar={
                                <Contacts color="primary" />
                            }
                            newItemFunc={() => { setNewBotModalVisible(true) }}
                            title={<Typography variant="body2">{botsTitle}</Typography>}
                        >
                            <CondensedBotList user={user} setBots={setBots} bots={bots} />
                        </CollapsibleCard>
                    </Box>
                </Box>
                <NewChatModal
                    open={conversationModalVisible}
                    handleClose={handleConversationModalClose}
                    user={user}
                    updateUserFunc={() => { getCurrentUser(setUser) }}
                />
                <NewBotModal
                    open={newBotModalVisible}
                    handleClose={handleNewBotModalClose}
                    user={user}
                />
            </BackgroundBox>
        </LayoutWithNav >

    )
}