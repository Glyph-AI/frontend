import { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle, Divider, Paper, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { getCookie } from '@/components/utility/cookie_helper';
import LayoutWithNav from '@/components/utility/layout_with_nav';
import ToolDrawer from '@/components/chats/toolDrawer';
import MessageContainer from '@/components/chats/messageContainer';
import ChatHeader from '@/components/utility/headers/chatHeader';
import MessageInput from '@/components/chats/messageInput';
import BackgroundBox from '@/components/utility/common/backgroundBox';
import { getChatById, sendMessage } from '@/components/api/chats';
import { getBotById } from '@/components/api/bots';
import { getCurrentUser } from '@/components/api/users';

export default function Chat() {
  const [toolsExt, setToolsExt] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [botId, setBotId] = useState()
  const [chatId, setChatId] = useState()
  const [chatData, setChatData] = useState([])
  const [glyphTyping, setGlyphTyping] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [chat, setChat] = useState({})
  const [bot, setBot] = useState({})
  const [user, setUser] = useState({})
  const [ttsActive, setTtsActive] = useState(false)
  const [showTts, setShowTts] = useState(false)
  // const inputFile = useRef(null)
  const inputRef = useRef();
  const router = useRouter()

  const { id } = router.query

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
      router.push("/chats")
    }

    getCurrentUser((data) => {
      setUser(data)
      // Temporarily entitle all users to conversation mode, disable this at a point in the future
      setShowTts(data.conversation_mode)
      // setShowTts(true)
    })

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

  const handleNewMessage = (ev) => {
    ev.preventDefault()
    const newMessageJson = {
      role: "user",
      content: newMessage,
      chat_id: chatId,
      tts: false
    }
    setGlyphTyping(true)
    setTtsActive(false)
    const newChatData = [...chatData, { content: newMessage, sender: "You", sentTime: "Just now", direction: "outgoing" }]
    setChatData(newChatData)
    setNewMessage("")

    sendMessage(JSON.stringify(newMessageJson), (data) => {
      const newChatData = formatChatData(data.chat_messages)
      setChatData(newChatData)
      setGlyphTyping(false)
    })

    inputRef.current.focus();
  }

  // const handleUploadClick = (ev) => {
  //   inputFile.current.click()
  // }

  // const handleUpload = (ev) => {
  //   ev.preventDefault()
  //   const file = ev.target.files[0]
  //   const formData = new FormData()
  //   formData.append('file', file)

  //   if (file.size / 1024 / 1024 > 50) {
  //     setSnackbarMessage("File size too large.")
  //     setSnackbarOpen(true)
  //     return false
  //   }

  //   genericRequest(`/bots/${botId}/user_upload?=chat_id${chatId}`, "POST", formData, (data, status) => {
  //     if (status === 200) {
  //       getChatById(chatId, botId, (data) => {
  //         const formattedChatData = formatChatData(data.chat_messages)
  //         setSnackbarMessage(`${file.name} Uploaded`)
  //         setSnackbarOpen(true)
  //         setChatData(formattedChatData)
  //       })
  //     }
  //   }, {})
  // }
  const outOfMessagesError = () => {
    if (user.subscribed && user.messages_left <= 0) {
      return "You are out of messages for the month."
    } else {
      return "You are out of free messages! Please subscribe to continue using Glyph!"
    }
  }

  const renderBotSettings = () => {
    if (user.id === bot.creator_id) {
      return true
    }

    return false
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
        {/* <input
          onChange={(ev) => { handleUpload(ev) }}
          accept="text/*,application/csv,application/pdf,image/*,.mp3,audio/mp3"
          type='file'
          id='file'
          ref={inputFile}
          style={{ display: 'none' }}
        /> */}
        <BackgroundBox sx={{ height: "calc(100% - 56px)" }}>
          <ChatHeader bot={bot} user={user} chat={chat} />
          <MessageContainer messageArray={chatData} typingIndicator={glyphTyping} toolsExt={toolsExt} renderSettings={renderBotSettings()} />
          <Paper elevation={5} sx={{ position: "absolute", bottom: "0px", width: "100%", backgroundColor: "white" }}>
            {
              renderBotSettings() && (
                <ToolDrawer bot={bot} setBot={setBot} setToolsExt={setToolsExt} toolsExt={toolsExt} user={user} />
              )
            }
            <Divider sx={{ width: "100%" }} />
            <MessageInput
              user={user}
              onSubmit={handleNewMessage}
              inputProps={
                {
                  disabled: messageInputDisabled(),
                  onChange: (ev) => { setNewMessage(ev.target.value) },
                  value: newMessage,
                  ref: inputRef
                }
              }
              sendProps={
                {
                  disabled: messageInputDisabled()
                }

              }
            />
          </Paper>
        </BackgroundBox>
      </div >
    </LayoutWithNav>
  )
}