import { ExpandLess, ExpandMore, PersonAdd, Search } from "@mui/icons-material";
import { Box, Card, CardContent, CardHeader, Collapse, Divider, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function ExpandedActions({ newItemFunc, searchActive, setSearchActive }) {
    const handleSearchClick = (ev) => {
        ev.stopPropagation()
        setSearchActive(true)

    }
    return (
        <>
            {
                !searchActive && (
                    <Box>
                        <IconButton onClick={(ev) => { ev.stopPropagation(); newItemFunc() }} >
                            <PersonAdd />
                        </IconButton>
                        <IconButton>
                            <Search onClick={(ev) => { handleSearchClick(ev) }} />
                        </IconButton>
                    </Box>
                )
            }
        </>

    )
}

export default function CollapsibleCard({ avatar, title, children, newItemFunc, expand, searchFunc, searchBlurFunc }) {
    const [expanded, setExpanded] = useState(false)
    const [searchActive, setSearchActive] = useState(false)
    const [searchValue, setSearchValue] = useState("")

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
                <ExpandedActions setSearchActive={setSearchActive} searchActive={searchActive} newItemFunc={newItemFunc} />
            )
        } else {
            return (<ExpandLess />)
        }
    }

    const handleSearch = (ev) => {
        setSearchValue(ev.target.value)
        console.log(searchFunc)
        searchFunc(ev.target.value)
    }

    const handleBlur = () => {
        setSearchActive(false)
        setSearchValue("")
        searchBlurFunc()
    }

    const formatTitle = () => {
        if (searchActive) {
            return (
                <TextField
                    autoFocus
                    onClick={(ev) => { ev.stopPropagation() }}
                    onBlur={handleBlur}
                    size="small"
                    fullWidth
                    placeholder="Search..."
                    onChange={handleSearch}
                    value={searchValue}
                />
            )
        }

        return title
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
                title={formatTitle()}
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