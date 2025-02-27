import { fetchToken } from '@/components/utility/firebase';
import { FIREBASE_CONFIG } from '@/components/utility/firebaseConfig';
import { Alert, AlertTitle, Box, CssBaseline, Snackbar, ThemeProvider, useMediaQuery } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from "firebase/messaging";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../api/users.jsx';
import Navbar from '../../navbar/navbar.jsx';
import { getIsSsrMobile } from '../contexts/isSsrMobileContext.jsx';
import { genericRequest } from '../request_helper.jsx';
import { theme } from '../theme.jsx';


const variants = {
    hidden: { opacity: 0, x: -400, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
}

export default function LayoutWithNav({ showNavigation = true, children }) {
    const [navValue, setNavValue] = useState(0)
    const [paymentSnackbar, setPaymentSnackbar] = useState(false)
    const [tokenFound, setTokenFound] = useState(false)
    const router = useRouter()
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const childHeight = () => {
        if (typeof (document) !== "undefined") {
            if (showNavigation) {
                return (window.visualViewport.height - 56) + "px"
            }
        }

        return "100%"
    }

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
                            console.log("SW Registered")
                        });

                    navigator.serviceWorker.register(`/service-worker.js?firebaseConfig=${JSON.stringify(FIREBASE_CONFIG)}`)
                        .then((registration) => {
                            console.log("Firebase SW Registered")
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
                    genericRequest("/profile", "PATCH", JSON.stringify(update_data), () => { })
                } else if (Notification.permission === 'denied') {
                    const update_data = {
                        id: data.id,
                        notifications: false
                    }
                    genericRequest("/profile", "PATCH", JSON.stringify(update_data), () => { })

                }
            });
        }
    }

    useEffect(() => {
        if (!smallScreen) {
            router.push("/")
        }
        getCurrentUser(handleUserInfo)
    }, [smallScreen])

    return (
        <ThemeProvider theme={prefersDarkMode ? theme : theme}>
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
                style={{ height: "100%", width: "100%", position: "relative", overflow: "hidden" }}
            >
                <Box className="child-container" sx={{ height: childHeight() }}>
                    {children}
                </Box>

            </motion.div>
            {
                showNavigation && (
                    <Navbar />
                )
            }
        </ThemeProvider>
    )
}

export async function getServerSideProps(context) {
    const isMobile = getIsSsrMobile(context)
    console.log("HERE", isMobile)
    if (!isMobile) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }

    return { props: {} }
}