import { Icon, useTheme } from "@mui/material";

export default function NewChatIcon() {
    const theme = useTheme()

    return (
        <Icon
            sx={{
                backgroundColor: theme.palette.common.blue,
                height: "27px",
                width: "27px",
                borderRadius: "13.5px"
            }}
        >
            <img
                height="17px"
                width="17px"
                src="/external_icons/new_chat.svg"
            />
        </Icon>
    )
}