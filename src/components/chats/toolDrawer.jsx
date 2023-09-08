import { useTheme } from "@emotion/react";
import { Build, ExpandLess, ExpandMore, InsertDriveFile, MoreVert, Star } from "@mui/icons-material";
import { Box, Checkbox, Collapse, Divider, Drawer, Icon, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Slide, SwipeableDrawer, Tab, Tabs, Typography, styled } from "@mui/material";
import { useRef, useState } from "react";
import DataSelectTabs from "../utility/common/dataSelectTabs";

export default function ToolDrawer({ bot, setToolsExt, toolsExt, user, setBot }) {
    const [tabValue, setTabValue] = useState(0)
    const containerRef = useRef(null);

    const theme = useTheme()

    return (
        <>
            <Box sx={{
                height: toolsExt ? "339px" : "39px",
                transition: "all .3s ease-out",
                width: "100%",
                borderRadius: "8px 8px 0px 0px",
                flexWrap: "wrap",
                backgroundColor: "white"
            }}>
                <Box
                    sx={{
                        display: "flex",
                        height: "39px",
                        borderRadius: "8px 8px 0 0",
                        padding: "12px 16px",
                        color: theme.palette.common.blue,
                        width: "100%"
                    }}
                    onClick={() => { setToolsExt(!toolsExt) }}
                >
                    <Box sx={{ width: "90%" }}>
                        <Typography variant="body2">{bot.name} Settings</Typography>
                    </Box>
                    <IconButton onClick={() => { setToolsExt(!toolsExt) }} sx={{ width: "10%" }}>
                        {
                            toolsExt ? (<ExpandMore sx={{ fontSize: "16px", color: theme.palette.common.blue }} />) : (<ExpandLess sx={{ fontSize: "16px", color: theme.palette.common.blue }} />)
                        }

                    </IconButton>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        // height: toolsExt ? "300px" : "0px",
                        display: toolsExt ? null : "none",
                        transition: "all .3s ease-out"
                    }}
                >
                    <DataSelectTabs
                        isSelectable={true}
                        bot={bot}
                        user={user}
                        setBot={setBot}
                    />
                </Box>

            </Box>

        </>
    )
}  