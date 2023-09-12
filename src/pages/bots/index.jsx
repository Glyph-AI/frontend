import { useRouter } from "next/router";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import NewBotModal from "@/components/bots/newBotModal";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layouts/layout_with_nav";
import { Masonry } from "@mui/lab";
import { theme } from "@/components/utility/theme";
import BaseHeader from "@/components/utility/headers/baseHeader";
import BotCard from "@/components/bots/botCard";
import { getUserBots } from "@/components/api/bots";
import { getCurrentUser } from "@/components/api/users";
import BotStoreModal from "@/components/bots/botStoreModal";
import { Global } from "@emotion/react";
import { useSearchParams } from "next/navigation";

export default function Bots() {
    const [userBots, setUserBots] = useState([])
    const [user, setUser] = useState({})
    const [storeModalOpen, setStoreModalOpen] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [botProfileOpen, setBotProfileOpen] = useState(false)
    const [urlBotCode, setUrlBotCode] = useState(null)
    const [selectedBot, setSelectedBot] = useState({})
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))
    const router = useRouter()
    const searchParams = useSearchParams()

    const sortItems = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            let bot_code = searchParams.get("bot_code")
            if (bot_code !== null) {
                router.push(`/login?bot_code=${bot_code}`)
            } else {
                router.push("/login")
            }

            router.push("/login")
        }

        let create = searchParams.get("create")
        if (create !== undefined && create !== null) {
            setModalVisible(true)
        }

        let bot_id = searchParams.get("bot_id")
        if (bot_id !== undefined && bot_id !== null) {
            setBotProfileOpen(true)
        }

        getCurrentUser(setUser)

        getUserBots((data) => { setUserBots(sortItems(data)) })

        // const params = new Proxy(new URLSearchParams(window.location.search), {
        //     get: (searchParams, prop) => searchParams.get(prop),
        // });

        // let bot_code = params.bot_code
        // if (bot_code !== null) {
        //     setUrlBotCode(bot_code)
        //     setModalVisible(true)
        // }
    }, [searchParams])

    const handleModalClose = () => {
        setModalVisible(false);
        getUserBots(setUserBots)
        router.push("/bots")
    }

    const handleBotProfileClose = () => {
        setBotProfileOpen(false)
        getUserBots(setUserBots)
        router.push("/bots")
    }

    const searchFunction = (searchTerm, array) => {
        return array.filter(bot => (bot.name.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    const handleSearchValueChange = (newValue) => {
        setSearchValue(newValue)
        const newDisplayUserBots = searchFunction(newValue, userBots)
        setDisplayUserBots(sortItems(newDisplayUserBots))
    }

    const showCreation = () => {
        if (user.allowed_bots == -1) {
            return true
        } else if (user.bots_left <= 0) {
            return false
        }

        return true
    }

    return (
        <>
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(50% - ${128}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <LayoutWithNav>
                <BaseHeader title="Bot Library" searchFunction={() => { }} showSearch={true} showProfile={true} user={user} />
                <Box
                    sx={{
                        padding: "8px",
                        width: "100%",
                        height: "95%",
                        overflowY: "scroll",
                        display: "flex",
                        justifyContent: "center",
                        boxSizing: smallScreen ? "inherit" : "content-box",
                        background: theme.palette.common.backgroundGradient
                    }}
                >
                    <Masonry columns={2} spacing={2} sx={{ display: "-webkit-box", minHeight: "90%", pb: "50px" }}>
                        {
                            userBots.map((item, idx) => {
                                return (
                                    <BotCard
                                        CardProps={{
                                            onClick: () => {
                                                router.push(`/bots?bot_id=${item.id}`)
                                            }
                                        }
                                        }
                                        key={idx}
                                        bot={item}
                                        isStore={false}
                                    />
                                )
                            })
                        }
                    </Masonry>
                    <BotStoreModal
                        open={storeModalOpen}
                        handleClose={() => setStoreModalOpen(false)}
                        handleOpen={() => setStoreModalOpen(true)}
                    />
                    <NewBotModal
                        open={modalVisible}
                        handleClose={handleModalClose}
                        user={user}
                    />
                    <NewBotModal
                        open={botProfileOpen}
                        handleClose={handleBotProfileClose}
                        user={user}
                        editMode={true}
                    />
                </Box>

            </LayoutWithNav >
        </>


    )
}