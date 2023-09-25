import { genericRequest, getRequest } from "../utility/request_helper"

export const getCurrentUser = (setter) => {
    getRequest("/profile", (data) => {
        setter(data)
    })
}

export const logoutUser = (callback) => {
    genericRequest("/logout", "POST", null, (resp) => {
        callback(resp)
    })
}

export const updateProfile = (data, callback) => {
    genericRequest("/profile", "PATCH", JSON.stringify(data), (data) => {
        callback(data)
    })
}

export const getStripeUrl = (callback) => {
    getRequest("/subscriptions/customer-portal-session", (data) => {
        callback(data.url)
    })
}