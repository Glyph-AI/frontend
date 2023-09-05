import { useTheme } from "@emotion/react"
import { Box, Checkbox, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Select, Tab, Tabs, Typography, styled } from "@mui/material"
import SwipeableViews from "react-swipeable-views"
import TabPanel from "../tabPanel"
import { Add, Build, CheckBox, ChevronRight, InsertDriveFile, Star, Upload } from "@mui/icons-material"
import { useState } from "react"
import { useEffect } from "react"
import { getAvailableTexts, handleTextHide } from "@/components/api/texts"
import { getTools, handleToolDisable } from "@/components/api/tools"

export const StyledListItem = styled(ListItem)(() => ({
    borderRadius: "8px",
    "& .MuiListItemButton-root": {
        padding: "4px 4px 4px 4px"
    }
}))

export const StyledList = styled(List)(() => ({
    display: "flex",
    gap: "4px",
    flexWrap: "wrap"
}))


export const ItemCreate = styled(Box)(() => {
    const theme = useTheme()
    return ({
        // border: "1px solid" + theme.palette.primary.main,
        padding: "8px",
        borderRadius: "8px",
        display: "flex",
        // marginBottom: "8px",
        alignItems: "center",
        width: "100%",
        "& .text-container": {
            flex: 1,
            color: theme.palette.primary.main
        },
        "& .button-container": {
            color: "white",
            padding: 0,
            borderRadius: "2px",
            backgroundColor: theme.palette.primary.main
        }
    })
})

function SelectableListItem({ id, isSelected, onSelectionChange, primaryText, secondaryText }) {
    const selectionBackground = "rgba(47, 128, 237, 0.1)"
    console.log(isSelected)
    return (
        <StyledListItem
            disablePadding
            sx={{ backgroundColor: isSelected ? selectionBackground : null, width: "100%" }}
            onClick={onSelectionChange}
        >
            <ListItemButton>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                        id={`${id}-checkbox`}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={primaryText}
                    secondary={secondaryText}
                />
            </ListItemButton>
        </StyledListItem>
    )
}

function LinkListItem({ id, redirectUrl, primaryText, secondaryText }) {
    return (
        <>
            <StyledListItem
                disablePadding
                sx={{ paddingLeft: "16px", width: "100%" }}
                secondaryAction={
                    <IconButton>
                        <ChevronRight />
                    </IconButton>
                }
            >
                <ListItemButton>
                    <ListItemText
                        primary={primaryText}
                        secondary={secondaryText}
                    />
                </ListItemButton>
            </StyledListItem>
        </>
    )
}

export default function DataSelectTabs({ isSelectable, bot, setBot, user }) {
    const [tabValue, setTabValue] = useState(0)
    const [availableTexts, setAvailableTexts] = useState([])
    const [availableTools, setAvailableTools] = useState([])
    const theme = useTheme()

    const ListComponent = isSelectable ? SelectableListItem : LinkListItem

    const StyledTabs = styled(Tabs)(({ theme }) => ({
        minHeight: "28px",
        height: "28px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: "16px",
        "& .MuiTabs-flexContainer": {
            display: "flex",
            padding: "0px 16px 0px 16px",
            justifyContent: "center",
            gap: "25%"
        },
        "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.common.blue,
            borderRadius: "44px 44px 0px 0px",
            height: "4px"
        },
        "& .Mui-selected": {
            color: theme.palette.common.blue + " !important"
        }
    }))

    const StyledTab = styled(Tab)(({ theme }) => ({
        minHeight: "28px",
        height: "28px",
        padding: 0,
        minWidth: "0px"
    }))

    const handleTabChange = (idx) => {
        console.log(idx, tabValue)
        setTabValue(idx)
    }

    const notes = availableTexts.filter((el) => { return (el.text_type === "note") })

    const files = availableTexts.filter((el) => { return (el.text_type === "file") })

    const checkSelection = (array, el) => {
        if (array !== undefined) {
            var array_el = array.find(item => item.id === el.id)
            if (array_el !== undefined) {
                return true
            }
        }

        return false
    }

    useEffect(() => {
        getAvailableTexts(setAvailableTexts)
        getTools(setAvailableTools)
    }, [])

    return (
        <>
            <StyledTabs value={tabValue} onChange={(ev, val) => { setTabValue(val) }}>
                <StyledTab
                    value={0}
                    sx={{
                        fontSize: "12px",
                        color: theme.palette.common.subtitleBlue
                    }}
                    icon={<Star sx={{ height: "12px", width: "12px", mr: "4px !important" }} />}
                    iconPosition="start"
                    label={<Typography sx={{ fontWeight: 500 }} variant="body2">Notes</Typography>}
                />
                <StyledTab
                    value={1}
                    sx={{
                        fontSize: "12px",
                        color: theme.palette.common.subtitleBlue
                    }}
                    icon={<InsertDriveFile sx={{ height: "12px", width: "12px", mr: "4px !important" }} />}
                    iconPosition="start"
                    label={<Typography sx={{ fontWeight: 500 }} variant="body2">Files</Typography>}
                />
                <StyledTab
                    value={2}
                    sx={{
                        fontSize: "12px",
                        color: theme.palette.common.subtitleBlue
                    }}
                    icon={<Build sx={{ height: "12px", width: "12px", mr: "4px !important" }} />}
                    iconPosition="start"
                    label={<Typography sx={{ fontWeight: 500 }} variant="body2">Tools</Typography>}
                />
            </StyledTabs>
            <Box sx={{ height: "90%", overflowY: "scroll" }}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleTabChange}
                >
                    <TabPanel value={tabValue} index={0} dir={theme.direction}>
                        {
                            Math.abs(user.files_left) > 0 && (
                                <ItemCreate>
                                    <Box className="text-container" sx={{}}>
                                        <Typography variant="body2">Create New</Typography>
                                    </Box>
                                    <IconButton className="button-container">
                                        <Add />
                                    </IconButton>
                                </ItemCreate>
                            )
                        }
                        <StyledList dense={false} >
                            {
                                notes.map((el) => (
                                    <ListComponent
                                        id={el.id}
                                        isSelected={checkSelection(bot.enabled_texts, el)}
                                        primaryText={el.name}
                                        secondaryText={el.content.slice(0, 20) + "..."}
                                        onSelectionChange={() => { handleTextHide(bot, el, setBot) }}
                                    />
                                ))
                            }

                        </StyledList>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} dir={theme.direction}>
                        {
                            Math.abs(user.files_left) > 0 && (
                                <ItemCreate>
                                    <Box className="text-container" sx={{ flex: 1, color: theme.palette.primary.main }}>
                                        <Typography variant="body2">Upload File</Typography>
                                    </Box>
                                    <IconButton className="button-container">
                                        <Upload />
                                    </IconButton>
                                </ItemCreate>
                            )
                        }

                        <StyledList dense={false}>
                            {
                                files.map((el) => (
                                    <ListComponent
                                        id={el.id}
                                        isSelected={checkSelection(bot.enabled_texts, el)}
                                        primaryText={el.name}
                                        onSelectionChange={() => { handleTextHide(bot, el, setBot) }}
                                    />
                                ))
                            }
                        </StyledList>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} dir={theme.direction}>
                        <StyledList dense={false}>
                            {
                                availableTools.map((el) => (
                                    <ListComponent
                                        id={el.id}
                                        isSelected={checkSelection(bot.enabled_tools, el)}
                                        primaryText={el.name}
                                        secondaryText={el.description}
                                        onSelectionChange={() => { handleToolDisable(bot, el, setBot) }}
                                    />
                                ))
                            }
                        </StyledList>
                    </TabPanel>
                </SwipeableViews>
            </Box>
        </>

    )
}