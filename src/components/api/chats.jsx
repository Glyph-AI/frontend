import { getRequest } from "../utility/request_helper"

const getChatDateSafe = (chat) => {
    if (chat.last_message === null) {
        return chat.created_at
    } else {
        return chat.last_message.created_at
    }
}

const sortChats = (chats) => {
    var sortedChats = chats.sort((a, b) => new Date(getChatDateSafe(b)) - new Date(getChatDateSafe(a)))
    return sortedChats

}

export const getChats = (setter) => {
    getRequest("/chats", (data) => {
        setter(sortChats(data))
    })
}

export const createChat = (data, callback) => {
    genericRequest("/chats", "POST", JSON.stringify(data), () => {
        callback();
    }, { "Content-Type": "application/json" })
}

export const sendMessage = (data, callback) => {
    genericRequest(`/chats/${chatId}/message`, "POST", data, (response) => {
        callback(response)
    })
}

export const getChatById = (chat_id, setter) => {
    getRequest(`/chats/${chat_id}`, (data) => {
        setter(data)
    })
}