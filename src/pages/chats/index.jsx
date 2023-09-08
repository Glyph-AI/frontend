'use client'
import { useState, useEffect } from 'react';
import { getCookie } from '@/components/utility/cookie_helper';
import NewChatModal from '@/components/chats/newChatModal';
import { useRouter } from 'next/router';
import LayoutWithNav from '@/components/utility/layout_with_nav';
import BaseHeader from '@/components/utility/headers/baseHeader';
import { getCurrentUser } from '@/components/api/users';
import { getChats } from '@/components/api/chats';
import ConversationList from '@/components/chats/chatList';
import { useSearchParams } from 'next/navigation';
import BackgroundBox from '@/components/utility/common/backgroundBox';

export default function Conversations() {
    const [modalVisible, setModalVisible] = useState(false)
    const [userChats, setUserChats] = useState([])
    const [displayChats, setDisplayChats] = useState([])
    const [searchValue, setSearchValue] = useState([])
    const [user, setUser] = useState({})
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        let create = searchParams.get("create")
        if (create !== undefined && create !== null) {
            setModalVisible(true)
        }

        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            console.log("REDIRECTING TO LOGIN")
            router.push("/login")
        }

        getChats((data) => {
            setUserChats(data);
            setDisplayChats(data)
        })

        getCurrentUser(setUser)
    }, [searchParams])

    const searchFunction = (searchTerm, array) => {
        return array.filter(chat => (chat.name.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    const handleSearchValueChange = (newValue) => {
        setSearchValue(newValue)

        if (newValue === "") {
            setDisplayChats(userChats)
        } else {
            const newDisplayChats = searchFunction(newValue, userChats)
            setDisplayChats(newDisplayChats)
        }
    }

    const handleModalClose = () => {
        getChats((data) => {
            setUserChats(data);
            setDisplayChats(data);
            setModalVisible(false)
            router.push("/chats")
        })

    }

    return (
        <LayoutWithNav>
            <BaseHeader title="All Chats" searchFunction={handleSearchValueChange} searchValue={searchValue} showSearch={true} showProfile={true} user={user} />
            <BackgroundBox sx={{ padding: "8px" }}>
                <ConversationList chats={displayChats} />
            </BackgroundBox>
            <NewChatModal open={modalVisible} handleClose={handleModalClose} user={user} updateUserFunc={() => { getCurrentUser(setUser) }} />
        </LayoutWithNav>
    )
}