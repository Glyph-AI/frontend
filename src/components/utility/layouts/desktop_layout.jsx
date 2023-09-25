import { getCurrentUser, updateProfile } from "@/components/api/users";
import { fetchToken } from '@/components/utility/firebase';
import { Box, CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { FIREBASE_CONFIG } from "../firebaseConfig";
import { theme } from "../theme";

export default function DesktopLayout({ children }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [tokenFound, setTokenFound] = useState(false)

    const handleUserInfo = (data) => {
        const user_id = data.id
        if (data.subscribed && !data.is_current) {
            setPaymentSnackbar(true);
        }

        if (typeof (window) !== 'undefined' && window.Notification) {

            Notification.requestPermission(() => {
                if (Notification.permission === 'granted') {
                    navigator.serviceWorker.register('/service-worker.js')
                        .then((registration) => {
                            console.log("SW Registered: ", registration)
                        });

                    navigator.serviceWorker.register(`/service-worker.js?firebaseConfig=${JSON.stringify(FIREBASE_CONFIG)}`)
                        .then((registration) => {
                            console.log("Firebase SW Registered: ", registration)
                        });

                    // update user record with notification permissions accepted
                    const app = initializeApp(FIREBASE_CONFIG);
                    const messaging = getMessaging(app)
                    fetchToken(setTokenFound, messaging, user_id)
                    onMessage(messaging, (payload) => {
                        setNotification(payload.notification)
                        setNotificationShow(true)
                    })
                    const update_data = {
                        id: data.id,
                        notifications: true
                    }
                    updateProfile(update_data, () => { })
                } else if (Notification.permission === 'denied') {
                    const update_data = {
                        id: data.id,
                        notifications: false
                    }
                    updateProfile(update_data, () => { })

                }
            });
        }
    }

    useEffect(() => {
        getCurrentUser(handleUserInfo)
    }, [])
    return (
        <ThemeProvider theme={prefersDarkMode ? theme : theme}>
            <CssBaseline />
            <Box sx={{ backgroundColor: "#f7f7f7", height: "100%", p: "32px 24px" }}>
                {children}
            </Box>
        </ThemeProvider>
    )
}   