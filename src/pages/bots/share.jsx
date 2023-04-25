import Layout from "@/components/utility/layout";
import { useRouter } from "next/router"
import { useEffect } from "react";

export default function Share() {
    const router = useRouter()

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let bot_code = params.bot_code

        router.push(`/login?bot_code=${bot_code}`)
    }, [])

    return (
        <Layout></Layout>
    )
}