"use client";
import { ArrowBack, MoreVert } from "@mui/icons-material";
import { AppBar, Avatar, Box, Divider, IconButton, Toolbar, Typography, styled, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { StyledAppBar } from "../styled/styledAppBar";
import { StyledToolbar } from "../styled/styledToolbar";
import NewBotModal from "@/components/bots/newBotModal";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


export default function ChatHeader({ bot, user, chat }) {
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
        router.push(`/chats/${chat.id}`)
    }

    return (
        <>
            <StyledAppBar
                position="sticky"
                elevation={5}
                sx={{
                    fontWeight: 500
                }}
            >
                <StyledToolbar>
                    <IconButton
                        onClick={() => { router.push("/chats") }}
                        sx={{ color: theme.palette.common.darkBlue }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Avatar src={bot.avatar_location || "/glyph-avatar.png"} />
                    <Box sx={{ paddingLeft: "8px", width: "80%" }}>
                        <Typography variant="body" sx={{ color: theme.palette.common.darkBlue }}>{bot.name}</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.common.subtitleBlue }}>{enabledTools()}, {enabledFiles()}, {enabledNotes()}</Typography>
                    </Box>
                    <IconButton edge="end" onClick={() => { router.push(`/chats/${chat.id}?bot_id=${bot.id}`) }}>
                        <MoreVert />
                    </IconButton>
                </StyledToolbar>
                <Divider sx={{ width: "100%" }} />
                <NewBotModal
                    open={botModalOpen}
                    handleClose={handleBotModalClose}
                    user={user}
                    editMode={true}
                />
            </StyledAppBar>

        </>
    )
}