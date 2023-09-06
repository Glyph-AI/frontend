import { theme, darkTheme } from './theme.jsx'
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper, Snackbar, Alert, AlertTitle, Box, useMediaQuery } from '@mui/material';
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
import Navbar from '../navbar/navbar.jsx';


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

    const childHeight = () => {
        if (typeof (document) !== "undefined") {
            if (showNavigation) {
                return document.body.style.height = (window.visualViewport.height - 56) + "px"
            }
        }

        return "100%"
    }

    useEffect(() => {

        // // if (window !== undefined) {
        // //     if (window.location.href.includes("profile")) {
        // //         setNavValue(0)
        // //     } else if (window.location.href.includes("conversation")) {
        // //         setNavValue(1)
        // //     } else if (window.location.href.includes("bots")) {
        // //         setNavValue(2)
        // //     } else {
        // //         setNavValue(3)
        // //     }
        // // }

        // // getRequest("/profile", (data) => {
        // //     const user_id = data.id
        // //     if (data.subscribed && !data.is_current) {
        // //         setPaymentSnackbar(true);
        // //     }

        // //     if (typeof (window) !== 'undefined' && window.Notification) {

        // //         Notification.requestPermission(() => {
        // //             if (Notification.permission === 'granted') {
        // //                 navigator.serviceWorker.register('/service-worker.js')
        // //                     .then((registration) => {
        // //                         console.log("SW Registered: ", registration)
        // //                     });

        // //                 navigator.serviceWorker.register(`/service-worker.js?firebaseConfig=${JSON.stringify(FIREBASE_CONFIG)}`)
        // //                     .then((registration) => {
        // //                         console.log("Firebase SW Registered: ", registration)
        // //                     });

        // //                 // update user record with notification permissions accepted
        // //                 const app = initializeApp(FIREBASE_CONFIG);
        // //                 const messaging = getMessaging(app)
        // //                 fetchToken(setTokenFound, messaging, user_id)
        // //                 onMessage(messaging, (payload) => {
        // //                     setNotification(payload.notification)
        // //                     setNotificationShow(true)
        // //                 })
        // //                 const update_data = {
        // //                     id: data.id,
        // //                     notifications: true
        // //                 }
        // //                 genericRequest("/profile", "PATCH", JSON.stringify(update_data), () => { })
        // //             } else if (Notification.permission === 'denied') {
        // //                 const update_data = {
        // //                     id: data.id,
        // //                     notifications: false
        // //                 }
        // //                 genericRequest("/profile", "PATCH", JSON.stringify(update_data), () => { })

        // //             }
        // //         });
        // //     }
        // })



    }, [])

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
                style={{ height: "100%", overflow: "hidden", width: "100%" }}
            >
                <Box className="child-container" sx={{ height: childHeight() }}>
                    {children}
                </Box>

            </motion.div>
            {
                showNavigation && (
                    //     <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    //         <BottomNavigation
                    //             showLabels
                    //             value={navValue}
                    //             onChange={(event, newValue) => {
                    //                 setNavValue(newValue);
                    //             }}
                    //             sx={{
                    //                 "& .Mui-selected, .Mui-selected > svg": {
                    //                     color: theme.palette.secondary.main
                    //                 }
                    //             }}
                    //         >
                    //             <BottomNavigationAction onClick={() => { router.push("/profile") }} value={0} label="Profile" icon={<Person />} />
                    //             <BottomNavigationAction onClick={() => { router.push("/conversations") }} value={1} label="Chats" icon={<Message />} />
                    //             <BottomNavigationAction onClick={() => { router.push("/bots") }} value={2} label="Bots" icon={<SmartToy />} />
                    //             <BottomNavigationAction onClick={() => { router.push("/notes") }} value={3} label="Notes" icon={<Note />} />
                    //         </BottomNavigation>
                    //     </Paper>
                    <Navbar />
                )

            }
        </ThemeProvider>
    )
}