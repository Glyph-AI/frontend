import React, { useState, useCallback, useEffect, useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  TypingIndicator,
  Avatar,
  SendButton,
  AttachmentButton,
  EllipsisButton,
  MessageSeparator,
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader
} from '@chatscope/chat-ui-kit-react';
import {
  genericRequest,
  getRequest
} from '@/components/utility/request_helper';
import { Snackbar } from '@mui/material'
import { useRouter } from 'next/router';
import Layout from '@/components/utility/layout';
import DropdownMenu from '@/components/common/dropdownMenu.jsx';
import { motion } from "framer-motion";

export default function Home() {
  const [newMessage, setNewMessage] = useState("")
  const [botId, setBotId] = useState()
  const [chatId, setChatId] = useState()
  const [chatData, setChatData] = useState([])
  const [glyphTyping, setGlyphTyping] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const inputFile = useRef(null)
  const inputRef = useRef();
  const menuOpen = Boolean(anchorEl);
  const router = useRouter()

  const { id } = router.query

  const botName = "Glyph"

  const getBotsForUser = (callback = () => { }) => {
    getRequest("/bots/", (data) => {
      callback(data)
    })
  }

  const createBotForUser = (callback = () => { }) => {
    genericRequest("/bots/", "POST", JSON.stringify({ "name": "test bot" }), (data) => {
      callback(data)
    })
  }

  const createChatForBot = (bot_id, callback = () => { }) => {
    genericRequest(`/chats/`, "POST", JSON.stringify({ "name": "test chat" }), (data) => {
      callback(data)
    })
  }

  const getChatById = (chat_id, bot_id, callback = () => { }) => {
    getRequest(`/chats/${chat_id}/`, (data) => {
      callback(data)
    })
  }

  const formatSentTime = (sentTime) => {
    var currentDateTime = Date.now()
    if ((currentDateTime - sentTime) <= (1 * 60 * 1000)) {
      return "Just now"
    } else {
      return sentTime
    }
  }

  const roleFormatter = (role) => {
    if (role === "assistant") {
      return "Glyph"
    } else if (role === "system") {
      return "system"
    } else {
      return "You"
    }
  }

  const directionFormatter = (role) => {
    if (role === "assistant") {
      return "incoming"
    } else if (role === "system") {
      return "incoming"
    } else {
      return "outgoing"
    }
  }

  const formatChatData = (dbChats) => {
    const formattedChats = dbChats.filter((dbMessage) => (!dbMessage.hidden)).map((dbMessage, index) => ({
      message: dbMessage.content,
      sender: roleFormatter(dbMessage.role),
      sentTime: formatSentTime(dbMessage.created_at),
      direction: directionFormatter(dbMessage.role)
    })).sort((a, b) => new Date(a.sentTime) - new Date(b.sentTime))

    return formattedChats
  }

  useEffect(() => {
    if (id === undefined) {
      router.push("/conversations")
    }
    // REST pre-work for chats
    getBotsForUser((data) => {
      if (data.length === 0) {
        createBotForUser((newBotData) => {
          createChatForBot(newBotData.id, (newChatData) => {
            const formattedChatData = formatChatData(newChatData.chat_messages)
            setChatData(formattedChatData)
            setBotId(newBotData.id)
            setChatId(newChatData.id)
          })
        })
      } else {
        var bot_id = data[0].id
        var chat_id = data[0].chats[0].id
        getChatById(chat_id, bot_id, (chatData) => {
          const formattedChatData = formatChatData(chatData.chat_messages)
          setChatData(formattedChatData)
          setBotId(bot_id)
          setChatId(chat_id)
        })
      }
    })

  }, [])

  const handleNewMessage = () => {
    const newMessageJson = {
      role: "user",
      content: newMessage,
      chat_id: chatId
    }
    setGlyphTyping(true)
    const newChatData = [...chatData, { message: newMessage, sender: "You", sentTime: "Just now", direction: "outgoing" }]
    setChatData(newChatData)
    setNewMessage("")

    genericRequest(`/bots/${botId}/chats/${chatId}/message`, "POST", JSON.stringify(newMessageJson), (data) => {
      const newChatData = formatChatData(data.chat_messages)
      setChatData(newChatData)
      setGlyphTyping(false)
    })

    inputRef.current.focus();
  }

  const typingIndicator = () => {
    if (glyphTyping) {
      return <TypingIndicator content="Glyph is typing" />
    } else {
      return null
    }
  }

  const handleUploadClick = (ev) => {
    inputFile.current.click()
  }

  const handleUpload = (ev) => {
    ev.preventDefault()
    const file = ev.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    console.log(file)

    genericRequest(`/bots/${botId}/chats/${chatId}/user_upload`, "POST", formData, (data, status) => {
      if (status === 200) {
        console.log("Upload Successful")
        getChatById(chatId, botId, (data) => {
          const formattedChatData = formatChatData(data.chat_messages)
          setSnackbarMessage(`${file.name} Uploaded`)
          setSnackbarOpen(true)
          setChatData(formattedChatData)
        })
      }
    }, {})
  }

  const handleMenuOpen = (ev) => {
    setAnchorEl(ev.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Layout>
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -200, y: 0 },
          enter: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 0, y: -100 }
        }}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{
          type: "linear"
        }}
        style={{ height: "100%" }}
      >
        <div style={{ height: "100%" }}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={snackbarOpen}
            audoHideDuration={6000}
            onClick={() => { setSnackbarOpen(false) }}
            onClose={() => { setSnackbarOpen(false) }}
            message={snackbarMessage}
          />
          <input
            onChange={(ev) => { handleUpload(ev) }}
            accept="text/*,application/csv,application/pdf,image/*,.mp3,audio/mp3"
            type='file'
            id='file'
            ref={inputFile}
            style={{ display: 'none' }}
          />
          <DropdownMenu anchor={anchorEl} open={menuOpen} handleMenuClose={handleMenuClose} />
          <MainContainer>
            <ChatContainer>
              <ConversationHeader >
                <ConversationHeader.Back onClick={() => { router.push("/conversations") }} />
                <Avatar src={"/glyph-avatar.png"} name={"Glyph"} />
                <ConversationHeader.Content userName={botName} info="Active Now" />
                <ConversationHeader.Actions>
                  <EllipsisButton orientation="vertical" onClick={handleMenuOpen} style={{
                    fontSize: "1.2em",
                    paddingLeft: "0.2em",
                    paddingRight: "0.2em"
                  }} />
                </ConversationHeader.Actions>
              </ConversationHeader>
              <MessageList typingIndicator={typingIndicator()}>
                {
                  chatData && chatData.map((obj, index) => {
                    if (obj.sender === "system") {
                      return (<MessageSeparator>{obj.message}</MessageSeparator>)
                    } else {
                      return (<Message model={obj} key={index} style={{ fontSize: "16px" }} />)
                    }
                  })
                }
              </MessageList>
              <div as={MessageInput} style={{
                display: "flex",
                flexDirection: "row",
                borderTop: "1px solid #d1dbe4"
              }}>
                <AttachmentButton style={{
                  fontSize: "1.2em",
                  paddingLeft: "0.2em",
                  paddingRight: "0.2em"
                }}
                  onClick={handleUploadClick}
                />
                <MessageInput
                  ref={inputRef}
                  onChange={(val) => { setNewMessage(val) }}
                  value={newMessage}
                  sendButton={false}
                  attachButton={false}
                  onSend={handleNewMessage} style={{
                    flexGrow: 1,
                    borderTop: 0,
                    flexShrink: "initial"
                  }}
                />
                <SendButton onClick={() => handleNewMessage(newMessage)} disabled={newMessage.length === 0} style={{
                  fontSize: "1.2em",
                  marginLeft: 0,
                  paddingLeft: "0.2em",
                  paddingRight: "0.2em"
                }} />
                {/* <EllipsisButton orientation="vertical" onClick={() => alert("Important message!")} style={{
                  fontSize: "1.2em",
                  paddingLeft: "0.2em",
                  paddingRight: "0.2em"
                }} /> */}
              </div>
            </ChatContainer>
          </MainContainer>
        </div >
      </motion.div>
    </Layout>
  )
}