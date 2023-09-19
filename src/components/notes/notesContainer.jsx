import NoteHeader from "../utility/headers/noteHeader";
import NoteEditor from "./noteEditor";

const dummy_note = {
    name: "Test Note",
    content: "Test test test test test"
}

export default function NotesContainer({ note, setNote, desktopMode }) {
    return (
        <div style={{ position: "relative", height: "100%" }}>
            <NoteHeader note={note} setNote={setNote} desktopMode={desktopMode} />
            <NoteEditor note={note} setNote={setNote} />
        </div>
    )
}