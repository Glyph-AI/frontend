import { ChevronRight, Note } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ReactMarkdown from 'react-markdown'

export default function NoteListItem({ note }) {
    const router = useRouter()

    return (
        <Card className="note-item" sx={{ maxHeight: "30%" }} elevation={5} onClick={() => { router.push(`/notes/${note.id}`) }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {note.name}
                </Typography>
                <Typography variant="body2">
                    <ReactMarkdown>{note && note.content.slice(0, 50)}</ReactMarkdown>
                </Typography>
            </CardContent>
        </Card>
    )
}