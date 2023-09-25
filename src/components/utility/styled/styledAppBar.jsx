import { useTheme } from "@emotion/react"
import { AppBar, styled } from "@mui/material"

export const StyledAppBar = styled(AppBar)(() => {
    const theme = useTheme()

    return ({
        backgroundColor: theme.palette.background.main,
        color: theme.palette.primary.main,
        fontWeight: 500
    })
})