import SubscriptionCard from "@/components/subscriptions/subscription_card";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { getRequest } from "@/components/utility/request_helper";
import { ChatBubble, SmartToy, UploadFile } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, CardMedia, List, ListItem, ListItemIcon, ListItemText, Paper, Radio, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import Carousel from "react-material-ui-carousel";

export default function SubscriptionOptions() {
    const [tiers, setTiers] = useState({})
    useEffect(() => {
        getRequest("/tiers", (data) => {
            delete data["FREE"]
            setTiers(data)
        })
    }, [])
    return (
        <LayoutWithNav>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Carousel sx={{ width: "100%" }} animation="slide" autoPlay={false}>
                    
                        {
                            Object.keys(tiers).map((item) => {
                                return (
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <SubscriptionCard name={item} info={tiers[item]}/>
                                    </Box>
                                )
                            })
                        }
                </Carousel>
            </Box>
        </LayoutWithNav >
    )
}