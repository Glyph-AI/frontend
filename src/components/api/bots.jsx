import { genericRequest, getRequest } from "../utility/request_helper"

export const getUserBots = (setter) => {
    getRequest("/bots", (data) => {
        setter(data)
    })
}

export const getBot = (id, setter) => {
    getRequest(`/bots/${id}`, (data) => {
        setter(data)
    })
}

export const createBot = (bot, callback) => {
    genericRequest("/bots", "POST", JSON.stringify(bot), (data) => {
        callback(data)
    })
}

export const getBotById = (bot_id, setter) => {
    getRequest(`/bots/${bot_id}`, (data) => {
        setter(data)
    })
}

export const updateBotById = (bot_id, data, callback) => {
    genericRequest(`/bots/${bot_id}`, "PATCH", JSON.stringify(data), (data) => {
        callback(data)
    })
}