import { getRequest } from "../utility/request_helper"

export const getCurrentUser = (setter) => {
    getRequest("/profile", (data) => {
        setter(data)
    })
}