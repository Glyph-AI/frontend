import { useEffect, useState } from 'react'
import { genericRequest } from '@/components/utility/request_helper'
import { useRouter } from 'next/router';

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
                setSnackbarOpen(true)
            }
        }, { "Content-Type": "application/json" })
    }

    useEffect(() => {
        if (window.google) {
            /* global google */
            google.accounts.id.initialize({
                client_id: "991199193983-h5pq059ivvtim8q0hp86d7asigjbbjcc.apps.googleusercontent.com",
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
        <div style={{ backgroundColor: "#00094a", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <div style={{ width: "50%" }}>
                <div style={{ textAlign: "center", fontSize: 40, marginBottom: "8px" }}>GlyphAI</div>
                <div style={{ width: "100%" }} id="gLogin" />
            </div>
        </div>
    )
}