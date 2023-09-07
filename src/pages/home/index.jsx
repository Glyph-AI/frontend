"use client"
import { getCurrentUser } from "@/components/api/users";
import BackgroundBox from "@/components/utility/common/backgroundBox";
import DataSelectTabs from "@/components/utility/common/dataSelectTabs";
import GlyphImageHeader from "@/components/utility/headers/glyphImageHeader";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { ChatBubble, Contacts, ExpandMore } from "@mui/icons-material";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Home() {
    const [scrollPosition, setScrollPosition] = useState(0)
    const [user, setUser] = useState({})
    const bodyRef = useRef(null)

    useEffect(() => {
        getCurrentUser(setUser)
        setScrollPosition(spacerHeight())

        bodyRef.current.scrollTo({ top: scrollPosition })
    }, [scrollPosition])

    const handleScroll = useDebouncedCallback(
        (ev) => {
            let currentScroll = ev.target.scrollTop
            if (currentScroll <= spacerHeight()) {
                bodyRef.current.scrollTo({ top: spacerHeight(), behavior: "smooth" })
            }
        }, 250
    )

    const spacerHeight = () => {
        if (typeof window === "undefined") {
            return 0
        }

        return (window.innerWidth / 2) + 100 + 10
    }

    return (
        <LayoutWithNav showNavigation={false}>
            <BackgroundBox onScroll={handleScroll} id="backgroundBox" innerRef={bodyRef} sx={{ background: "none", backgroundColor: "rgba(255, 255, 255, 1)", overflowY: "scroll", height: "100%" }}>
                <Box sx={{ minHeight: `calc(100% + ${spacerHeight()}px)` }}>
                    <GlyphImageHeader />
                    <DataSelectTabs isSelectable={false} contentHeight user={user} seeMore={true} />
                    <Box sx={{ padding: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Card elevation={0} sx={{ width: "100%", flex: 1, borderRadius: "8px", border: "1px solid #ececec" }}>
                            <CardHeader
                                avatar={
                                    <ChatBubble color="primary" />
                                }
                                action={
                                    <ExpandMore />
                                }
                                title={<Typography variant="body2">16 Chats</Typography>}
                            />
                        </Card>
                        <Card elevation={0} sx={{ width: "100%", borderRadius: "8px", border: "1px solid #ececec" }}>
                            <CardHeader
                                avatar={
                                    <Contacts color="primary" />
                                }
                                action={
                                    <ExpandMore />
                                }
                                title={<Typography variant="body2">16 Bots</Typography>}
                            />
                        </Card>
                    </Box>
                </Box>
            </BackgroundBox>
        </LayoutWithNav >

    )
}