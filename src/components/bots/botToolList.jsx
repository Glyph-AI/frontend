import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Button, Checkbox, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { useEffect, useState } from "react"
import { genericRequest, getRequest } from "../utility/request_helper"
import { googleOauth } from "../utility/google_oauth"

export default function BotToolList({ bot, setBot }) {
    const [listOpen, setListOpen] = useState(false)
    const [availableTools, setAvailableTools] = useState([])

    useEffect(() => {
        getRequest("/tools", (data) => {
            setAvailableTools(data)
        })
        console.log(bot)
    }, [])

    const isEnabledForBot = (id) => {
        if (bot.enabled_tools !== undefined) {
            var bot_tool = bot.enabled_tools.find(item => item.id === id)
            if (bot_tool === undefined) {
                return false
            } else {
                return true
            }
        }
        return false

    }

    const handleToolDisable = (id) => {
        genericRequest(`/bots/${bot.id}/${id}`, "PATCH", null, (data) => {
            setBot(data)
        })
    }

    return (
        <List>
            <ListItem
                secondaryAction={
                    <IconButton edge="end">
                        {listOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                }
                onClick={() => {
                    setListOpen(!listOpen)
                }}
            >
                <ListItemText primary="Tools" primaryTypographyProps={{ sx: { fontSize: 18 } }} />
            </ListItem>
            <Collapse in={listOpen} unmountOnExit>
                <List sx={{ overflowY: "scroll", maxHeight: "100%", backgroundColor: "white" }} component="div" disablePadding>
                    {
                        availableTools && availableTools.map((item, idx) => {
                            if (item.name !== "Respond to User") {
                                return (
                                    <>
                                        <ListItem key={idx} sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={isEnabledForBot(item.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    onClick={(ev) => { handleToolDisable(item.id) }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                sx={{ maxWidth: "65%" }}
                                                primary={item.name}
                                                secondary={item.description}
                                            />
                                        </ListItem>
                                    </>
                                )
                            }
                        })
                    }
                    <>
                        <ListItem
                            key={10}
                            sx={{ pl: 4 }}
                            secondaryAction={
                                <Button edge="end" aria-label="delete" onClick={(ev) => { googleOauth(bot.id) }}>
                                    Sign-In
                                </Button>
                            }
                        >
                            <ListItemIcon>
                                <Checkbox
                                    disabled
                                    edge="start"
                                    // checked={isEnabledForBot(item.id)}
                                    tabIndex={-1}
                                    disableRipple
                                // onClick={(ev) => { handleToolDisable(item.id) }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                sx={{ maxWidth: "65%" }}
                                primary={"Google Calendar"}
                                secondary={"Allows access to read and create events on your Google Calendar"}
                            />
                        </ListItem>
                    </>
                </List>
            </Collapse>
        </List>
    )
}