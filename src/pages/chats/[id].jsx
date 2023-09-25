import { getBotById } from '@/components/api/bots';
import { getChatById } from '@/components/api/chats';
import { getCurrentUser } from '@/components/api/users';
import ChatsContainer from '@/components/chats/chatsContainer';
import { getCookie } from '@/components/utility/cookie_helper';
import LayoutWithNav from '@/components/utility/layouts/layout_with_nav';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Chat() {
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


    // REST pre-work for chats
    getChatById(router.query.id, (chatData) => {
      setChat(chatData)
      getBotById(chatData.bot_id, (botData) => {
        setBot(botData)
      })
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