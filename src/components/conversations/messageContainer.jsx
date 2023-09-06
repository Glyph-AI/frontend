import { Box, useTheme } from "@mui/material";
import OutgoingMessage from "./outgoingMessage";
import IncomingMessage from "./incomingMessage";
import TypingIndicator from "./typingIndicator";
import { createRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function MessageContainer({ messageArray, toolsExt, renderSettings, typingIndicator = false }) {
    const messagesEndRef = createRef()
    const settingsPadding = renderSettings ? 47 : 0
    const theme = useTheme()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
                height: "calc(100% - 56px)",
                overflowY: "scroll",
                paddingTop: "24px",
                paddingBottom: (toolsExt ? (300 + settingsPadding) : (settingsPadding)) + "px",
                transition: "all .3s ease-out",
            }}
        >
            {
                messageArray.map((msg, idx) => {
                    if (msg.direction === "outgoing") {
                        return (
                            <OutgoingMessage content={msg.content} />
                        )
                    } else if (msg.direction === "incoming") {
                        return (
                            <IncomingMessage content={msg.content} />
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