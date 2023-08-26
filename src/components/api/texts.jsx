import { genericRequest, getRequest } from "../utility/request_helper"

const sortTexts = (data) => {
    const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return sorted
}

export const getAvailableTexts = (setter) => {
    getRequest("/texts", (data) => {
        setter(sortTexts(data))
    })
}

export const handleTextHide = (bot, targetText, setter) => {
    genericRequest(`/bots/${bot.id}/texts/${targetText.id}`, "PATCH", null, (data) => {
        setter(data)
    })
}