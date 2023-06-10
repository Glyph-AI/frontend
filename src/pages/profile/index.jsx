import Layout from "@/components/utility/layout";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { useRouter } from "next/router";
import { Avatar, Badge, Box, ListItem, ListItemText, List, ListItemAvatar, Divider, IconButton, Typography, Button, LinearProgress, useMediaQuery, Link, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { theme } from "@/components/utility/theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ChevronRight, Edit, EmailOutlined, Logout, MonetizationOnOutlined, Person, SmartToyOutlined, Upload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { SocialIcon } from "react-social-icons";
import { useUserContext } from "@/context/user";
import FileUploadModal from "@/components/utility/fileUploadModal";

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

const env = process.env.NEXT_PUBLIC_ENVIRONMENT

export default function Profile({profile, setProfile}) {
    const [stripeUrl, setStripeUrl] = useState("")
    const [user, setUser] = useState({})
    const [name, setName] = useState("")
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [inTwa, setInTwa] = useState(false)
    const router = useRouter()
    const [isNameFocused, setIsNamedFocused] = useState(false);
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const getUser = () => {
        getRequest("/profile", (data) => {
            setUser(data)
            setName(`${data.first_name} ${data.last_name}`)
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
        // reset profile if the user is coming from subscription
        getUser()


        if (window && 'getDigitalGoodsService' in window) {
            setInTwa(true)
        }

        if (env === "ios") {
            setInTwa(true)
        }
    }, [])

    const handleLogout = () => {
        genericRequest("/logout", "POST", null, () => {
            router.push("/login")
        })
    }

    const renderUserSubscription = () => {
        if (user.subscribed && user.is_current) {
            if (inTwa) {
                return <i>Manage Subscription on our Website</i>
            }
            return <i>Subscribed</i>
        } else if (user.subscription_canceled) {
            return <i>Subscription Canceled</i>
        } else if (user.subscribed && !user.is_current) {
            return <i>Payment Issue</i>
        } else {
            return <i>Not Subscribed</i>
        }
    }

    const calculateBotValue = () => {
        if (user.allowed_bots === -1) {
            return 0
        }

        return ((user.allowed_bots - user.bots_left) / (user.allowed_bots)) * 100
    }

    const calculateMessageValue = () => {
        return ((user.allowed_messages - user.messages_left) / (user.allowed_messages)) * 100
    }

    const calculateFileValue = () => {
        if (user.allowed_files === -1) {
            return 0
        }

        return ((user.allowed_files - user.files_left) / (user.allowed_files)) * 100
    }

    const handleNameChange = (val) => {
        var split = val.split(" ")
        var first_name = split[0]
        split.splice(0, 1)
        var last_name = split.join(" ")
        setName(`${first_name} ${last_name}`)
    }

    const handleNameSubmit = () => {
        setIsNamedFocused(false)
        var split = name.split(" ")
        var first_name = split[0]
        split.splice(0, 1)
        var last_name = split.join(" ")
        console.log(first_name, last_name)
        if (first_name !== user.first_name || last_name !== user.last_name) {
            const data = {
                id: user.id,
                first_name: first_name,
                last_name: last_name
            }

            genericRequest("/profile", "PATCH", JSON.stringify(data), (data) => {
                setUser(data)
                setName(`${data.first_name} ${data.last_name}`)
            })
        }
    }

    const handleUploadClose = () => {
        setUploadModalOpen(false)
    }

    const progressBarWidth = smallScreen ? "90%" : "30%"

    return (
        <LayoutWithNav>
            <ConversationHeader >
                <ConversationHeader.Content userName={<Typography variant="h6">Profile</Typography>} />
            </ConversationHeader>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: "8px" }}>
                <Badge
                    overlap="circular"
                    sx={{ padding: "-8px" }}
                    onClick={() => { setUploadModalOpen(true) }}
                    badgeContent={
                        <SmallAvatar>
                            <FileUploadIcon />
                        </SmallAvatar>
                    }
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Avatar
                        src={
                            user.profile_picture_location
                        }
                        sx={{ height: 128, width: 128, fontSize: 90, backgroundColor: "#fff" }}
                        alt={user.first_name}
                    />
                </Badge>
                <Box sx={{ marginTop: "8px", display: "flex", justifyContent: "center", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
                    <Box sx={{ fontWeight: 600, width: "100%", textAlign: "center" }}>
                        {
                            !isNameFocused ? (
                                <Badge sx={{ padding: "4px" }} badgeContent={<Edit sx={{ color: "gray", fontSize: 16 }} />}>
                                    <Typography variant="h5" onClick={() => { setIsNamedFocused(true) }}>{name}</Typography>
                                </Badge>
                            ) : (
                                <TextField
                                    autoFocus
                                    variant="standard"
                                    placeholder={name}
                                    onChange={(e) => { handleNameChange(e.target.value) }}
                                    onBlur={(e) => { handleNameSubmit() }}
                                />
                            )
                        }

                    </Box>
                    <Typography variant="subtitle1">{user.email}</Typography>
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
                        labelValue={user.bot_count}
                        maxValue={user.allowed_bots}
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
                        labelValue={user.message_count}
                        maxValue={user.allowed_messages}
                    />
                </Box>
                <Box sx={{ width: progressBarWidth }}>
                    <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                        <Typography variant="h6">Files & Notes</Typography>
                    </Box>
                    <LinearProgressWithLabel
                        variant="determinate"
                        color="secondary"
                        value={calculateFileValue()}
                        labelValue={user.file_count}
                        maxValue={user.allowed_files}
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
                        onClick={() => { user.subscribed && !inTwa ? window.location.href = stripeUrl : router.push("/profile/subscription") }}
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
            <FileUploadModal setRecord={setUser} open={uploadModalOpen} handleClose={handleUploadClose} uploadUrl={"/profile/picture"} />
        </LayoutWithNav >
    )
}