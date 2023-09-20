import { Dialog, DialogContent } from "@mui/material";
import SubscriptionContainer from "./subscriptionContainer";

export default function SubscriptionsDialog({ open, handleClose }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <SubscriptionContainer />
            </DialogContent>
        </Dialog>
    )
}