import { Switch, styled, useTheme } from "@mui/material"

export const StyledSwitch = styled(Switch)(() => {
    const theme = useTheme()
    return ({
        "& .Mui-checked": {
            "& .MuiSwitch-thumb": {
                backgroundColor: theme.palette.common.blue

            }
        },
        "& .MuiSwitch-thumb": {
            backgroundColor: "rgba(79, 94, 123, 0.4)",
            opacity: 1

        },
        "& .MuiSwitch-track": {
            backgroundColor: "rgba(79, 94, 123, 0.2)"
        }
    })

})