import IncomingMessage from "@/components/conversations/incomingMessage";
import MessageContainer from "@/components/conversations/messageContainer";
import MessageInput from "@/components/conversations/messageInput";
import OutgoingMessage from "@/components/conversations/outgoingMessage";
import ToolDrawer from "@/components/conversations/toolDrawer";
import ChatHeader from "@/components/utility/headers/chatHeader";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { Box, Divider } from "@mui/material";
import { useState } from "react";

const content = "Can you check this chart and review Game Master notes to see if Kim can Level up tonight: https://5thsrd.org/rules/leveling_up/"
const messageArray = [
    {
        content: "First message",
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
    {
        content: content,
        direction: "incoming"
    },
    {
        content: content,
        direction: "outgoing"
    },
]

export default function Index() {
    const [toolsExt, setToolsExt] = useState(false)
    return (
        <LayoutWithNav showNavigation={false}>
            <Box sx={{height: "100%"}}>
            <ChatHeader/>
            <MessageContainer messageArray={messageArray} typingIndicator={true} toolsExt={toolsExt}/>
            <Box sx={{position: "absolute", bottom: "0px", width: "100%", backgroundColor: "white"}}>
                <ToolDrawer bot={null} setToolsExt={setToolsExt} toolsExt={toolsExt}/>
                <Divider sx={{width: "100%"}}/>
                <MessageInput/>
            </Box>
            </Box>
        </LayoutWithNav>
    )
}