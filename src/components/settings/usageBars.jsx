import { Box, LinearProgress, Typography, useMediaQuery, useTheme } from "@mui/material";

function LinearProgressWithLabel({ labelValue, maxValue, ...props }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{labelValue}/{maxValue === -1 ? "INF" : maxValue}</Typography>
            </Box>
        </Box>
    );
}

export default function UsageBars({ user, dense }) {
    const progressBarWidth = dense ? "30%" : "90%"
    const calculateBotValue = () => {
        if (user.allowed_bots === -1) {
            return 0
        }

        return ((user.allowed_bots - user.bots_left) / (user.allowed_bots)) * 100
    }

    const calculateMessageValue = () => {
        return ((user.allowed_messages - user.messages_left) / (user.allowed_messages)) * 100
    }

    const calculateFileValue = () => {
        if (user.allowed_files === -1) {
            return 0
        }

        return ((user.allowed_files - user.files_left) / (user.allowed_files)) * 100
    }

    return (
        <Box sx={{ flexWrap: "wrap", display: "flex", gap: "3%", alignContent: "center", justifyContent: "center", padding: "8px", pb: 3 }}>
            <Box sx={{ width: progressBarWidth }}>
                <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                    <Typography variant="body2">Bots</Typography>
                </Box>
                <LinearProgressWithLabel
                    variant="determinate"
                    color="primary"
                    sx={{ width: "100%" }}
                    value={calculateBotValue()}
                    labelValue={user.bot_count}
                    maxValue={user.allowed_bots}
                />
            </Box>
            <Box sx={{ width: progressBarWidth }}>
                <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                    <Typography variant="body2">Messages</Typography>
                </Box>
                <LinearProgressWithLabel
                    variant="determinate"
                    color="primary"
                    value={calculateMessageValue()}
                    labelValue={user.message_count}
                    maxValue={user.allowed_messages}
                />
            </Box>
            <Box sx={{ width: progressBarWidth }}>
                <Box sx={{ alignContent: "center", jusfityContent: "center", textAlign: "center" }}>
                    <Typography variant="body2">Files & Notes</Typography>
                </Box>
                <LinearProgressWithLabel
                    variant="determinate"
                    color="primary"
                    value={calculateFileValue()}
                    labelValue={user.file_count}
                    maxValue={user.allowed_files}
                />
            </Box>
        </Box>
    )
}