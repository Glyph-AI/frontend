import Layout from "@/components/utility/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GoogleAuth() {
    const router = useRouter()

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let botId = params.state
        let code = params.code

        console.log(botId, code)

        // store authorization code in database

        router.push(`/bots/${botId}`)

    })

    return (
        <Layout />
    )
}