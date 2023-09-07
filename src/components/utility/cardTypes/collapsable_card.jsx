import { ExpandLess, ExpandMore, PersonAdd, Search } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Collapse, IconButton, Typography, Box, Divider } from "@mui/material";
import { useState } from "react";

function ExpandedActions({ newItemFunc }) {
    return (
        <Box>
            <IconButton>
                <PersonAdd onClick={(ev) => { ev.stopPropagation(); newItemFunc() }} />
            </IconButton>
            <IconButton>
                <Search />
            </IconButton>
        </Box>
    )
}

export default function CollapsibleCard({ avatar, title, children, newItemFunc }) {
    const [expanded, setExpanded] = useState(false)
    return (
        <Card
            elevation={0}
            sx={
                {
                    backgroundColor: "#ffffff",
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ececec"
                }
            }
        >
            <CardHeader
                onClick={() => { setExpanded(!expanded) }}
                avatar={avatar}
                action={expanded ? <ExpandedActions newItemFunc={newItemFunc} /> : <ExpandMore />}
                title={title}
            />
            <Collapse in={expanded}>
                <Divider variant="middle" />
                <CardContent>
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    )
}