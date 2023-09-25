import { ListItem, ListItemButton } from "@mui/material";

export function StyledListItem({ children, inContext, sx, isButton, ...props }) {
    const Component = isButton ? ListItemButton : ListItem
    return (
        <Component
            sx={
                {
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
                    },
                    ...sx
                }
            }
            {...props}
        >
            {children}
        </Component>
    )
}