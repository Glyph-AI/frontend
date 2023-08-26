import { Box } from "@mui/material";
import OutgoingMessage from "./outgoingMessage";
import IncomingMessage from "./incomingMessage";
import TypingIndicator from "./typingIndicator";
import { createRef } from "react";
import { useEffect } from "react";

export default function MessageContainer({messageArray, toolsExt, typingIndicator = false}) {
    const messagesEndRef = createRef()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [])

    return (
        <Box 
            className="message-container"
            sx={{
                padding: "8px", 
                backgroundColor: "#f7f7f7", 
                display: "flex", 
                gap: "14px", 
                flexDirection: "column",
                height: "calc(100% - 56px)",
                overflowY: "scroll",
                paddingTop: "16px",
                paddingBottom: toolsExt ? "395px" : "95px",
                transition: "all .3s ease-out",
            }}
        >
            {
                messageArray.map((msg, idx) => {
                    if (msg.direction === "outgoing") {
                        return (
                            <OutgoingMessage content={msg.content}/>
                        )
                    } else if (msg.direction === "incoming") {
                        return (
                            <IncomingMessage content={msg.content}/>
                        )
                    }
                })
            }
            {
                typingIndicator && (<TypingIndicator/>)
            }
            <div ref={messagesEndRef} style={{height: "0px"}}/>
        </Box>
    )
}