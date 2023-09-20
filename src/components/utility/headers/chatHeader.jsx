"use client";
import NewBotModal from "@/components/bots/newBotModal";
import { ArrowBack, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StyledAppBar } from "../styled/styledAppBar";
import { StyledToolbar } from "../styled/styledToolbar";


export default function ChatHeader({ bot, user, chat, desktopMode }) {
    const [botModalOpen, setBotModalOpen] = useState(false)
    const theme = useTheme()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        let bot_id = searchParams.get("bot_id")
        if (bot_id !== undefined && bot_id !== null) {
            setBotModalOpen(true)
        }
    }, [searchParams])

    const enabledFiles = () => {
        if (typeof bot.enabled_texts !== "undefined") {
            const files = bot.enabled_texts.filter((el) => {
                return el.text_type !== "note"
            })

            if (files.length === 1) {
                return `${files.length} file`
            }

            return `${files.length} files`
        }
    }

    const enabledNotes = () => {
        if (typeof bot.enabled_texts !== "undefined") {
            const notes = bot.enabled_texts.filter((el) => {
                return el.text_type === "note"
            })

            if (notes.length === 1) {
                return `${notes.length} note`
            }
            return `${notes.length} notes`
        }
    }

    const enabledTools = () => {
        if (typeof bot.enabled_tools !== "undefined") {
            if (bot.enabled_tools.length === 1) {
                return `${bot.enabled_tools.length} tool`
            }
            return `${bot.enabled_tools.length} tools`
        }
    }

    const handleBotModalClose = () => {
        setBotModalOpen(false)
        if (desktopMode) {
            router.push("/")
        } else {
            router.push(`/chats/${chat.id}`)
        }

    }

    const handleSettingsRouting = () => {
        if (desktopMode) {
            router.query.bot_id = bot.id
            router.push(router)
        } else {
            router.push(`/chats/${chat.id}?bot_id=${bot.id}`)
        }
    }

    return (
        <>
            <StyledAppBar
                position="sticky"
                elevation={desktopMode ? 0 : 5}
                sx={{
                    fontWeight: 500
                }}
            >
                <StyledToolbar
                    sx={desktopMode && ({ width: "100%", paddingLeft: "0px !important" })}
                >
                    {
                        !desktopMode && (
                            <IconButton
                                onClick={() => { router.push("/chats") }}
                                sx={{ color: theme.palette.common.darkBlue }}
                            >
                                <ArrowBack />
                            </IconButton>
                        )
                    }
                    <Avatar src={bot.avatar_location || "/glyph-avatar.png"} />
                    <Box sx={{ paddingLeft: "8px", flex: 1 }}>
                        <Typography variant="body" sx={{ color: theme.palette.common.darkBlue }}>{bot.name}</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.common.subtitleBlue }}>{enabledTools()}, {enabledFiles()}, {enabledNotes()}</Typography>
                    </Box>
                    {
                        !desktopMode && (
                            <IconButton edge="end" onClick={() => { handleSettingsRouting() }}>
                                <MoreVert sx={{ color: desktopMode ? theme.palette.primary.main : "rgba(0,0,0,0.54)" }} />
                            </IconButton>
                        )
                    }

                </StyledToolbar>
                <Divider sx={{ width: "100%" }} />
                {
                    !desktopMode && (
                        <NewBotModal
                            open={botModalOpen}
                            handleClose={handleBotModalClose}
                            user={user}
                            editMode={true}
                        />
                    )
                }

            </StyledAppBar>

        </>
    )
}