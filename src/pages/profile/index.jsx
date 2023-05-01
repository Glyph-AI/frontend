import Layout from "@/components/utility/layout";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { useRouter } from "next/router";
import { Avatar, Badge, Box, ListItem, ListItemText, List, ListItemAvatar, Divider, IconButton, Typography, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import { theme } from "@/components/utility/theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ChevronRight, EmailOutlined, Logout, MonetizationOnOutlined, Person, SmartToyOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layout_with_nav";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    color: "rgba(255, 255, 255, 1)",
    '&:hover': {
        border: "2px solid #fff"
    }
}));

export default function Profile() {
    const [stripeUrl, setStripeUrl] = useState("")
    const [profile, setProfile] = useState({})
    const router = useRouter()

    const getProfile = () => {
        getRequest("/profile", (data) => {
            setProfile(data)
        })
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }
        getRequest("/subscriptions/customer-portal-session", (data) => {
            setStripeUrl(data.url)
        })
        getProfile()
    }, [])

    const handleLogout = () => {
        genericRequest("/logout", "POST", null, () => {
            router.push("/login")
        })
    }

    const renderUserSubscription = () => {
        if (profile.subscribed) {
            return <i>Subscribed</i>
        } else {
            return <i>Not Subscribed</i>
        }
    }

    return (
        <LayoutWithNav>
            <motion.div
                variants={{
                    hidden: { opacity: 0, x: 200, y: 0 },
                    enter: { opacity: 1, x: 0, y: 0 },
                    exit: { opacity: 0, x: 0, y: 100 }
                }}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{
                    type: "linear"
                }}
                style={{ height: "100%" }}
            >
                <ConversationHeader >
                    <ConversationHeader.Content userName={<Typography variant="h6">Profile</Typography>} />
                </ConversationHeader>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: "8px" }}>
                    <Avatar
                        src={
                            profile.profile_picture_location
                        }
                        sx={{ height: 128, width: 128, fontSize: 90, backgroundColor: "#fff" }}
                        alt={profile.first_name}
                    >

                    </Avatar>
                    <Box sx={{ marginTop: "8px", display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, width: "100%", textAlign: "center" }}>{profile.first_name} {profile.last_name}</Typography>
                        <Typography variant="subtitle1">{profile.email}</Typography>
                    </Box>
                </Box>
                <Box>
                    <List>
                        <ListItem
                            sx={{ cursor: "pointer", backgroundColor: "white" }}
                            secondaryAction={
                                <IconButton edge="end" aria-label="subscription">
                                    <ChevronRight />
                                </IconButton>
                            }
                            onClick={() => { window.location.href = stripeUrl }}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <MonetizationOnOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Subscription"} secondary={renderUserSubscription()} />
                        </ListItem>
                        <Divider />
                        <ListItem
                            sx={{ cursor: "pointer", backgroundColor: "white" }}
                            secondaryAction={
                                <IconButton edge="end" aria-label="subscription">
                                    <ChevronRight />
                                </IconButton>
                            }
                            onClick={() => { router.push("/bots") }}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <SmartToyOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Bots"} />
                        </ListItem>
                        <Divider />
                    </List>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Button onClick={handleLogout} startIcon={<Logout />} variant="contained" sx={{ width: "80%" }}>
                        Logout
                    </Button>
                </Box>

            </motion.div>
        </LayoutWithNav>
    )
}