import { ChatBubble, Contacts, InsertDriveFile, SmartToy } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Icon, Paper } from "@mui/material";
import { useRouter } from "next/router";
import NewChatIcon from "./new_chat_icon";

export default function Navbar() {
    const router = useRouter()
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation>
                <BottomNavigationAction onClick={() => { router.push("/conversations") }} icon={<ChatBubble sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction onClick={() => { router.push("/profile?bots=true") }} icon={<Contacts sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction onClick={() => { router.push("/profile?files=true") }} icon={<InsertDriveFile sx={{ fontSize: "24px" }} />} />
                <BottomNavigationAction onClick={() => { router.push("/conversations?create=true") }} icon={<NewChatIcon sx={{ fontSize: "24px" }} />} />
            </BottomNavigation>
        </Paper>
    )
}