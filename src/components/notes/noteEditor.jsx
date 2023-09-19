import { Box, TextField, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { embedText, saveText } from "../api/texts"

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function NoteEditor({ note, setNote, desktopMode }) {
    const [editorState, setEditorState] = useState("edit")
    const [shouldSave, setShouldSave] = useState(false)
    const router = useRouter()
    const theme = useTheme()

    const saveNote = () => {
        if (shouldSave) {
            const update = {
                name: note.name,
                content: note.content,
                text_type: "note"
            }

            saveText(note.id, update, (data, status) => {
                setNote(data)
                setShouldSave(false)
            })
        }
    }

    const embedNote = () => {
        embedText(note.id)
    }

    useEffect(() => {
        router.events.on('routeChangeStart', saveNote);
        router.events.on('routeChangeStart', embedNote);
        return () => {
            router.events.off('routeChangeStart', saveNote);
            router.events.off('routeChangeStart', embedNote);
        };
    }, [router])

    useInterval(() => {
        saveNote()
    }, 1000)

    const setContent = (val) => {
        setNote({ ...note, content: val })
        setShouldSave(true)
    }

    return (
        <Box sx={{ pt: 1, pb: 2, backgroundColor: theme.palette.background.secondary, height: "calc(100% - 56px)" }}>
            <TextField
                fullWidth
                multiline
                value={note.content}
                onChange={(e) => { setContent(e.target.value) }}
                maxRows={Infinity}
                sx={{
                    backgroundColor: theme.palette.background.secondary,
                    height: "100%",
                    overflowY: "scroll",
                    "-ms-overflow-style": "none",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        display: "none"
                    }
                }}
            />
        </Box>
    )
}