import { Expand, ExpandLess, ExpandMore, PersonAdd, Search } from "@mui/icons-material";
import { Card, CardContent, CardHeader, Collapse, IconButton, Typography, Box, Divider } from "@mui/material";
import { useEffect, useState } from "react";

function ExpandedActions({ newItemFunc }) {
    return (
        <Box>
            <IconButton onClick={(ev) => { ev.stopPropagation(); newItemFunc() }} >
                <PersonAdd />
            </IconButton>
            <IconButton>
                <Search />
            </IconButton>
        </Box>
    )
}

export default function CollapsibleCard({ avatar, title, children, newItemFunc, expand }) {
    const [expanded, setExpanded] = useState(false)

    useEffect(() => {
        if (expand) {
            setExpanded(true)
        } else {
            setExpanded(false)
        }
    }, [expand])

    const action = () => {
        if (newItemFunc) {
            return (
                <ExpandedActions newItemFunc={newItemFunc} />
            )
        } else {
            return (<ExpandLess />)
        }
    }

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
                action={expanded ? action() : <ExpandMore />}
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