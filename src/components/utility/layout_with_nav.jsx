import { theme, darkTheme } from './theme.jsx'
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper, Snackbar, Alert, AlertTitle } from '@mui/material';
import Layout from './layout';
import { useState } from 'react';
import { Message, Note, Person, SmartToy } from '@mui/icons-material';
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { motion } from "framer-motion";
import { genericRequest, getRequest } from './request_helper.jsx';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from "firebase/messaging";
import { fetchToken } from '@/components/utility/firebase';
import { FIREBASE_CONFIG } from '@/components/utility/firebaseConfig';


const variants = {
    hidden: { opacity: 0, x: -400, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
}

export default function LayoutWithNav({ children }, showNavigation = true) {
    const [navValue, setNavValue] = useState(0)
    const [paymentSnackbar, setPaymentSnackbar] = useState(false)
    const [tokenFound, setTokenFound] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (window !== undefined) {
            if (window.location.href.includes("profile")) {
                setNavValue(0)
            } else if (window.location.href.includes("conversation")) {
                setNavValue(1)
            } else if (window.location.href.includes("bots")) {
                setNavValue(2)
            } else {
                setNavValue(3)
            }
        }

        getRequest("/profile", (data) => {
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
                        console.log("Messaging service ", messaging)
                        onMessage(messaging, (payload) => {
                            setNotification(payload.notification)
                            setNotificationShow(true)
                        })
                        const update_data = {
                            id: data.id,
                            notifications: true
                        }
                        genericRequest("/profile", "PATCH", JSON.stringify(update_data), () => {})
                    } else if (Notification.permission === 'denied') {
                        const update_data = {
                            id: data.id,
                            notifications: false
                        }
                        genericRequest("/profile", "PATCH", JSON.stringify(update_data), () => {})

                    }
                });
            }
        })

        

    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={paymentSnackbar}
                audoHideDuration={6000}
                onClick={() => { router.push("/profile") }}
            >
                <Alert severity="error">
                    <AlertTitle>Payment Issue!</AlertTitle>
                    Please go to your profile and check your payment information! Your account has been temporarily restricted.
                </Alert>
            </Snackbar>
            <motion.div
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ type: 'linear' }}
                className=""
                style={{ height: "100%", overflow: "hidden", width: "100%" }}
            >
                {children}
            </motion.div>
            {
                showNavigation && (
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation
                            showLabels
                            value={navValue}
                            onChange={(event, newValue) => {
                                setNavValue(newValue);
                            }}
                            sx={{
                                "& .Mui-selected, .Mui-selected > svg": {
                                    color: theme.palette.secondary.main
                                }
                            }}
                        >
                            <BottomNavigationAction onClick={() => { router.push("/profile") }} value={0} label="Profile" icon={<Person />} />
                            <BottomNavigationAction onClick={() => { router.push("/conversations") }} value={1} label="Chats" icon={<Message />} />
                            <BottomNavigationAction onClick={() => { router.push("/bots") }} value={2} label="Bots" icon={<SmartToy />} />
                            <BottomNavigationAction onClick={() => { router.push("/notes") }} value={3} label="Notes" icon={<Note />} />
                        </BottomNavigation>
                    </Paper>
                )
            }
        </ThemeProvider>
    )
}