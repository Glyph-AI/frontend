import { getRequest } from "@/components/utility/request_helper";
import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState({})

    useEffect(() => {
        console.log("HELLO")
        getRequest("/profile", (data) => {
            setUser(data)
        })
    }, [])

    return (
        <Context.Provider value={[user, setUser]}>{children}</Context.Provider>
    )
}

export function useUserContext() {
    return useContext(Context)
}