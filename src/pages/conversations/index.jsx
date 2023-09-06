'use client'
import React, { useState, useEffect } from 'react';
import {
    Box
} from '@mui/material'
import { getCookie } from '@/components/utility/cookie_helper';
import NewConversationModal from '@/components/conversations/newConversationModal';
import { useRouter } from 'next/router';
import LayoutWithNav from '@/components/utility/layout_with_nav';
import BaseHeader from '@/components/utility/headers/baseHeader';
import { getCurrentUser } from '@/components/api/users';
import { getChats } from '@/components/api/chats';
import ConversationList from '@/components/conversations/conversationList';
import { useSearchParams } from 'next/navigation'
import { theme, darkTheme } from '@/components/utility/theme.jsx'

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
            router.push("/conversations")
        })

    }

    return (
        <LayoutWithNav>
            <BaseHeader title="All Chats" searchFunction={handleSearchValueChange} showSearch={true} />
            <Box sx={{ height: "calc(100% - 56px)", padding: "8px", background: theme.palette.common.backgroundGradient }}>
                <ConversationList chats={displayChats} />
            </Box>
            <NewConversationModal open={modalVisible} handleClose={handleModalClose} user={user} updateUserFunc={() => { getCurrentUser(setUser) }} />
        </LayoutWithNav>
    )
}