import { getRequest } from "../utility/request_helper"

export const getPerosonas = (setter) => {
    getRequest("/personas", (data) => {
        setter(data)
    })
}