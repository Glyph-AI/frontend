import { useTheme } from "@emotion/react"
import { Box, Button, Checkbox, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Select, Tab, Tabs, Typography, styled, useThemeProps } from "@mui/material"
import SwipeableViews from "react-swipeable-views"
import TabPanel from "../tabPanel"
import { Add, Build, CheckBox, ChevronRight, InsertDriveFile, Star, Upload } from "@mui/icons-material"
import { useState } from "react"
import { useEffect } from "react"
import { getAvailableTexts, handleTextHide } from "@/components/api/texts"
import { getTools, handleToolDisable } from "@/components/api/tools"
import { StyledList } from "../styled/styledList"

const DataTabsListItem = styled(ListItem)(() => ({
    borderRadius: "8px",
    "& .MuiListItemButton-root": {
        padding: "4px 8px"
    }
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

function SeeMoreButton() {
    const theme = useTheme()
    return (
        <Box sx={{ p: 2, width: "100%" }}>
            <Button
                fullWidth
                variant="outlined"
                sx={{
                    textTransform: "none",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: theme.palette.background.secondary
                }}
            >
                <Typography variant="body2">See more</Typography>
            </Button>
        </Box>
    )
}

function SelectableListItem({ id, isSelected, onSelectionChange, primaryText, secondaryText }) {
    const selectionBackground = "rgba(47, 128, 237, 0.1)"
    return (
        <DataTabsListItem
            disablePadding
            sx={{ backgroundColor: isSelected ? selectionBackground : null, width: "100%" }}
            onClick={onSelectionChange}
        >
            <ListItemButton disableRipple>
                <ListItemText
                    primary={primaryText}
                    secondary={secondaryText}
                />
            </ListItemButton>
        </DataTabsListItem>
    )
}

function LinkListItem({ id, redirectUrl, primaryText, secondaryText, isTool }) {
    return (
        <>
            <DataTabsListItem
                disablePadding
                sx={{ paddingLeft: "16px", width: "100%" }}
                secondaryAction={
                    !isTool && (
                        <IconButton>
                            <ChevronRight />
                        </IconButton>
                    )
                }
            >
                <ListItemButton>
                    <ListItemText
                        primary={primaryText}
                        secondary={secondaryText}
                    />
                </ListItemButton>
            </DataTabsListItem>
        </>
    )
}

export default function DataSelectTabs({ isSelectable, bot, setBot, user, contentHeight, createMode, seeMore }) {
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

    const handleTextClick = (el) => {
        if (createMode) {
            if (bot.enabled_texts.includes(el)) {
                setBot({ ...bot, enabled_texts: bot.enabled_texts.filter((i) => i !== el) })
            } else {
                setBot({ ...bot, enabled_texts: [...bot.enabled_texts, el] })
            }
        } else {
            handleTextHide(bot, el, setBot)
        }

    }

    const handleToolClick = (el) => {
        if (createMode) {
            if (bot.enabled_tools.includes(el)) {
                setBot({ ...bot, enabled_tools: bot.enabled_tools.filter((i) => i !== el) })
            } else {
                setBot({ ...bot, enabled_tools: [...bot.enabled_tools, el] })
            }
        } else {
            handleToolDisable(bot, el, setBot)
        }
    }

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
            <Box className="test" sx={{ maxHeight: contentHeight || "90%", overflowY: "scroll" }}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleTabChange}
                >
                    <TabPanel
                        sx={{
                            "& .MuiBox-root": {
                                padding: "14px"
                            }
                        }}
                        value={tabValue}
                        index={0}
                        dir={theme.direction}
                    >
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
                                        isSelected={bot ? checkSelection(bot.enabled_texts, el) : false}
                                        primaryText={el.name}
                                        secondaryText={el.content.slice(0, 20) + "..."}
                                        onSelectionChange={() => { handleTextClick(el) }}
                                    />
                                ))
                            }

                        </StyledList>
                        {seeMore && <SeeMoreButton />}
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
                                        isSelected={bot ? checkSelection(bot.enabled_texts, el) : false}
                                        primaryText={el.name}
                                        onSelectionChange={() => { handleTextClick(el) }}
                                    />
                                ))
                            }
                            {seeMore && <SeeMoreButton />}
                        </StyledList>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} dir={theme.direction}>
                        <StyledList dense={false}>
                            {
                                availableTools.map((el) => (
                                    <ListComponent
                                        id={el.id}
                                        isSelected={bot ? checkSelection(bot.enabled_tools, el) : false}
                                        primaryText={el.name}
                                        secondaryText={el.description}
                                        onSelectionChange={() => { handleToolClick(el) }}
                                        isTool={true}
                                    />
                                ))
                            }
                            {seeMore && <SeeMoreButton />}
                        </StyledList>
                    </TabPanel>
                </SwipeableViews>
            </Box>
        </>

    )
}