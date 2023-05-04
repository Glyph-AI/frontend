import Layout from "@/components/utility/layout";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { useRouter } from "next/router";
import { Avatar, Badge, Box, ListItem, ListItemText, List, ListItemAvatar, Divider, IconButton, Typography, Button, LinearProgress, useMediaQuery, Link } from "@mui/material";
import { styled } from '@mui/material/styles';
import { theme } from "@/components/utility/theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ChevronRight, EmailOutlined, Logout, MonetizationOnOutlined, Person, SmartToyOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { SocialIcon } from "react-social-icons";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    color: "rgba(255, 255, 255, 1)",
    '&:hover': {
        border: "2px solid #fff"
    }
}));

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{props.labelValue}/{props.maxValue === -1 ? "INF" : props.maxValue}</Typography>
            </Box>
        </Box>
    );
}

export default function Profile() {
    const [stripeUrl, setStripeUrl] = useState("")
    const [profile, setProfile] = useState({})
    const router = useRouter()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

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

    const calculateBotValue = () => {
        if (profile.allowed_bots === -1) {
            return 0
        }

        console.log(profile.allowed_bots, profile.bots_left)

        console.log(((profile.allowed_bots - profile.bots_left) / (profile.allowed_bots)) * 100)

        return ((profile.allowed_bots - profile.bots_left) / (profile.allowed_bots)) * 100
    }

    const calculateMessageValue = () => {
        return ((profile.allowed_messages - profile.messages_left) / (profile.allowed_messages)) * 100
    }

    const calculateFileValue = () => {
        if (profile.allowed_files === -1) {
            return 0
        }

        return ((profile.allowed_files - profile.files_left) / (profile.allowed_files)) * 100
    }

    const progressBarWidth = smallScreen ? "90%" : "30%"

    return (
        <LayoutWithNav>
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
            <Box sx={{ flexWrap: "wrap", display: "flex", gap: "3%", alignContent: "center", justifyContent: "center", padding: "8px" }}>
                <Box sx={{ width: progressBarWidth }}>
                    <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                        <Typography variant="h6">Bots</Typography>
                    </Box>
                    <LinearProgressWithLabel
                        variant="determinate"
                        color="secondary"
                        sx={{ width: "100%" }}
                        value={calculateBotValue()}
                        labelValue={profile.allowed_bots - profile.bots_left}
                        maxValue={profile.allowed_bots}
                    />
                </Box>
                <Box sx={{ width: progressBarWidth }}>
                    <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                        <Typography variant="h6">Messages</Typography>
                    </Box>
                    <LinearProgressWithLabel
                        variant="determinate"
                        color="secondary"
                        value={calculateMessageValue()}
                        labelValue={profile.allowed_messages - profile.messages_left}
                        maxValue={profile.allowed_messages}
                    />
                </Box>
                <Box sx={{ width: progressBarWidth }}>
                    <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                        <Typography variant="h6">Files</Typography>
                    </Box>
                    <LinearProgressWithLabel
                        variant="determinate"
                        color="secondary"
                        value={calculateFileValue()}
                        labelValue={profile.allowed_files - profile.files_left}
                        maxValue={profile.allowed_files}
                    />
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
            <Divider sx={{ marginTop: "16px" }} />
            <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", gap: "8px", paddingTop: "16px" }}>
                <Link href="https://discord.gg/DKmvWgAx">
                    <Typography variant="h6">Join our Discord!</Typography>
                </Link>
                <SocialIcon url="https://discord.gg/DKmvWgAx" style={{ marginTop: "2px", height: 25, width: 25 }} />
            </Box>
        </LayoutWithNav >
    )
}