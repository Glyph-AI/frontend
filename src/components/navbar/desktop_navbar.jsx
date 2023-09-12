import { Avatar, Box, IconButton, styled, useTheme } from "@mui/material";
import { ChatBubble, Contacts, InsertDriveFile, Router, Settings } from "@mui/icons-material";
import NewChatIcon from "./new_chat_icon";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const StyledIconButton = styled(IconButton)(() => {
    const theme = useTheme()
    return (
        {
            width: "100%",
            height: "100px",
            borderRadius: 0
        }
    )
})

function NavbarButton({ active, children, ...props }) {
    const theme = useTheme()
    const activeStyle = {
        color: "white",
        backgroundColor: theme.palette.common.lightBlue,
        borderRight: `4px solid ${theme.palette.common.lightBlueHighlight}`
    }

    return (
        <StyledIconButton disableRipple sx={active ? { ...activeStyle } : null} {...props}>
            {children}
        </StyledIconButton>
    )
}

export default function DesktopNavbar({ activeTab, setActiveTab, user }) {
    const theme = useTheme()
    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <Box sx={{ pt: 4, borderRadius: 2, height: "100%", width: "80px", backgroundColor: theme.palette.primary.main }}>
            <NavbarButton onClick={() => { router.push("/") }}>
                <Avatar src={"/glyph-avatar.png"} sx={{ height: "42px", width: "42px" }} />
            </NavbarButton>
            <NavbarButton onClick={() => { setActiveTab("profile") }} active={activeTab === "profile"}>
                <Avatar src={user.profile_picture_location} sx={{ height: "42px", width: "42px" }} />
            </NavbarButton>
            <NavbarButton onClick={() => { setActiveTab("chats") }} active={activeTab === "chats"} >
                <ChatBubble sx={{ fontSize: "42px" }} />
            </NavbarButton>
            <NavbarButton onClick={() => { setActiveTab("bots") }} active={activeTab === "bots"}>
                <Contacts sx={{ fontSize: "42px" }} />
            </NavbarButton>
            <NavbarButton onClick={() => { setActiveTab("settings") }} active={activeTab === "settings"}>
                <Settings sx={{ fontSize: "42px" }} />
            </NavbarButton>
        </Box>
    )
}