import { genericRequest, getRequest } from "../utility/request_helper"

export const getTools = (setter) => {
    getRequest("/tools", (data) => {
        const tools = data.filter((item) => item.user_configurable)
        setter(tools)
    })
}

export const handleToolDisable = (bot, tool, setter) => {
    genericRequest(`/bots/${bot.id}/${tool.id}`, "PATCH", null, (data) => {
        setter(data)
    })
}