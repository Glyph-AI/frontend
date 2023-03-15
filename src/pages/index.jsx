import React, { useState, useCallback, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { Sidebar, ConversationList, Conversation, MainContainer, ChatContainer, MessageList, Message, MessageInput, ConversationHeader, StarButton, VoiceCallButton, VideoCallButton, InfoButton } from '@chatscope/chat-ui-kit-react';

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
  const [sidebarStyle, setSidebarStyle] = useState({});
  const [chatContainerStyle, setChatContainerStyle] = useState({});
  const [conversationContentStyle, setConversationContentStyle] = useState({});
  const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const botName = "Glpyh"
  const handleBackClick = () => setSidebarVisible(!sidebarVisible);

  const handleConversationClick = useCallback(() => {
    if (sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [sidebarVisible, setSidebarVisible]);

  useEffect(() => {
    if (sidebarVisible) {
      setSidebarStyle({
        display: "flex",
        flexBasis: "auto",
        width: "100%",
        maxWidth: "100%"
      });
      setConversationContentStyle({
        display: "flex"
      });
      setConversationAvatarStyle({
        marginRight: "1em"
      });
      setChatContainerStyle({
        display: "none"
      });
    } else {
      setSidebarStyle({ display: "none" });
      setConversationContentStyle({});
      setConversationAvatarStyle({});
      setChatContainerStyle({});
    }
  }, [sidebarVisible, setSidebarVisible, setConversationContentStyle, setConversationAvatarStyle, setSidebarStyle, setChatContainerStyle]);

  const handleNewMessage = () => {
    messages.push(
      {
        message: newMessage,
        sentTime: "just now",
        sender: "You",
        direction: "outgoing"
      }
    )
    setNewMessage("")

  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <MainContainer>
        <Sidebar position="left" scrollable={false} style={sidebarStyle}>
          <ConversationList>
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
            <Conversation onClick={handleConversationClick} name="Lilly" lastSenderName="Lilly" info="HELLO" />
          </ConversationList>
        </Sidebar>
        <ChatContainer style={chatContainerStyle}>
          <ConversationHeader >
            <ConversationHeader.Back onClick={handleBackClick} />
            <ConversationHeader.Content userName={botName} info="Active 10 mins ago" />
            <ConversationHeader.Actions>
              {/* <VoiceCallButton title="Start voice call" /> */}
              {/* <InfoButton title="Show info" /> */}
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList>
            {
              messages.map((obj, index) => (
                <Message model={obj} key={index} />
              ))
            }
          </MessageList>
          <MessageInput placeholder="Chat message" value={newMessage} onChange={(val) => { setNewMessage(val) }} onSend={handleNewMessage} />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}
