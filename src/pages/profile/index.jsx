import Layout from "@/components/utility/layout";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { useRouter } from "next/router";
import { Avatar, Badge, Box, ListItem, ListItemText, List, ListItemAvatar, Divider, IconButton, Typography, Button, LinearProgress, useMediaQuery, Link, TextField, ListItemIcon, Switch } from "@mui/material";
import { styled } from '@mui/material/styles';
import { theme, darkTheme } from "@/components/utility/theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { AccountBox, ChevronRight, DarkMode, Edit, EmailOutlined, Info, Lock, Logout, MonetizationOnOutlined, Notifications, Person, SmartToyOutlined, Upload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { SocialIcon } from "react-social-icons";
import { useUserContext } from "@/context/user";
import FileUploadModal from "@/components/utility/fileUploadModal";
import BaseHeader from "@/components/utility/headers/baseHeader";
import { getCurrentUser } from "@/components/api/users";
import BackgroundBox from "@/components/utility/common/backgroundBox";

const StyledSwitch = styled(Switch)(() => {
    return ({
        "& .Mui-checked": {
            "& .MuiSwitch-thumb": {
                backgroundColor: theme.palette.common.blue

            }
        },
        "& .MuiSwitch-thumb": {
            backgroundColor: "rgba(79, 94, 123, 0.4)",
            opacity: 1

        },
        "& .MuiSwitch-track": {
            backgroundColor: "rgba(79, 94, 123, 0.2)"
        }
    })

})


function SettingsListItem({ icon, text, secondaryAction, itemProps }) {
    return (
        <ListItem
            secondaryAction={
                secondaryAction
            }
            sx={{ padding: "16px 24px" }}
            {...itemProps}
        >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText>
                {text}
            </ListItemText>
        </ListItem>
    )
}

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

export default function Profile() {
    const [stripeUrl, setStripeUrl] = useState("")
    const [user, setUser] = useState({})
    const [name, setName] = useState("")
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const [inTwa, setInTwa] = useState(false)
    const router = useRouter()
    const [isNameFocused, setIsNamedFocused] = useState(false);
    const [inGoogle, setInGoogle] = useState(false);
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }

        if (window && 'getDigitalGoodsService' in window) {
            setInGoogle(true)
        }
        getRequest("/subscriptions/customer-portal-session", (data) => {
            setStripeUrl(data.url)
        })
        // reset profile if the user is coming from subscription
        getCurrentUser((data) => {
            setUser(data)
            setName(`${data.first_name} ${data.last_name}`)
        })


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
            if (user.subscription_provider === "Google") {
                return <i>Manage Subscription on Google Play</i>
            } else {
                return <i>Manage Subscription on Our Website</i>
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

    const subscriptionManageClick = () => {
        if (user.subscribed && !inTwa) {
            window.location.href = stripeUrl
        } else if (user.subscribed && inGoogle) {
            window.location.href = "https://play.google.com/store/account/subscriptions?sku=glyph&package=com.glyphassistant.app.twa"
        } else {
            router.push("/profile/subscription")
        }
    }

    const progressBarWidth = smallScreen ? "90%" : "30%"

    return (
        <LayoutWithNav>
            <BaseHeader title={"Settings"} showSearch={false} user={user} showProfile={true} />
            <BackgroundBox sx={{ background: theme.palette.common.backgroundGradient, height: "calc(100% - 56px)" }}>
                <Box sx={{ width: "100%", display: "flex" }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", pl: 3, pt: 1, width: "20%" }}>
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
                                sx={{ height: 64, width: 64, fontSize: 90, backgroundColor: "#fff" }}
                                alt={user.first_name}
                            />
                        </Badge>
                    </Box>
                    <Box sx={{ width: "80%", flex: 1, pl: 3, pt: 1 }}>
                        <Box sx={{ marginTop: "8px", display: "flex", flexWrap: "wrap", alignItems: "center", width: "100%" }}>
                            <Box sx={{ fontWeight: 500, width: "100%" }}>
                                {
                                    !isNameFocused ? (
                                        <Typography variant="body" onClick={() => { setIsNamedFocused(true) }}>{name}<Edit sx={{ color: "gray", fontSize: 16, ml: "4px" }} /></Typography>
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
                            <Typography color={theme.palette.common.subtitleBlue} variant="body2">Glyph Lite / 10.01.23</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ flexWrap: "wrap", display: "flex", gap: "3%", alignContent: "center", justifyContent: "center", padding: "8px", pb: 3 }}>
                    <Box sx={{ width: progressBarWidth }}>
                        <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                            <Typography variant="h6">Bots</Typography>
                        </Box>
                        <LinearProgressWithLabel
                            variant="determinate"
                            color="primary"
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
                            color="primary"
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
                            color="primary"
                            value={calculateFileValue()}
                            labelValue={user.file_count}
                            maxValue={user.allowed_files}
                        />
                    </Box>
                </Box>
                <Divider sx={{ width: "100%" }} />
                <List sx={{ p: 1, pt: 2 }}>
                    {/* <SettingsListItem
                        secondaryAction={<StyledSwitch />}
                        icon={<DarkMode sx={{ color: theme.palette.common.blue }} />}
                        text={"Dark Mode"}
                    /> */}
                    <SettingsListItem
                        secondaryAction={<ChevronRight />}
                        icon={<AccountBox sx={{ color: theme.palette.common.blue }} />}
                        text={"Account & Subscription"}
                        itemProps={{
                            onClick: () => { subscriptionManageClick() }
                        }}
                    />
                    <SettingsListItem
                        secondaryAction={<ChevronRight />}
                        icon={<Notifications sx={{ color: theme.palette.common.blue }} />}
                        text={"Notification"}
                    />
                    {/* <SettingsListItem
                        secondaryAction={<ChevronRight />}
                        icon={<Lock sx={{ color: theme.palette.common.blue }} />}
                        text={"Privacy and Security"}
                    /> */}
                    <SettingsListItem
                        secondaryAction={null}
                        icon={<Info sx={{ color: theme.palette.common.blue }} />}
                        text={"Discord"}
                        itemProps={{
                            onClick: () => { router.push("https://discord.com/channels/1103348778104279110/1107050513696030871/1126965614930571356") }
                        }}
                    />
                </List>
            </BackgroundBox>
            {/* <ConversationHeader >
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
                        onClick={() => { subscriptionManageClick() }}
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
                <Link href="https://discord.com/channels/1103348778104279110/1107050513696030871/1126965614930571356">
                    <Typography variant="h6">Join our Discord!</Typography>
                </Link>
                <SocialIcon url="https://discord.com/channels/1103348778104279110/1107050513696030871/1126965614930571356" style={{ marginTop: "2px", height: 25, width: 25 }} />
            </Box>
            <FileUploadModal setRecord={setUser} open={uploadModalOpen} handleClose={handleUploadClose} uploadUrl={"/profile/picture"} /> */}
        </LayoutWithNav >
    )
}