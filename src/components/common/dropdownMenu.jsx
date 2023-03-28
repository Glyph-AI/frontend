import {Menu, MenuItem, Divider} from '@mui/material';
import { useRouter } from 'next/router';
import { genericRequest } from '../utility/request_helper';

export default function DropdownMenu({anchor, handleMenuClose, open = false}) {
    const router = useRouter()

    const handleLogout = () => {
        genericRequest("/logout", "POST", null, () => {
            router.push("/login")
        })
    }
    return (
        <Menu
            id="basic-menu"
            anchorEl={anchor}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            sx={{width: "200px"}}
        >
            <MenuItem onClick={() => {router.push("/settings")}}>Settings</MenuItem>
            <Divider/>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    )
}