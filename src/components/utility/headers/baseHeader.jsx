import { Search } from "@mui/icons-material";
import { AppBar, Box, Divider, IconButton, styled, TextField, Toolbar, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

export const StyledAppBar = styled(AppBar)(() => {
    const theme = useTheme()

    return ({
        backgroundColor: "#ffffff",
        color: theme.palette.common.darkBlue,
        fontWeight: 500
    })
})

export const StyledToolbar = styled(Toolbar)(({ theme }) => {
    return (
        {
            paddingLeft: 0,
            marginBottom: "4px",
            marginTop: "4px"
        }
    )

})

export const TransitionTextField = styled(TextField)(() => ({
    transition: "all .3s ease-out"
}))

export default function BaseHeader({ title, searchFunction }) {
    const [searchActive, setSearchActive] = useState(false)
    const theme = useTheme()
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
    }, [searchActive])

    return (
        <>
            <StyledAppBar
                position="sticky"
                elevation={0}
            >
                <StyledToolbar sx={{ display: "flex", paddingLeft: "8px" }}>
                    <Box sx={{ flex: 1 }} onClick={() => { setSearchActive(!searchActive) }}>
                        <Typography
                            sx={
                                {
                                    display: searchActive ? "none" : null,
                                    opacity: searchActive ? "0%" : "100%",
                                    transition: "all 0.3s ease-out"
                                }
                            }
                            variant="body"
                        >
                            {title}
                        </Typography>

                        <TransitionTextField
                            inputProps={
                                { id: "test-input", onBlur: () => { setSearchActive(!searchActive) } }}
                            inputRef={inputRef}
                            sx={
                                {
                                    display: searchActive ? null : "none",
                                    opacity: searchActive ? "1000%" : "0%"
                                }
                            }
                            size="small"
                            placeholder="Search..."
                            onChange={(ev) => { searchFunction(ev.target.value) }}
                        />

                    </Box>
                    <IconButton edge="end">
                        <Search onClick={() => { setSearchActive(!searchActive) }} />
                    </IconButton>
                </StyledToolbar>
            </StyledAppBar>
        </>
    )
}