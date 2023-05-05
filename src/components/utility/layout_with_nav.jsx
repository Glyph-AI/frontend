import { theme, darkTheme } from './theme.jsx'
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import Layout from './layout';
import { useState } from 'react';
import { Message, Person, SmartToy } from '@mui/icons-material';
import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { motion } from "framer-motion";

const variants = {
    hidden: { opacity: 0, x: -400, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
}

export default function LayoutWithNav({ children }) {
    const [navValue, setNavValue] = useState(0)
    const router = useRouter()

    useEffect(() => {
        if (window !== undefined) {
            if (window.location.href.includes("profile")) {
                setNavValue(0)
            } else if (window.location.href.includes("conversation")) {
                setNavValue(1)
            } else {
                setNavValue(2)
            }
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <motion.div
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ type: 'linear' }}
                className=""
                style={{ height: "100%" }}
            >
                {children}
            </motion.div>
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
                </BottomNavigation>
            </Paper>
        </ThemeProvider>
    )
}