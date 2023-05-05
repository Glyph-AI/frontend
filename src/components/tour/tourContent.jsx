import React from 'react';
import { Avatar, Box } from "@mui/material";

export default function TourContent({ text }) {
    return (
        <Box sx={{ width: "100%", flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ marginBottom: "16px", width: "100%", display: "flex", alignItemns: "center", justifyContent: "center" }}>
                <Avatar sx={{ height: "30%", width: "30%" }} src={"/glyph-avatar.png"} name={"Glyph"} />
            </Box>
            <>{text}</>
        </Box>
    )
}