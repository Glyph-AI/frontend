import { useTheme } from "@emotion/react"
import { AccountBox, ChevronRight, Info, Logout, Notifications } from "@mui/icons-material"
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { useState } from "react"
import { updateProfile } from "../api/users"
import SubscriptionsDialog from "../subscriptions/subscriptionsDialog"
import { StyledSwitch } from "../utility/styled/styledSwitch"

function SettingsListItem({ icon, text, secondaryAction, itemProps }) {
    return (
        <ListItemButton
            disableRipple
            sx={{ padding: "16px 24px" }}
            {...itemProps}
        >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text}>
            </ListItemText>
            <ListItemIcon edge="end" sx={{ minWidth: 0 }}>
                {secondaryAction}
            </ListItemIcon>
        </ListItemButton>
    )
}

export default function SettingsContainer({ user }) {
    const theme = useTheme()
    const [subscriptionsDialogOpen, setSubscriptionsDialogOpen] = useState(false)

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


    const subscriptionManageClick = () => {
        if (user.subscribed) {
            if (user.subscription_provider === "Stripe") {
                window.location.href = stripeUrl
            } else if (user.subscription_provider === "Google") {
                window.location.href = "https://play.google.com/store/account/subscriptions?sku=glyph&package=com.glyphassistant.app.twa"
            } else {
                window.location.href = stripeUrl
            }
        } else {
            setSubscriptionsDialogOpen(true)
        }
    }

    const toggleNotifications = () => {
        const update_data = {
            id: user.id,
            notifications: !user.notifications
        }
        updateProfile(update_data, () => { })
    }

    const handleModalClose = () => {
        setSubscriptionsDialogOpen(false)
    }

    return (
        <>
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
                    secondaryAction={<StyledSwitch value={user.notifications} onChange={toggleNotifications} />}
                    icon={<Notifications sx={{ color: theme.palette.common.blue }} />}
                    text={"Notifications"}
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
                <SettingsListItem
                    secondaryAction={null}
                    icon={<Logout sx={{ color: theme.palette.common.blue }} />}
                    text={"Logout"}
                    itemProps={{
                        onClick: () => {
                            logoutUser(() => router.push("/login"))
                        }
                    }}
                />
            </List>
            <SubscriptionsDialog open={subscriptionsDialogOpen} handleClose={handleModalClose} />
        </>
    )
}