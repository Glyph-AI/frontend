import { getTextById } from "@/components/api/texts";
import NotesContainer from "@/components/notes/notesContainer";
import LayoutWithNav from "@/components/utility/layouts/layout_with_nav";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

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

export default function NoteEdit() {
    const [note, setNote] = useState({})
    const [availableTexts, setAvailableTexts] = useState([])
    const [content, setContent] = useState("")
    const [editorState, setEditorState] = useState("edit")
    const router = useRouter()
    const { id } = router.query

    const getNote = () => {
        getTextById(id, (data) => {
            setNote(data)
            setContent(data.content)
        })
    }

    useEffect(() => {
        getNote()
    }, [])

    return (
        <LayoutWithNav>
            {
                Object.keys(note).length !== 0 && (
                    <NotesContainer note={note} setNote={setNote} desktopMode={false} setAvailableTexts={setAvailableTexts} />
                )
            }
        </LayoutWithNav>
    )
}