import { useRouter } from "next/router";
import { Avatar, Badge, Box, ListItem, ListItemText, List, Divider, Typography, LinearProgress, useMediaQuery, TextField, ListItemIcon } from "@mui/material";
import { styled } from '@mui/material/styles';
import { theme } from "@/components/utility/theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { AccountBox, ChevronRight, Edit, FlashOffOutlined, Info, Logout, Notifications } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { getCookie } from "@/components/utility/cookie_helper";
import LayoutWithNav from "@/components/utility/layouts/layout_with_nav";
import BaseHeader from "@/components/utility/headers/baseHeader";
import { getCurrentUser, logoutUser } from "@/components/api/users";
import BackgroundBox from "@/components/utility/common/backgroundBox";
import FileUploadModal from "@/components/utility/fileUploadModal";
import UsageBars from "@/components/settings/usageBars";
import EditableTextField from "@/components/settings/editableTextField";
import SettingsContainer from "../../components/settings/settingsContainer";




const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    color: "rgba(255, 255, 255, 1)",
    '&:hover': {
        border: "2px solid #fff"
    }
}));

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
                            <EditableTextField placeholder={name} handleChange={handleNameChange} handleSubmit={handleNameSubmit} />

                            <Typography color={theme.palette.common.subtitleBlue} variant="body2">Glyph Lite / 10.01.23</Typography>
                        </Box>
                    </Box>
                </Box>
                <UsageBars user={user} dense={smallScreen} />
                <Divider sx={{ width: "100%" }} />
                <SettingsContainer user={user} />
            </BackgroundBox>
            <FileUploadModal
                open={uploadModalOpen}
                handleClose={() => { setUploadModalOpen(false) }}
                setRecord={setUser}
                uploadUrl={"/profile/picture"}
            />
        </LayoutWithNav >
    )
}