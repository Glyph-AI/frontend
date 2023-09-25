import NoteHeader from "../utility/headers/noteHeader";
import NoteEditor from "./noteEditor";

export default function NotesContainer({ note, setNote, desktopMode, setAvailableTexts }) {
    return (
        <div style={{ position: "relative", height: "100%" }}>
            <NoteHeader note={note} setNote={setNote} setAvailableTexts={setAvailableTexts} desktopMode={desktopMode} />
            <NoteEditor note={note} setNote={setNote} desktopMode={desktopMode} />
        </div>
    )
}