import { ChatBubble, Contacts, InsertDriveFile, SmartToy } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Icon, Paper } from "@mui/material";
import NewChatIcon from "./new_chat_icon";

export default function Navbar() {
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation>
                <BottomNavigationAction icon={<ChatBubble sx={{fontSize: "24px"}}/>}/>
                <BottomNavigationAction icon={<Contacts sx={{fontSize: "24px"}} />}/>
                <BottomNavigationAction icon={<InsertDriveFile sx={{fontSize: "24px"}} />}/>
                <BottomNavigationAction icon={<NewChatIcon sx={{fontSize: "24px"}}/>}/>
            </BottomNavigation>
        </Paper>
    )
}