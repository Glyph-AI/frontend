import Layout from "@/components/utility/layout";
import { genericRequest } from "@/components/utility/request_helper";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GoogleAuth() {
    const router = useRouter()

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        console.log(params.state)
        let { bot_id, tool_id } = JSON.parse(params.state)
        let code = params.code

        const data = {
            bot_id: bot_id,
            tool_id: tool_id,
            code: code
        }

        // store authorization code in database
        genericRequest("/tools/auth/google", "POST", JSON.stringify(data), (data) => {
            router.push(`/bots/${bot_id}`)
        }, { "Content-Type": "application/json" })
    }, [])

    return (
        <Layout />
    )
}