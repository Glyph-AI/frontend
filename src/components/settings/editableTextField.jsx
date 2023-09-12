import { Edit } from "@mui/icons-material"
import { Box, TextField, Typography, useTheme } from "@mui/material"
import { useState } from "react"

export default function EditableTextField({ placeholder, handleChange, handleSubmit }) {
    const [isFocused, setIsFocused] = useState(false)
    const theme = useTheme()

    const fieldSubmit = () => {
        setIsFocused(false)
        handleSubmit()
    }

    return (
        <Box sx={{ fontWeight: 500, width: "100%" }}>
            {
                !isFocused ? (
                    <Typography variant="body" onClick={() => { setIsFocused(true) }}>{placeholder}<Edit sx={{ color: "gray", fontSize: 16, ml: "4px" }} /></Typography>
                ) : (
                    <TextField
                        autoFocus
                        variant="standard"
                        placeholder={placeholder}
                        onChange={(e) => { handleChange(e.target.value) }}
                        onBlur={(e) => { fieldSubmit() }}
                    />
                )
            }

        </Box>
    )
}