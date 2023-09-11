import { genericRequest } from "../utility/request_helper"

export const archiveUrl = (data, callback) => {
    genericRequest("/archive_url", "POST", JSON.stringify(data), (resp) => {
        callback(resp)
    })
}

export const uploadFile = (formData, callback) => {
    genericRequest("/user_upload", "POST", formData, (data, status) => {
        callback(data, status)
    })
}