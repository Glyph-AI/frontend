import { ChatBubble, Contacts, InsertDriveFile, SmartToy } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Icon, Paper, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import NewChatIcon from "./new_chat_icon";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [navValue, setNavValue] = useState(0)
    const theme = useTheme()
    const router = useRouter()

    useEffect(() => {
        if (window !== undefined) {
            if (window.location.href.includes("chats")) {
                setNavValue(0)
            } else if (window.location.href.includes("bots")) {
                setNavValue(1)
            } else if (window.location.href.includes("notes")) {
                setNavValue(2)
            } else {
                setNavValue(null)
            }
        }
    }, [])

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1400 }} elevation={3}>
            <BottomNavigation
                onChange={(event, newValue) => {
                    setNavValue(newValue);
                }}
                value={navValue}
                sx={{
                    "& .Mui-selected, .Mui-selected > svg": {
                        color: theme.palette.primary.main
                    }
                }}
            >
                <BottomNavigationAction disableRipple value={0} onClick={() => { router.push("/chats") }} icon={<ChatBubble sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction disableRipple value={1} onClick={() => { router.push("/bots") }} icon={<Contacts sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction disableRipple value={2} onClick={() => { router.push("/home?files=true") }} icon={<InsertDriveFile sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction disableRipple onClick={() => { router.push(`${router.pathname}?create=true`) }} icon={<NewChatIcon sx={{ fontSize: "24px" }} />} />
            </BottomNavigation>
        </Paper>
    )
}