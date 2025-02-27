import Router from 'next/router'
import { API_ROOT } from './apiConfig';

export const getRequest = async (endpoint, callback = () => { }) => {
    const request = await fetch(`${API_ROOT}${endpoint}`, {
        method: 'GET',
        redirect: "follow",
        credentials: 'include',
    })

    const data = await request.json();
    const status = await request.status;
    if (status == 401) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== null) {
            Router.push(`/login?bot_code=${bot_code}`)
        } else {
            Router.push("/login")
        }
    }
    callback(data)
}

export const genericRequest = async (endpoint, method = 'POST', input_data = {}, callback = () => { }, headers = { "Content-Type": "application/json" }) => {
    const request = await fetch(`${API_ROOT}${endpoint}`, {
        method: method,
        body: input_data,
        credentials: 'include',
        headers: headers
    });

    const data = await request.json();
    const status = await request.status;
    if (status == 401) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== null) {
            Router.push(`/login?bot_code=${bot_code}`)
        } else {
            Router.push("/login")
        }
    }
    callback(data, status);
}