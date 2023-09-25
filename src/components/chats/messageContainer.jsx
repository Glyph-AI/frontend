import { Box, useTheme } from "@mui/material";
import { createRef, useEffect } from "react";
import IncomingMessage from "./incomingMessage";
import OutgoingMessage from "./outgoingMessage";
import TypingIndicator from "./typingIndicator";

export default function MessageContainer({ messageArray, toolsExt, renderSettings, desktopMode, typingIndicator = false }) {
    const messagesEndRef = createRef()
    const settingsPadding = renderSettings ? 96 : 0
    const theme = useTheme()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messageArray, toolsExt])

    return (
        <Box
            className="message-container"
            sx={{
                padding: "8px",
                backgroundColor: theme.palette.background.main,
                display: "flex",
                gap: "14px",
                flexDirection: "column",
                height: `calc(100% - ${desktopMode ? "168px" : "56px"})`,
                overflowY: "scroll",
                paddingTop: `${56 + 24}px`,
                paddingBottom: (toolsExt ? (300 + settingsPadding) : (settingsPadding)) + "px",
                transition: "all .3s ease-out",
                "-ms-overflow-style": "none",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    display: "none"
                }
            }}
        >
            {
                messageArray.map((msg, idx) => {
                    if (msg.direction === "outgoing") {
                        return (
                            <OutgoingMessage content={msg.content} key={idx} />
                        )
                    } else if (msg.direction === "incoming") {
                        return (
                            <IncomingMessage content={msg.content} key={idx} />
                        )
                    }
                })
            }
            {
                typingIndicator && (<TypingIndicator />)
            }
            <div ref={messagesEndRef} style={{ height: "0px" }} />
        </Box>
    )
}