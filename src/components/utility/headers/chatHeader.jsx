"use client";
import { ArrowBack, MoreVert } from "@mui/icons-material";
import { AppBar, Avatar, Box, Divider, IconButton, Toolbar, Typography, styled, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { StyledAppBar, StyledToolbar } from "./baseHeader";


export default function ChatHeader({ bot, user }) {
    const theme = useTheme()
    const router = useRouter()

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
                        onClick={() => { router.push("/conversations") }}
                        sx={{ color: theme.palette.common.darkBlue }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Avatar src={bot.avatar_location || "/glyph-avatar.png"} />
                    <Box sx={{ paddingLeft: "8px", width: "80%" }}>
                        <Typography variant="body" sx={{ color: theme.palette.common.darkBlue }}>{bot.name}</Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.common.subtitleBlue }}>{enabledTools()}, {enabledFiles()}, {enabledNotes()}</Typography>
                    </Box>
                    <IconButton edge="end">
                        <MoreVert />
                    </IconButton>
                </StyledToolbar>
                <Divider sx={{ width: "100%" }} />
            </StyledAppBar>

        </>
    )
}