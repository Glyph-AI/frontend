import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { Checkbox, Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { useEffect, useState } from "react"
import { genericRequest, getRequest } from "../utility/request_helper"

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
        var bot_tool = bot.enabled_tools.find(item => item.id === id)
        if (bot_tool === undefined) {
            return false
        } else {
            return true
        }
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
                <List component="div" disablePadding>
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
                                            <ListItemText primary={item.name} secondary={item.description} />
                                        </ListItem>
                                    </>
                                )
                            }
                        })
                    }
                </List>
            </Collapse>
        </List>
    )
}