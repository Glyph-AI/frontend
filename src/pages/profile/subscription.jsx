import LayoutWithNav from "@/components/utility/layout_with_nav";
import { getRequest } from "@/components/utility/request_helper";
import { ChatBubble, SmartToy, UploadFile } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, CardMedia, List, ListItem, ListItemIcon, ListItemText, Paper, Radio, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const env = process.env.NEXT_PUBLIC_ENVIRONMENT

export default function SubscriptionOptions() {
    const [monthly, setMonthly] = useState(true)
    const [annual, setAnnual] = useState(false)
    const [inTwa, setInTwa] = useState(false)

    const handleRadioChange = () => {
        setMonthly(!monthly)
        setAnnual(!annual)
    }

    useEffect(() => {
        if (window && 'getDigitalGoodsService' in window) {
            setInTwa(true)
        }

        if (env === "ios") {
            setInTwa(true)
        }
    })

    const handleCheckout = () => {
        if (annual) {
            const url = "/subscriptions/checkout-session?bill_cycle=Annual"
            getRequest(url, (data) => {
                window.location.href = data.url
            })
        } else {
            const url = "/subscriptions/checkout-session?bill_cycle=Monthly"
            getRequest(url, (data) => {
                window.location.href = data.url
            })
        }
    }

    const renderCheckout = () => {
        return (
            <>
                <Box sx={{ display: "flex", width: "100%", flexWrap: "wrap", marginTop: "16px" }}>
                    <Card onClick={handleRadioChange} elevation={monthly ? 10 : 3} sx={{ marginBottom: "16px", width: "100%" }}>
                        <CardHeader
                            avatar={
                                <Radio checked={monthly} />
                            }
                            title={
                                <>
                                    <Typography variant="h5">Monthly</Typography>
                                </>
                            }
                            action={
                                <Typography variant="subtitle">$14.99 / Month</Typography>
                            }
                        />
                    </Card>
                    <Card onClick={handleRadioChange} elevation={annual ? 10 : 3} sx={{ marginBottom: "16px", width: "100%" }}>
                        <CardHeader
                            avatar={
                                <Radio checked={annual} />
                            }
                            title={
                                <>
                                    <Typography variant="h5">Annual</Typography>
                                </>
                            }
                            action={
                                <Typography variant="subtitle">$150 / Year</Typography>
                            }
                        />
                    </Card>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
                    <Button onClick={handleCheckout} sx={{ width: "80%" }} variant="contained">Checkout</Button>
                </Box>
            </>
        )
    }

    const renderTwaMessage = () => {
        return (
            <>
                <Box sx={{ display: "flex", width: "100%", flexWrap: "wrap", marginTop: "16px" }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ textAlign: "center" }}>Please visit our website to subscribe to Glyph!</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </>
        )
    }


    return (
        <LayoutWithNav>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Card sx={{ width: "90%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CardMedia
                            image={"/glyph-avatar.png"}
                            alt={"Glyph"}
                            component="img"
                            sx={{ width: 150, height: 150 }}
                        />
                    </Box>
                    <CardContent sx={{ flexWrap: "wrap", display: "flex", justifyContent: 'center' }}>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: 'center' }}>
                            <Typography variant="h4">
                                Subscription
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", display: "flex", justifyContent: 'center' }}>
                            <Typography variant="body2">
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <UploadFile />
                                        </ListItemIcon>
                                        <ListItemText>Unlimited File Uploads</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <SmartToy />
                                        </ListItemIcon>
                                        <ListItemText>Unlimited Bots</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <ChatBubble />
                                        </ListItemIcon>
                                        <ListItemText>750 Monthly Messages</ListItemText>
                                    </ListItem>
                                </List>
                            </Typography>
                        </Box>
                        {inTwa ? renderTwaMessage() : renderCheckout()}
                    </CardContent>
                </Card>
            </Box>
        </LayoutWithNav>
    )
}