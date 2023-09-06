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