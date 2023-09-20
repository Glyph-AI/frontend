import { useTheme } from "@emotion/react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Fade, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DataSelectTabs from "../utility/common/dataSelectTabs";
import { getAvailableTexts } from "../api/texts";

export default function ToolDrawer({ bot, setToolsExt, toolsExt, user, setBot, desktopMode }) {
    const [availableTexts, setAvailableTexts] = useState([])
    const containerRef = useRef(null);

    const theme = useTheme()

    useEffect(() => {
        getAvailableTexts(setAvailableTexts)
    }, [])

    return (
        <>
            <Box sx={{
                height: toolsExt ? "339px" : "39px",
                transition: "all .3s ease-out",
                width: "100%",
                borderRadius: "8px 8px 0px 0px",
                flexWrap: "wrap",
                backgroundColor: desktopMode ? "#2f80ed1a" : "white",
                display: 'flex'
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
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">{bot.name} Settings</Typography>
                    </Box>
                    <IconButton onClick={() => { setToolsExt(!toolsExt) }} sx={{ width: "5%" }}>
                        {
                            toolsExt ? (<ExpandMore sx={{ fontSize: "16px", color: theme.palette.common.blue }} />) : (<ExpandLess sx={{ fontSize: "16px", color: theme.palette.common.blue }} />)
                        }

                    </IconButton>
                </Box>
                <Fade in={toolsExt}>
                    <Box
                        sx={{
                            width: "100%",
                            height: toolsExt ? "300px" : "0px",
                            display: toolsExt ? null : "none",
                            transition: "all .3s ease-out"
                        }}
                    >
                        <DataSelectTabs
                            isSelectable={true}
                            bot={bot}
                            user={user}
                            setBot={setBot}
                            seeMore={true}
                            availableTexts={availableTexts}
                            setAvailableTexts={setAvailableTexts}
                        />
                    </Box>
                </Fade>

            </Box>

        </>
    )
}  