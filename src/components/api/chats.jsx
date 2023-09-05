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

export const createChat = (data, successFunc) => {
    genericRequest("/chats", "POST", JSON.stringify(data), () => {
        successFunc();
    }, { "Content-Type": "application/json" })
}