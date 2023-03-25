import {Menu, MenuItem, Divider} from '@mui/material';
import { useRouter } from 'next/router';

export default function DropdownMenu({anchor, handleMenuClose, open = false}) {
    const router = useRouter()
    return (
        <Menu
            id="basic-menu"
            anchorEl={anchor}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={() => {router.push("/settings")}}>Profile</MenuItem>
            <Divider/>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
    )
}