import { useTheme } from "@emotion/react"
import { Box, Checkbox, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Select, Tab, Tabs, Typography, styled } from "@mui/material"
import SwipeableViews from "react-swipeable-views"
import TabPanel from "../tabPanel"
import { Build, CheckBox, ChevronRight, InsertDriveFile, Star } from "@mui/icons-material"
import { useState } from "react"

const StyledListItem = styled(ListItem)(() => ({
    borderRadius: "8px",
    "& .MuiListItemButton-root": {
        padding: "4px 4px 4px 4px"
    }
}))

function SelectableListItem({idx, isSelected, onSelectionChange, primaryText, secondaryText}) {
    const selectionBackground = "rgba(47, 128, 237, 0.1)"
    return (
        <StyledListItem disablePadding sx={{backgroundColor: isSelected ? selectionBackground : null}}>
            <ListItemButton>
                <ListItemIcon>
                    <CheckBox/>
                </ListItemIcon>
                <ListItemText
                    primary={primaryText}
                    secondary={secondaryText}
                />
            </ListItemButton>
        </StyledListItem>
    )
}

function LinkListItem({idx, redirectUrl, primaryText, secondaryText}) {
    return (
        <>
            <StyledListItem 
                disablePadding
                sx={{paddingLeft: "16px"}}
                secondaryAction={
                    <IconButton>
                        <ChevronRight/>
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

export default function DataSelectTabs({isSelectable}) {
    const [tabValue, setTabValue] = useState(0)
    const theme = useTheme()
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

    return (
        <>
            <StyledTabs value={tabValue} onChange={(ev, val) => { setTabValue(val)}}>
                    <StyledTab 
                        value={0}
                        sx={{
                            fontSize: "12px",
                            color: theme.palette.common.subtitleBlue
                        }} 
                        icon={<Star sx={{height: "12px", width: "12px", mr: "4px !important"}} />} 
                        iconPosition="start" 
                        label={<Typography sx={{fontWeight: 500}} variant="body2">Notes</Typography>}
                    />
                    <StyledTab 
                        value={1}
                        sx={{
                            fontSize: "12px",
                            color: theme.palette.common.subtitleBlue
                        }} 
                        icon={<InsertDriveFile sx={{height: "12px", width: "12px", mr: "4px !important"}} />} 
                        iconPosition="start" 
                        label={<Typography sx={{fontWeight: 500}} variant="body2">Files</Typography>}
                    />
                    <StyledTab 
                        value={2}
                        sx={{
                            fontSize: "12px",
                            color: theme.palette.common.subtitleBlue
                        }} 
                        icon={<Build sx={{height: "12px", width: "12px", mr: "4px !important"}} />} 
                        iconPosition="start" 
                        label={<Typography sx={{fontWeight: 500}} variant="body2">Tools</Typography>}
                    />
                </StyledTabs>
                <Box sx={{height: "90%", overflowY: "scroll"}}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={tabValue}
                        onChangeIndex={handleTabChange}
                    >
                        <TabPanel value={tabValue} index={0} dir={theme.direction}>
                            <List dense={false} >
                                <SelectableListItem
                                    isSelected={true}
                                    primaryText={"Note 1"}
                                    secondaryText={"Some content of the..."}
                                />
                            </List>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1} dir={theme.direction}>
                            <List dense={false}>
                                <LinkListItem 
                                    primaryText={"File 1"}
                                />
                            </List>
                        </TabPanel>
                        <TabPanel value={tabValue} index={2} dir={theme.direction}>
                            <List dense={false}>
                                
                            </List>
                        </TabPanel>
                    </SwipeableViews>
                </Box>
        </>
        
    )
}