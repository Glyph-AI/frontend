import React, { useState, useCallback, useEffect, useRef } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  TypingIndicator,
  Avatar,
  SendButton,
  AttachmentButton,
  InfoButton,
  Sidebar,
  ConversationList,
  Conversation,
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  StarButton,
  VoiceCallButton,
  VideoCallButton
} from '@chatscope/chat-ui-kit-react';
import {
  genericRequest,
  getRequest
} from '@/components/utility/request_helper';
import { WS_ROOT } from '@/components/utility/apiConfig';

const messages = [
  {
    message: "Hello my friend",
    sentTime: "just now",
    sender: "Joe"
  },
  {
    message: "Hello my friend",
    sentTime: "just now",
    sender: "Joe"
  }
]

export default function Home() {
  const [newMessage, setNewMessage] = useState("")
  // const [sidebarStyle, setSidebarStyle] = useState({});
  // const [chatContainerStyle, setChatContainerStyle] = useState({});
  // const [conversationContentStyle, setConversationContentStyle] = useState({});
  // const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [botId, setBotId] = useState()
  const [chatId, setChatId] = useState()
  const [chatData, setChatData] = useState([])
  const [chatToken, setChatToken] = useState("")
  const [websckt, setWebsckt] = useState();
  const [glyphTyping, setGlyphTyping] = useState(false)
  const inputFile = useRef(null)
  const inputRef = useRef();

  const botName = "Glyph"
  const handleBackClick = () => setSidebarVisible(!sidebarVisible);


  const handleConversationClick = useCallback(() => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [sidebarVisible, setSidebarVisible]);

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
    genericRequest(`/bots/${bot_id}/chats/`, "POST", JSON.stringify({ "name": "test chat" }), (data) => {
      callback(data)
    })
  }

  const getChatById = (chat_id, bot_id, callback = () => { }) => {
    getRequest(`/bots/${bot_id}/chats/${chat_id}/`, (data) => {
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

  const formatChatData = (dbChats) => {
    const formattedChats = dbChats.filter((dbMessage) => (!dbMessage.hidden)).map((dbMessage, index) => ({
      message: dbMessage.content,
      sender: dbMessage.role === "assistant" ? "Glyph" : "You",
      sentTime: formatSentTime(dbMessage.created_at),
      direction: dbMessage.role === "assistant" ? "incoming" : "outgoing"
    })).sort((a, b) => new Date(a.sentTime) - new Date(b.sentTime))

    return formattedChats
  }

  const openSocket = (bot_id, chat_id, chatToken) => {
    const url = `${WS_ROOT}/bots/${bot_id}/chats/${chat_id}/${chatToken}`
    const ws = new WebSocket(url)

    ws.onopen = (event) => {
      ws.send("Connect")
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data)
      const formattedMessages = formatChatData(message.chat_messages)
      console.log(formattedMessages.at(-1))
      if (formattedMessages.at(-1).sender === "Glyph") {
        setGlyphTyping(false)
      }
      setChatData(formattedMessages)

    }

    setWebsckt(ws)


    return () => ws.close()
  }

  useEffect(() => {
    // REST pre-work for chats
    getBotsForUser((data) => {
      if (data.length === 0) {
        createBotForUser((newBotData) => {
          createChatForBot(newBotData.id, (newChatData) => {
            const formattedChatData = formatChatData(newChatData.chat_messages)
            setChatData(formattedChatData)
            setBotId(newBotData.id)
            setChatId(newChatData.id)
            setChatToken(data[0].chats[0].chat_token)
            openSocket(newBotData.id, newChatData.id, data[0].chats[0].chat_token)
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
          setChatToken(data[0].chats[0].chat_token)
          openSocket(bot_id, chat_id, data[0].chats[0].chat_token)
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

    websckt.send(JSON.stringify(newMessageJson))

    // WebSocket.onmessage = (e) => {
    //   const chatData = JSON.parse(e.data)
    //   const formattedChatData = formatChatData(chatData.chat_messages)
    //   setChatData(formattedChatData)
    // }

    const newChatData = [...chatData, { message: newMessage, sender: "You", sentTime: "Just now", direction: "outgoing" }]
    setChatData(newChatData)
    setNewMessage("")
    setGlyphTyping(true)
    inputRef.current.focus();
  }

  const typingIndicator = () => {
    if (glyphTyping) {
      return <TypingIndicator content="Glpyh is typing" />
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

    genericRequest(`/bots/${botId}/user_upload/`, "POST", formData, (data, status) => {
      if (status === 200) {
        console.log("Upload Successful")
      }
    }, {})
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <input
        onChange={(ev) => { handleUpload(ev) }}
        accept=".txt"
        type='file'
        id='file'
        ref={inputFile}
        style={{ display: 'none' }}
      />
      <MainContainer>
        {/* <Sidebar position="left" scrollable={false} style={sidebarStyle}> */}
        {/* <ConversationList>
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
          </ConversationList> */}
        {/* </Sidebar> */}
        <ChatContainer>
          <ConversationHeader >
            {/* TODO: Multiple Bots */}
            {/* <ConversationHeader.Back onClick={handleBackClick} /> */}
            <Avatar src={"/glpyh-avatar.png"} name={"Zoe"} />
            <ConversationHeader.Content userName={botName} info="Active Now" />
            <ConversationHeader.Actions>
              {/* TODO: Handle Voice Calls */}
              {/* <VoiceCallButton title="Start voice call" /> */}
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList typingIndicator={typingIndicator()}>
            {
              chatData && chatData.map((obj, index) => {
                return (<Message model={obj} key={index} />)
              })
            }
          </MessageList>
          <div as={MessageInput} style={{
            display: "flex",
            flexDirection: "row",
            borderTop: "1px solid #d1dbe4"
          }}>
            <MessageInput ref={inputRef} onChange={(val) => { setNewMessage(val) }} value={newMessage} sendButton={false} attachButton={false} onSend={handleNewMessage} style={{
              flexGrow: 1,
              borderTop: 0,
              flexShrink: "initial"
            }} />
            <SendButton onClick={() => handleNewMessage(newMessage)} disabled={newMessage.length === 0} style={{
              fontSize: "1.2em",
              marginLeft: 0,
              paddingLeft: "0.2em",
              paddingRight: "0.2em"
            }} />
            <AttachmentButton style={{
              fontSize: "1.2em",
              paddingLeft: "0.2em",
              paddingRight: "0.2em"
            }}
              onClick={handleUploadClick}
            />
            <InfoButton onClick={() => alert("Important message!")} style={{
              fontSize: "1.2em",
              paddingLeft: "0.2em",
              paddingRight: "0.2em"
            }} />
          </div>
        </ChatContainer>
      </MainContainer>
    </div >
  )
}
