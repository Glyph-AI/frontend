import Layout from "@/components/utility/layout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
    ConversationHeader, Search
} from '@chatscope/chat-ui-kit-react'
import { Divider, List, Fab, Box, Select, TextField, Typography, Avatar, useMediaQuery } from "@mui/material";
import BotListItem from "@/components/bots/botListItem";
import { getRequest } from "@/components/utility/request_helper";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import NewBotModal from "@/components/bots/newBotModal";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { Masonry } from "@mui/lab";
import { useUserContext } from "@/context/user";
import { theme } from "@/components/utility/theme";
import AdBanner from "@/components/utility/ad_banner";

export default function Bots() {
    const [userBots, setUserBots] = useState([])
    const [displayUserBots, setDisplayUserBots] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [user, setUser] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [urlBotCode, setUrlBotCode] = useState(null)
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))
    const router = useRouter()

    const getUserBots = () => {
        getRequest("/bots", (data) => {
            setUserBots(sortItems(data))
            setDisplayUserBots(sortItems(data))
        })
    }

    const getUser = () => {
        getRequest("/profile", (data) => {
            setUser(data)
        })
    }

    const sortItems = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }

        getUser()

        getUserBots()

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== null) {
            setUrlBotCode(bot_code)
            setModalVisible(true)
        }
    }, [])

    const handleModalClose = () => {
        setModalVisible(false);
        getUserBots()
    }

    const searchFunction = (searchTerm, array) => {
        return array.filter(bot => (bot.name.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    const handleSearchValueChange = (newValue) => {
        setSearchValue(newValue)
        const newDisplayUserBots = searchFunction(newValue, userBots)
        setDisplayUserBots(sortItems(newDisplayUserBots))
    }

    return (
        <LayoutWithNav>
            <Box sx={{ padding: "8px", height: 60, display: "flex", marginBottom: "16px", alignContent: "center" }}>
                <Search placeholder="Search..." style={{ flex: 1, fontSize: 16 }} value={searchValue} onChange={handleSearchValueChange} />
                <Avatar
                    onMouseEnter={(e) => { e.target.style.cursor = "pointer" }}
                    sx={{ marginLeft: "16px", width: 40, height: 40 }}
                    alt={user.first_name}
                    src={user.profile_picture_location}
                    onClick={() => { router.push("/profile") }}
                />
            </Box>
            <Box sx={{ pr: "16px", pl: "16px" }}>
                <AdBanner style={{ zIndex: "1000", marginBottom: "8px" }} />
            </Box>
            <Box
                sx={{
                    padding: "8px",
                    width: "100%",
                    height: "95%",
                    overflowY: "scroll",
                    display: "flex",
                    justifyContent: "center",
                    boxSizing: smallScreen ? "inherit" : "content-box"
                }}
            >
                <Masonry
                    columns={1}
                    spacing={2}
                    sx={{ minHeight: "90%", pb: "50px" }}
                >
                    {
                        displayUserBots && displayUserBots.map((item) => (
                            <BotListItem bot={item} displayLink={item.creator_id == user.id} />
                        ))
                    }
                </Masonry>
            </Box>

            {
                Math.abs(user.bots_left) > 0 && (
                    <Fab onClick={() => { setModalVisible(true) }} sx={{ position: 'absolute', bottom: 64, right: 16 }} >
                        <Add />
                    </Fab>
                )
            }

            <NewBotModal urlBotCode={urlBotCode} open={modalVisible} handleClose={handleModalClose} />
        </LayoutWithNav>
    )
}