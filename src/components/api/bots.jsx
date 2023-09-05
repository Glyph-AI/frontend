import { genericRequest, getRequest } from "../utility/request_helper"

export const getUserBots = (setter) => {
    getRequest("/bots", (data) => {
        setter(data)
    })
}