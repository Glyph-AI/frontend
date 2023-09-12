import { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle, Divider, Paper, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { getCookie } from '@/components/utility/cookie_helper';
import LayoutWithNav from '@/components/utility/layouts/layout_with_nav';
import ToolDrawer from '@/components/chats/toolDrawer';
import MessageContainer from '@/components/chats/messageContainer';
import ChatHeader from '@/components/utility/headers/chatHeader';
import MessageInput from '@/components/chats/messageInput';
import BackgroundBox from '@/components/utility/common/backgroundBox';
import { getChatById, sendMessage } from '@/components/api/chats';
import { getBotById } from '@/components/api/bots';
import { getCurrentUser } from '@/components/api/users';
import ChatsContainer from '@/components/chats/chatsContainer';

export default function Chat() {


  const [botId, setBotId] = useState()
  const [chatId, setChatId] = useState()
  const [chatData, setChatData] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [chat, setChat] = useState({})
  const [bot, setBot] = useState({})
  const [user, setUser] = useState({})
  const [showTts, setShowTts] = useState(false)
  // const inputFile = useRef(null)
  const router = useRouter()

  const { id } = router.query



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



  return (
    <LayoutWithNav showNavigation={false}>
      <ChatsContainer
        bot={bot}
        setBot={setBot}
        chat={chat}
        user={user}
      />
    </LayoutWithNav>
  )
}