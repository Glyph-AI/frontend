import { ListItem, styled } from "@mui/material";

export const StyledListItem = styled(ListItem)(({ inContext }) => ({
    borderRadius: "8px",
    width: "100%",
    paddingLeft: "8px",
    "& .MuiListItemButton-root": {
        padding: "0"
    },
    "& .MuiListItemSecondaryAction-root": {
        right: inContext ? null : "0px",
        height: inContext ? null : "100%",
        paddingTop: inContext ? null : "8px",
        paddingRight: inContext ? null : "4px"
    }
}))