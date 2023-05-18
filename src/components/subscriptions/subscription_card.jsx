import { ChatBubble, SmartToy, UploadFile } from "@mui/icons-material";
import { Card, CardMedia, Box, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Radio, CardHeader, Button } from "@mui/material";
import { useState } from "react";
import { getRequest } from "../utility/request_helper";

export default function SubscriptionCard({info, name}) {
    const [monthly, setMonthly] = useState(true)
    const [annual, setAnnual] = useState(false)

    const handleRadioChange = () => {
        setMonthly(!monthly)
        setAnnual(!annual)
    }

    const handleCheckout = (type) => {
        if (monthly) {
            const url = `/subscriptions/checkout-session?bill_cycle=${name}_monthly`
            getRequest(url, (data) => {
                window.location.href = data.url
            })
        } else {
            const url = `/subscriptions/checkout-session?bill_cycle=${name}_annually`
            getRequest(url, (data) => {
                window.location.href = data.url
            })
        }
    }


    return (
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
                        Glyph {name}
                    </Typography>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: 'center' }}>
                    <Typography variant="body2">
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <UploadFile />
                                </ListItemIcon>
                                <ListItemText>{info.files === -1 ? "Unlimited": info.files} Files & Notes</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <SmartToy />
                                </ListItemIcon>
                                <ListItemText>{info.bots === -1 ? "Unlimited": info.bots} Bots</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ChatBubble />
                                </ListItemIcon>
                                <ListItemText>{info.messages === -1 ? "Unlimited": info.messages} Monthly Messages</ListItemText>
                            </ListItem>
                        </List>
                    </Typography>
                </Box>
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
                                <Typography variant="subtitle">${info.monthly} / Month</Typography>
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
                                <Typography variant="subtitle">${info.annually} / Year</Typography>
                            }
                        />
                    </Card>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
                    <Button onClick={() => { handleCheckout("lite") }} sx={{ width: "80%" }} variant="contained">Checkout</Button>
                </Box>
            </CardContent>
        </Card>
    )
}