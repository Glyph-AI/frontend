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

export default function Conversations() {
    const [modalVisible, setModalVisible] = useState(false)
    const [userChats, setUserChats] = useState([])
    const [displayChats, setDisplayChats] = useState([])
    const [searchValue, setSearchValue] = useState([])
    const [user, setUser] = useState({})
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        console.log(searchParams)
        let create = searchParams.get("create")
        if (create !== undefined) {
            setModalVisible(true)
        }

        console.log("HERE", create)

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
        })
    }

    return (
        <LayoutWithNav>
            <BaseHeader title="All Chats" searchFunction={handleSearchValueChange} />
            <Box sx={{ padding: "8px" }}>
                <ConversationList chats={displayChats} />
            </Box>
            <NewConversationModal open={modalVisible} handleClose={handleModalClose} user={user} updateUserFunc={() => { getCurrentUser(setUser) }} />
        </LayoutWithNav>
    )
}