"use client";
import { ArrowBack, MoreVert } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { StyledAppBar } from "../styled/styledAppBar";
import { StyledToolbar } from "../styled/styledToolbar";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveText } from "@/components/api/texts";
import EditableTextField from "@/components/settings/editableTextField";


export default function NoteHeader({ note, setNote, user, desktopMode }) {
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

    const handleSettingsRouting = () => {
        if (desktopMode) {
            router.query.bot_id = bot.id
            router.push(router)
        } else {
            router.push(`/chats/${chat.id}?bot_id=${bot.id}`)
        }
    }

    const handleNameChange = (val) => {
        setNote({ ...note, name: val })
    }

    const handleNameSubmit = () => {
        saveText(note.id, { ...note, name: note.name }, (data) => {
            setNote(data)
        })
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
                    <Box sx={{ paddingLeft: "8px", flex: 1 }}>
                        <EditableTextField placeholder={note.name} handleChange={handleNameChange} handleSubmit={handleNameSubmit} />
                        <Typography variant="body2" sx={{ color: theme.palette.common.subtitleBlue }}>{note.content.length} characters</Typography>
                    </Box>
                    <IconButton edge="end" onClick={() => { handleSettingsRouting() }}>
                        <MoreVert sx={{ color: desktopMode ? theme.palette.primary.main : "rgba(0,0,0,0.54)" }} />
                    </IconButton>
                </StyledToolbar>
                <Divider sx={{ width: "100%" }} />
            </StyledAppBar>

        </>
    )
}