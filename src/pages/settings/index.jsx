import { useState, useEffect } from 'react'
import Layout from '@/components/utility/layout';
import { MainContainer, ChatContainer, ConversationHeader } from '@chatscope/chat-ui-kit-react'
import { List, ListItemText, Checkbox, ListItem, Divider, ListItemAvatar, ListItemIcon, Collapse, Avatar, IconButton, ListItemButton } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import HubIcon from '@mui/icons-material/Hub';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete'
import { motion } from "framer-motion";

import DropdownMenu from "@/components/common/dropdownMenu";
import { useRouter } from 'next/router';
import { genericRequest, getRequest } from '@/components/utility/request_helper.jsx';
import { getCookie } from '@/components/utility/cookie_helper';

export default function Profile() {
    const [userUploads, setUserUploads] = useState([])
    const [filesOpen, setFilesOpen] = useState(false)
    const [integrationsOpen, setIntegrationsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [stripeUrl, setStripeUrl] = useState("")
    const menuOpen = Boolean(anchorEl);
    const router = useRouter()
    const { chatId } = router.query

    const sortUserUploads = (data) => {
        const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return sorted
    }

    useEffect(() => {
        const activeSession = getCookie("active_session")
        if (activeSession !== "true") {
            router.push("/login")
        }
        getRequest("/user_uploads", (data) => {
            console.log(data)
            setUserUploads(sortUserUploads(data));
        })


    }, [])

    const handleUploadDelete = (id) => {
        genericRequest(`/user_uploads/${id}`, "DELETE", null, (data) => {
            setUserUploads(sortUserUploads(data))
        })
    }

    const handleFileHiding = (idx) => {
        const targetFile = userUploads[idx]
        genericRequest(`/user_uploads/${targetFile.id}`, "PATCH", null, (data) => {
            setUserUploads(sortUserUploads(data))
        })
    }

    const backUrl = () => {
        if (chatId !== null) {
            return `/chats/${chatId}`
        } else {
            return "/conversations"
        }
    }

    return (
        <Layout style={{ height: "100%" }}>
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
                <div style={{ height: "100%" }}>
                    <ConversationHeader >
                        <ConversationHeader.Back onClick={() => { router.push(backUrl()) }} />
                        <ConversationHeader.Content style={{ fontSize: "1.2em" }} userName="Settings" />
                    </ConversationHeader>
                    <List sx={{ width: '100%', height: "100%", backgroundColor: "#fff" }}>
                        <ListItem
                            key="uploaded-files"
                            secondaryAction={
                                <IconButton edge="end">
                                    {filesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            }
                            onClick={() => { setFilesOpen(!filesOpen) }}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Uploaded Files" />
                        </ListItem>
                        <Collapse in={filesOpen} unmountOnExit>
                            <List component="div" disablePadding>
                                {
                                    userUploads && userUploads.map((item, idx) => {
                                        return (
                                            <>
                                                <ListItem key={idx} sx={{ pl: 4 }} secondaryAction={
                                                    <IconButton edge="end" onClick={() => { handleUploadDelete(item.id) }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={item.include_in_context}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            onClick={(ev) => { handleFileHiding(idx) }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary={item.filename || item.id || "No Filename Given"} secondary={item.processed ? "Processing Complete" : "Processing In Progress"} />
                                                </ListItem>
                                                <Divider />
                                            </>
                                        )
                                    })
                                }

                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem
                        // secondaryAction={
                        //     <IconButton edge="end">
                        //       <ExpandMoreIcon />
                        //     </IconButton>
                        //   }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <HubIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Integrations" secondary="Coming Soon!" />
                        </ListItem>
                    </List>
                </div>
            </motion.div>
        </Layout>
    )
}