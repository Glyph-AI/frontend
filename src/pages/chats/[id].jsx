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
import { Alert, AlertTitle, Box, Icon, IconButton, Link, Snackbar, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useRouter } from 'next/router';
import Layout from '@/components/utility/layout';
import { motion } from "framer-motion";
import { getCookie } from '@/components/utility/cookie_helper';
import { theme } from '@/components/utility/theme.jsx';
import LayoutWithNav from '@/components/utility/layout_with_nav';
import { useUserContext } from '@/context/user';
import { Mic, Phone, Settings } from '@mui/icons-material';
import { API_ROOT } from '@/components/utility/apiConfig';

export default function Home() {
  const [newMessage, setNewMessage] = useState("")
  const [botId, setBotId] = useState()
  const [chatId, setChatId] = useState()
  const [chatData, setChatData] = useState([])
  const [glyphTyping, setGlyphTyping] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [chat, setChat] = useState("")
  const [bot, setBot] = useState("")
  const [user, setUser] = useState({})
  const [ttsActive, setTtsActive] = useState(false)
  const [showTts, setShowTts] = useState(false)
  const inputFile = useRef(null)
  const inputRef = useRef();
  const menuOpen = Boolean(anchorEl);
  const router = useRouter()

  const { id } = router.query

  const getChatById = (chat_id, callback = () => { }) => {
    getRequest(`/chats/${chat_id}`, (data) => {
      callback(data)
    })
  }

  const getUser = () => {
    getRequest("/profile", (data) => {
      setUser(data)
    })
  }

  const getBotById = (bot_id, callback = () => { }) => {
    getRequest(`/bots/${bot_id}`, (data) => {
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

  const customMessageContent = (message) => {
    return (
      <Message.CustomContent>
        <Box className="messageContent" sx={{ color: theme.palette.text.primary }}>
          <ReactMarkdown
            children={message.content}
            remarkPlugins={[remarkGfm]}
            // linkTarget="_blank"
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    wrapLongLines
                    children={String(children).replace(/\n$/, '')}
                    style={atomOneDark}
                    language={match[1]}
                    PreTag="div"
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </Box>
      </Message.CustomContent>
    )
  }

  const customMessage = (message, index) => {
    if (message.sender === "system") {
      return (<MessageSeparator>{message.content}</MessageSeparator>)
    } else if (message.sender == "You") {
      return (<Message model={message} key={index} style={{ fontSize: "16px" }} >
        {customMessageContent(message)}
      </Message>)
    } else {
      return (<Message className="TestClass2" model={message} key={index} style={{ fontSize: "16px" }}>
        {customMessageContent(message)}
      </Message>)
    }
  }

  const formatChatData = (dbChats) => {
    const formattedChats = dbChats.filter((dbMessage) => (!dbMessage.hidden)).map((dbMessage, index) => ({
      content: dbMessage.content,
      sender: roleFormatter(dbMessage.role),
      sentTime: formatSentTime(dbMessage.created_at),
      direction: directionFormatter(dbMessage.role),
      tts: dbMessage.tts,
      id: dbMessage.id
    })).sort((a, b) => new Date(a.sentTime) - new Date(b.sentTime))

    return formattedChats
  }

  useEffect(() => {
    const activeSession = getCookie("active_session")
    if (activeSession !== "true") {
      router.push("/login")
    }

    if (id === undefined) {
      router.push("/conversations")
    }

    getUser()

    setChatId(id)


    // REST pre-work for chats
    getChatById(router.query.id, (chatData) => {
      const formattedChatData = formatChatData(chatData.chat_messages)
      setChatData(formattedChatData)
      setChat(chatData)
      getBotById(chatData.bot_id, (botData) => {
        setBot(botData)
      })
      setBotId(chatData.bot_id)
    })

    if (user.conversation_mode) {
      setShowTts(true)
    }

  }, [])

  const handleNewMessage = (overrideContent = null) => {
    const messageContent = overrideContent || newMessage
    const tts = Boolean(overrideContent)
    const newMessageJson = {
      role: "user",
      content: messageContent,
      chat_id: chatId,
      tts: tts
    }
    setGlyphTyping(true)
    setTtsActive(false)
    const newChatData = [...chatData, { content: messageContent, sender: "You", sentTime: "Just now", direction: "outgoing" }]
    setChatData(newChatData)
    setNewMessage("")

    genericRequest(`/chats/${chatId}/message`, "POST", JSON.stringify(newMessageJson), (data) => {
      const newChatData = formatChatData(data.chat_messages)
      const last_message = newChatData[newChatData.length - 1]
      // get last chat message and see if it's tts or not
      setChatData(newChatData)
      setGlyphTyping(false)
      if (last_message.tts) {
        // make api call out to google cloud to generate this.
        const audio_obj = new Audio(`${API_ROOT}/chats/${chatId}/message/${last_message.id}/tts`)
        audio_obj.play()
      }
    })

    inputRef.current.focus();
  }

  const typingIndicator = () => {
    if (glyphTyping) {
      return <TypingIndicator style={{ backgroundColor: theme.palette.background.default }} content="Glyph is typing" />
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

    if (file.size / 1024 / 1024 > 50) {
      setSnackbarMessage("File size too large.")
      setSnackbarOpen(true)
      return false
    }

    genericRequest(`/bots/${botId}/user_upload?=chat_id${chatId}`, "POST", formData, (data, status) => {
      if (status === 200) {
        getChatById(chatId, botId, (data) => {
          const formattedChatData = formatChatData(data.chat_messages)
          setSnackbarMessage(`${file.name} Uploaded`)
          setSnackbarOpen(true)
          setChatData(formattedChatData)
        })
      }
    }, {})
  }
  const outOfMessagesError = () => {
    if (user.subscribed && user.messages_left <= 0) {
      return "You are out of messages for the month."
    } else {
      return "You are out of free messages! Please subscribe to continue using Glyph!"
    }
  }

  const renderBotSettings = () => {
    if (user.id === bot.creator_id) {
      return (
        <IconButton size="large" onClick={() => { router.push(`/bots/${bot.id}?chat_id=${chatId}`) }}>
          <Settings fontSize="inherit" />
        </IconButton>
      )
    }
  }


  const messageInputDisabled = () => {
    if (user.messages_left <= 0) {
      return true
    }

    return false
  }

  return (
    <LayoutWithNav showNavigation={false}>
      <div style={{ height: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbarOpen}
          audoHideDuration={6000}
          onClick={() => { setSnackbarOpen(false) }}
          onClose={() => { setSnackbarOpen(false) }}
          message={snackbarMessage}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={user.messages_left <= 0}
          onClick={() => { router.push("/profile") }}
        >
          <Alert severity="error">
            <AlertTitle>Out of Messages!</AlertTitle>
            {outOfMessagesError()} Click Here to subscribe!
          </Alert>
        </Snackbar>
        <input
          onChange={(ev) => { handleUpload(ev) }}
          accept="text/*,application/csv,application/pdf,image/*,.mp3,audio/mp3"
          type='file'
          id='file'
          ref={inputFile}
          style={{ display: 'none' }}
        />
        <MainContainer>
          <ChatContainer>
            <ConversationHeader >
              <ConversationHeader.Back onClick={() => { router.push("/conversations") }} />
              <Avatar src={bot.avatar_location || "/glyph-avatar.png"} name={bot.name} />
              <ConversationHeader.Content userName={<Typography variant="h6">{bot.name}</Typography>} info={chat.name} />
              <ConversationHeader.Actions>
                {
                  showTts && (
                    <IconButton onClick={() => { router.push(`/voice/${chatId}`) }}>
                      <Phone />
                    </IconButton>
                  )
                }

                {
                  renderBotSettings()
                }
              </ConversationHeader.Actions>

            </ConversationHeader>
            <MessageList style={{ display: "flex", backgroundColor: theme.palette.background.default }} typingIndicator={typingIndicator()}>
              {
                chatData && chatData.map((obj, index) => {
                  return customMessage(obj, index)
                })
              }
            </MessageList>
            <div as={MessageInput} style={{
              display: "flex",
              flexDirection: "row",
              borderTop: "1px solid #d1dbe4"
            }}>
              {
                (user.id === bot.creator_id && Math.abs(user.files_left) > 0) && <AttachmentButton
                  style={{
                    fontSize: "1.2em",
                    paddingLeft: "0.2em",
                    paddingRight: "0.2em"
                  }}
                  onClick={handleUploadClick}
                />
              }
              <MessageInput
                ref={inputRef}
                onChange={(val) => { setNewMessage(val) }}
                value={newMessage}
                sendButton={false}
                disabled={messageInputDisabled()}
                attachButton={false}
                onSend={handleNewMessage} style={{
                  flexGrow: 1,
                  borderTop: 0,
                  flexShrink: "initial"
                }}
              />
              <SendButton onClick={handleNewMessage} disabled={newMessage.length === 0} style={{
                fontSize: "1.2em",
                marginLeft: 0,
                paddingLeft: "0.2em",
                paddingRight: "0.2em"
              }} />
            </div>
          </ChatContainer>
        </MainContainer>
      </div >
    </LayoutWithNav>
  )
}