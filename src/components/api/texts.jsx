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

export const saveText = (id, data, setter) => {
    genericRequest(`/texts/${id}`, "PATCH", JSON.stringify(data), (data, status) => {
        if (status !== 200) {
            console.log("Save error")
        } else {
            setter(data)
        }

    })
}

export const createText = (data, setter) => {
    genericRequest("/texts", "POST", JSON.stringify(data), (data, status) => {
        setter(data)
    })
}

export const embedText = (id) => {
    genericRequest(`/texts/${id}/embed`, "POST", null, (data, status) => {
        if (status !== 200) {
            console.log("Embed error")
        }
    })
}

export const getTextById = (id, setter) => {
    getRequest(`/texts/${id}`, (data) => {
        setter(data)
    })
}

export const deleteText = (id, setter) => {
    genericRequest(`/texts/${id}`, "DELETE", null, (data, status) => {
        setter(data)
    })
}