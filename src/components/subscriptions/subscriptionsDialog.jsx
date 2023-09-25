import { Close } from "@mui/icons-material";
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import SubscriptionContainer from "./subscriptionContainer";

export default function SubscriptionsDialog({ open, handleClose }) {
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))
    return (
        <Dialog open={open} onClose={handleClose} fullScreen={smallScreen}>
            {
                smallScreen && (
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <Close />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Subscription
                            </Typography>
                        </Toolbar>
                    </AppBar>
                )
            }
            <DialogContent>
                <SubscriptionContainer />
            </DialogContent>
        </Dialog>
    )
}