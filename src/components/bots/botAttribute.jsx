import { TableRow, TableCell } from "@mui/material";

export default function BotAttribute({ name, value }) {
    return (
        <TableRow>
            <TableCell sx={{ fontSize: 18 }} component="th" scope="row">
                {name}
            </TableCell>
            <TableCell sx={{ fontSize: 18 }} align="right">{value}</TableCell>
        </TableRow>
    )
}