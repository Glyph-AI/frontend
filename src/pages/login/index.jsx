import { useEffect, useState } from 'react'
import { genericRequest } from '@/components/utility/request_helper'
import { useRouter } from 'next/router';
import { gLogin } from '@/components/utility/gLogin';
import Layout from '@/components/utility/layout';

export default function Login() {
    const router = useRouter()
    const handleGoogle = (resp) => {
        var auth_data = {
            "token": resp.credential
        }

        genericRequest("/auth/google", "POST", JSON.stringify(auth_data), (data, status) => {
            if (status === 200) {
                router.push("/")
            } else if (status === 401) {
                console.log("Failed")
            }
        }, { "Content-Type": "application/json" })
    }

    useEffect(() => {
        if (window.google) {
            /* global google */
            google.accounts.id.initialize({
                client_id: gLogin,
                callback: handleGoogle,
            });

            google.accounts.id.renderButton(document.getElementById("gLogin"), {
                // type: "icon",
                theme: "outlined",
                size: "large",
                shape: "circle",
            });
            google.accounts.id.prompt()
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
                <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <div style={{ width: "50%" }}>
                        <div style={{ textAlign: "center", fontSize: 40, marginBottom: "8px" }}>GlyphAI</div>
                        <div style={{ width: "100%" }} id="gLogin" />
                    </div>
                </div>
            </motion.div>
        </Layout>
    )
}