import { ChatBubble, Contacts, InsertDriveFile, SmartToy } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Icon, Paper, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import NewChatIcon from "./new_chat_icon";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [navValue, setNavValue] = useState(0)
    const theme = useTheme()
    const router = useRouter()
    console.log(navValue)

    useEffect(() => {
        if (window !== undefined) {
            if (window.location.href.includes("conversations")) {
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
                disableRipple
                sx={{
                    "& .Mui-selected, .Mui-selected > svg": {
                        color: theme.palette.primary.main
                    }
                }}
            >
                <BottomNavigationAction value={0} onClick={() => { router.push("/conversations") }} icon={<ChatBubble sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction value={1} onClick={() => { router.push("/bots") }} icon={<Contacts sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction value={2} onClick={() => { router.push("/home?files=true") }} icon={<InsertDriveFile sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction onClick={() => { router.push(`${router.pathname}?create=true`) }} icon={<NewChatIcon sx={{ fontSize: "24px" }} />} />
            </BottomNavigation>
        </Paper>
    )
}