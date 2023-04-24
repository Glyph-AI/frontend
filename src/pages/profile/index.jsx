import Layout from "@/components/utility/layout";
import { motion } from "framer-motion";
import {
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'
import { useRouter } from "next/router";
import { Avatar, Badge, Box, ListItem, ListItemText, List, ListItemAvatar, Divider, IconButton, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { theme } from "@/components/utility/theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { ChevronRight, EmailOutlined, MonetizationOnOutlined, Person, SmartToyOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getRequest } from "@/components/utility/request_helper";

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
    const router = useRouter()

    useEffect(() => {
        getRequest("/subscriptions/customer-portal-session", (data) => {
            setStripeUrl(data.url)
        })
    }, [])
    return (
        <Layout>
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
                    <ConversationHeader.Back onClick={() => { router.push("/conversations") }} />
                    <ConversationHeader.Content userName="Profile" />
                </ConversationHeader>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", padding: "8px" }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        onClick={() => { setProfileDialogOpen(true) }}
                        badgeContent={
                            <SmallAvatar>
                                <FileUploadIcon />
                            </SmallAvatar>
                        }
                    >
                        <Avatar
                            // src={
                            //     email && `http://localhost:8000/users/${email}/profile-picture`
                            // }
                            sx={{ height: 128, width: 128, fontSize: 90, backgroundColor: "#fff" }}
                            alt={"Avatar"}
                        >

                        </Avatar>
                    </Badge>
                    <Box sx={{ marginTop: "8px", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                        <Typography >{"email@test.com"}</Typography>
                    </Box>
                </Box>
                <Box>
                    <List>
                        <ListItem
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
                            <ListItemText primary={"Subscription"} />
                        </ListItem>
                        <Divider />
                        <ListItem
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

            </motion.div>
        </Layout>
    )
}