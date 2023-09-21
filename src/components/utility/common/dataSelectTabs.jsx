import { createText, getAvailableTexts, handleTextHide } from "@/components/api/texts"
import { getTools, handleToolDisable } from "@/components/api/tools"
import { useTheme } from "@emotion/react"
import { Add, Build, ChevronRight, InsertDriveFile, Star, Upload } from "@mui/icons-material"
import { Box, Button, ButtonBase, Icon, IconButton, ListItem, ListItemButton, ListItemText, Tab, Tabs, Typography, styled, useMediaQuery } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import SwipeableViews from "react-swipeable-views"
import { StyledList } from "../styled/styledList"
import TabPanel from "../tabPanel"
import UserUploadModal from "../userUploadModal"

const DataTabsListItem = styled(ListItem)(() => ({
    borderRadius: "8px",
    "& .MuiListItemButton-root": {
        padding: "4px 8px"
    }
}))

export function ItemCreate({ isSelectable, children, ...props }) {
    const theme = useTheme()
    return (
        <ButtonBase
            sx={{
                // border: "1px solid" + theme.palette.primary.main,
                padding: "8px",
                textAlign: "left",
                borderRadius: "8px",
                height: "24px",
                display: "flex",
                // marginBottom: "8px",
                alignItems: "center",
                width: "100%",
                "& .text-container": {
                    flex: 1,
                    color: theme.palette.primary.main,
                    padding: 0
                },
                "& .button-container": {
                    color: "white",
                    padding: 0,
                    borderRadius: "2px",
                    backgroundColor: theme.palette.primary.main
                }
            }}
            {...props}
        >
            {children}
        </ButtonBase>
    )
}

function SeeMoreButton({ ...props }) {
    const theme = useTheme()
    return (
        <Box sx={{ p: 2, width: "100%" }}>
            <Button
                {...props}
                fullWidth
                variant="outlined"
                sx={{
                    textTransform: "none",
                    height: "40px",
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
            <ListItemButton disableRipple sx={{ borderRadius: "8px" }}>
                <ListItemText
                    primary={primaryText}
                    secondary={secondaryText}
                />
            </ListItemButton>
        </DataTabsListItem>
    )
}

function LinkListItem({ id, redirectUrl, primaryText, secondaryText, isTool }) {
    const router = useRouter()
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
                onClick={() => { router.push(redirectUrl) }}
            >
                <ListItemButton sx={{ borderRadius: "8px" }}>
                    <ListItemText
                        primary={primaryText}
                        secondary={secondaryText}
                    />
                </ListItemButton>
            </DataTabsListItem>
        </>
    )
}

export default function DataSelectTabs({ isSelectable, bot, setBot, user, contentHeight, createMode, seeMore, tabState, availableTexts, setAvailableTexts }) {
    const [tabValue, setTabValue] = useState(0)
    const [availableTools, setAvailableTools] = useState([])
    const [notesToDisplay, setNotesToDisplay] = useState(10000)
    const [filesToDisplay, setFilesToDisplay] = useState(10000)
    const [toolsToDisplay, setToolsToDisplay] = useState(10000)
    const [notes, setNotes] = useState([])
    const [files, setFiles] = useState([])
    const [fileUploadModalOpen, setFileUploadModalOpen] = useState(false)
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))
    const router = useRouter()


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

    const checkSelection = (array, el) => {
        if (array !== undefined) {
            var array_el = array.find(item => item.id === el.id)
            if (array_el !== undefined) {
                return true
            }
        }

        return false
    }

    const handleNoteCreate = () => {
        createText({ name: "New Note", content: "", text_type: "note" }, (data) => {
            router.push(smallScreen ? `/notes/${data.id}` : `${router.pathname}?note_id=${data.id}`)
        });
    }

    useEffect(() => {
        getTools(setAvailableTools)
        if (typeof availableTexts === "undefined") {
            console.log("Getting Texts")
            getAvailableTexts((data) => {
                setNotes(data.filter((el) => { return (el.text_type === "note") }))
                setFiles(data.filter((el) => { return (el.text_type === "file") }))
            })

        } else {
            setNotes(availableTexts.filter((el) => { return (el.text_type === "note") }))
            setFiles(availableTexts.filter((el) => { return (el.text_type === "file") }))
        }



        if (typeof tabState !== "undefined") {
            setTabValue(tabState)
        }

        if (seeMore) {
            setNotesToDisplay(3)
            setFilesToDisplay(3)
            setToolsToDisplay(3)
        }
    }, [tabState, availableTexts])

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

    const handleUploadClose = () => {
        setFileUploadModalOpen(false);
        if (typeof setAvailableTexts !== "undefined") {
            getAvailableTexts(setAvailableTexts)
        } else {
            getAvailableTexts((data) => {
                setNotes(data.filter((el) => { return (el.text_type === "note") }))
                setFiles(data.filter((el) => { return (el.text_type === "file") }))
            })
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
            <Box className="test" sx={{ maxHeight: contentHeight || "90%" }}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleTabChange}
                >
                    <TabPanel
                        value={tabValue}
                        index={0}
                        dir={theme.direction}
                    >
                        <Box sx={{ padding: 1 }}>
                            {
                                Math.abs(user.files_left) > 0 && (
                                    <ItemCreate className="itemCreate" onClick={handleNoteCreate}>
                                        <Box className="text-container" sx={{ paddingLeft: isSelectable ? "0px !important" : 2 }}>
                                            <Typography variant="body2">Create New</Typography>
                                        </Box>
                                        <Icon className="button-container">
                                            <Add />
                                        </Icon>
                                    </ItemCreate>
                                )
                            }
                            <StyledList dense={false}>
                                {
                                    notes.slice(0, notesToDisplay).map((el, idx) => (
                                        <ListComponent
                                            key={idx}
                                            id={el.id}
                                            isSelected={bot ? checkSelection(bot.enabled_texts, el) : false}
                                            primaryText={el.name}
                                            secondaryText={el.content.slice(0, 20) + "..."}
                                            onSelectionChange={() => { handleTextClick(el) }}
                                            redirectUrl={smallScreen ? `/notes/${el.id}` : `${router.pathname}?note_id=${el.id}`}
                                        />
                                    ))
                                }

                            </StyledList>
                            {(notesToDisplay < notes.length) ? <SeeMoreButton onClick={() => { setNotesToDisplay(notesToDisplay + 3) }} /> : null}
                            {
                                (notes.length === 0 || !files) && (
                                    <Box className="filler" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px", width: "100%" }}>
                                        <Icon sx={{ height: "50%", width: "50%", opacity: "0.1" }}>
                                            <Star sx={{ height: "100%", width: "100%" }} />
                                        </Icon>
                                    </Box>
                                )
                            }
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} dir={theme.direction}>
                        {
                            Math.abs(user.files_left) > 0 && (
                                <ItemCreate className="itemCreate" onClick={() => { setFileUploadModalOpen(true) }} >
                                    <Box className="text-container" sx={{ paddingLeft: isSelectable ? "0px !important" : 2 }}>
                                        <Typography variant="body2">Upload File</Typography>
                                    </Box>
                                    <Icon className="button-container">
                                        <Upload />
                                    </Icon>
                                </ItemCreate>
                            )
                        }

                        <StyledList dense={false}>
                            {
                                files.slice(0, filesToDisplay).map((el, idx) => (
                                    <ListComponent
                                        key={idx}
                                        id={el.id}
                                        isSelected={bot ? checkSelection(bot.enabled_texts, el) : false}
                                        primaryText={el.name}
                                        onSelectionChange={() => { handleTextClick(el) }}
                                        isTool={true}
                                    />
                                ))
                            }
                            {(filesToDisplay < files.length) ? <SeeMoreButton onClick={() => { setFilesToDisplay(filesToDisplay + 3) }} /> : null}
                            {
                                (files.length === 0 || !files) && (
                                    <Box className="filler" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px", width: "100%" }}>
                                        <Icon sx={{ height: "50%", width: "50%", opacity: "0.1" }}>
                                            <InsertDriveFile sx={{ height: "100%", width: "100%" }} />
                                        </Icon>
                                    </Box>
                                )
                            }
                        </StyledList>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2} dir={theme.direction}>
                        <StyledList dense={false}>
                            {
                                availableTools.slice(0, toolsToDisplay).map((el, idx) => (
                                    <ListComponent
                                        key={idx}
                                        id={el.id}
                                        isSelected={bot ? checkSelection(bot.enabled_tools, el) : false}
                                        primaryText={el.name}
                                        secondaryText={el.description}
                                        onSelectionChange={() => { handleToolClick(el) }}
                                        isTool={true}
                                    />
                                ))
                            }
                            {(toolsToDisplay < availableTools.length) ? <SeeMoreButton onClick={() => { setToolsToDisplay(toolsToDisplay + 3) }} /> : null}
                        </StyledList>
                    </TabPanel>
                </SwipeableViews>
                <UserUploadModal
                    open={fileUploadModalOpen}
                    handleClose={() => { setFileUploadModalOpen(false) }}
                />
            </Box>
        </>

    )
}