import { ChatBubble, SmartToy, UploadFile } from "@mui/icons-material"
import { Box, Button, Card, CardContent, CardHeader, CardMedia, List, ListItem, ListItemIcon, ListItemText, Radio, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { genericRequest, getRequest } from "../utility/request_helper"


const env = process.env.NEXT_PUBLIC_ENVIRONMENT

export default function SubscriptionContainer({ }) {
    const [monthly, setMonthly] = useState(true)
    const [annual, setAnnual] = useState(false)
    const [gpItemDetails, setGpItemDetails] = useState(null)
    const [gpPrice, setGpPrice] = useState(0.00)
    const [inTwa, setInTwa] = useState(false)
    const [inGoogle, setInGoogle] = useState(false)
    const router = useRouter()

    const handleRadioChange = () => {
        setMonthly(!monthly)
        setAnnual(!annual)
    }

    useEffect(() => {
        if (window && 'getDigitalGoodsService' in window) {
            console.log("Found Digital Goods Service. Attempting to load")
            try {
                window.getDigitalGoodsService('https://play.google.com/billing').then(
                    (service) => {
                        service.getDetails(['glyph']).then(
                            (details) => {
                                setGpItemDetails(details)
                                setGpPrice(details[0].price.value)
                                setInTwa(true)
                                setInGoogle(true)
                            }
                        )
                    }
                )
            } catch (er) {
                console.log("Google Play Billing Unavailable")
                console.log(er)
            }

        }

        if (env === "ios") {
            setInTwa(true)
        }
    }, [])

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

    const formatCurrency = (value) => {
        if (gpItemDetails !== undefined) {
            const localePrice = new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: "USD",
            }).format(value);

            return localePrice
        }

        return 0.00

    }

    const renderPlatformCheckout = () => {
        if (inGoogle && gpItemDetails) {
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
                                    <Typography variant="subtitle">{formatCurrency(gpPrice)} / Month</Typography>
                                }
                            />
                        </Card>
                    </Box>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
                        <Button onClick={handleGoogleCheckout} sx={{ width: "80%" }} variant="contained">Subscribe with Google</Button>
                    </Box>
                </>
            )
        } else if (env === 'ios') {
            return renderTwaMessage()
        }
        // return (<CircularProgress/>)
        return renderCheckout()

    }

    const handleGoogleCheckout = () => {
        const paymentMethodData = [
            {
                supportedMethods: 'https://play.google.com/billing',
                data: {
                    sku: "glyph",
                },
            },
        ];

        const request = new PaymentRequest(paymentMethodData);
        request.show().then((paymentResponse) => {
            const { purchaseToken } = paymentResponse.details;

            let paymentComplete;
            genericRequest("/google-verification", "POST", JSON.stringify({ googleToken: purchaseToken }), (resp) => {
                if (resp.success) {
                    paymentComplete = paymentResponse.complete('success').then(() => {
                        router.push("/profile")
                    });
                } else {
                    paymentComplete = paymentResponse.complete('fail').then(() => {
                        router.push("/profile")
                    });;
                }
            }, { "Content-Type": "application/json" })
        });
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
                                <Typography variant="subtitle">$4.99 / Month</Typography>
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Card elevation={0} sx={{ width: "90%" }}>
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
                        <Typography component="span" variant="body2">
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <UploadFile />
                                    </ListItemIcon>
                                    <ListItemText>100 Files & Notes</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <SmartToy />
                                    </ListItemIcon>
                                    <ListItemText>10 Bots</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ChatBubble />
                                    </ListItemIcon>
                                    <ListItemText>200 Monthly Messages</ListItemText>
                                </ListItem>
                            </List>
                        </Typography>
                    </Box>
                    {renderPlatformCheckout()}
                </CardContent>
            </Card>
        </Box>
    )
}

