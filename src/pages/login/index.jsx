import { useEffect, useState } from 'react'
import { genericRequest } from '@/components/utility/request_helper'
import { useRouter } from 'next/router';
import { GOOGLE_LOGIN_KEY } from '@/components/utility/gLogin';
import Layout from '@/components/utility/layout';
import { motion } from "framer-motion";

export default function Login() {
    const [redirectUrl, setRedirectUrl] = useState("/conversations")
    const router = useRouter()
    const handleGoogle = (resp) => {
        var auth_data = {
            "token": resp.credential
        }

        genericRequest("/auth/google", "POST", JSON.stringify(auth_data), (data, status) => {
            if (status === 200) {
                router.push(redirectUrl)
            } else if (status === 401) {
                console.log("Failed")
            }
        }, { "Content-Type": "application/json" })
    }

    useEffect(() => {
        const relatedApps = navigator.getInstalledRelatedApps();
        const PWAisInstalled = relatedApps.length > 0;
        if (window.google) {
            /* global google */
            google.accounts.id.initialize({
                client_id: GOOGLE_LOGIN_KEY,
                callback: handleGoogle,
            });

            google.accounts.id.renderButton(document.getElementById("gLogin"), {
                // type: "icon",
                theme: "outlined",
                size: "large",
                shape: "circle",
            });
            // don't show the prompt because it interferes with installing the pwa
            if (PWAisInstalled) {
                google.accounts.id.prompt()
            }
        }

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== null) {
            setRedirectUrl(`/bots?bot_code=${bot_code}`)
        }
    }, [handleGoogle])
    return (
        <Layout>
            <motion.div
                variants={{
                    hidden: { opacity: 0, x: -200, y: 0 },
                    enter: { opacity: 1, x: 0, y: 0 },
                    exit: { opacity: 0, x: 0, y: -100 }
                }}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{
                    type: "linear"
                }}
                style={{ height: "100%" }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <div style={{ width: "50%" }}>
                        <div>
                            <img className="logo" alt="Glyph Logo" src={"/dark_vertical.png"} style={{ width: "100%", marginBottom: "8px" }} />
                            {/* <div style={{ textAlign: "center", fontSize: 40, marginBottom: "8px" }}>GlyphAI</div> */}
                            <div style={{ width: "100%", display: "flex", justifyContent: "center" }} id="gLogin" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Layout>
    )
}