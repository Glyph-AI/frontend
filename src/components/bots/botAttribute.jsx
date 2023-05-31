import { TableRow, TableCell, Checkbox } from "@mui/material";

export default function BotAttribute({ valueId, name, value, onChange }) {
    const tableValue = () => {
        if (typeof (value) === 'boolean') {
            return (
                <TableCell sx={{ fontSize: 18 }} align="right">
                    <Checkbox id={valueId} checked={value} onChange={onChange} />
                </TableCell>
            )
        } else {
            return (<TableCell id={valueId} sx={{ fontSize: 18 }} align="right">{value}</TableCell>)
        }
    }
    return (
        <TableRow>
            <TableCell sx={{ fontSize: 18 }} component="th" scope="row">
                {name}
            </TableCell>
            {tableValue()}
        </TableRow>
    )
}