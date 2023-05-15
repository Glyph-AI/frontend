import NewNoteModal from "@/components/notes/newNoteModal";
import NoteListItem from "@/components/notes/noteListItem";
import AdBanner from "@/components/utility/ad_banner";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { getRequest } from "@/components/utility/request_helper";
import { useUserContext } from "@/context/user";
import { ConversationHeader, Search } from "@chatscope/chat-ui-kit-react";
import { Add } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { Avatar, Box, Fab, List, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function NotesIndex() {
    const [notes, setNotes] = useState([])
    const [displayNotes, setDisplayNotes] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [user, setUser] = useState({})
    const [modalVisible, setModalVisible] = useState(false)

    const getUser = () => {
        getRequest("/profile", (data) => {
            setUser(data)
        })
    }

    const getNotes = () => {
        getRequest("/texts?text_type=note", (data) => {
            setNotes(data)
            setDisplayNotes(data)
        })
    }

    const handleModalClose = () => {
        setModalVisible(false)
        getNotes()
    }

    const searchFunction = (searchTerm, array) => {
        return array.filter(note => (note.name.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    const handleSearchValueChange = (newValue) => {
        setSearchValue(newValue)
        const newDisplayNotes = searchFunction(newValue, notes)
        setDisplayNotes(newDisplayNotes)
    }

    useEffect(() => {
        getNotes()
        getUser()
    }, [])

    return (
        <LayoutWithNav>
            <Box sx={{ padding: "8px", height: 60, display: "flex", marginBottom: "16px", alignContent: "center" }}>
                <Search placeholder="Search..." style={{ flex: 1, fontSize: 16 }} value={searchValue} onChange={handleSearchValueChange} />
                <Avatar
                    onMouseEnter={(e) => { e.target.style.cursor = "pointer" }}
                    sx={{ marginLeft: "16px", width: 40, height: 40 }}
                    alt={user.first_name}
                    src={user.profile_picture_location}
                    onClick={() => { router.push("/profile") }}
                />
            </Box>
            <Box sx={{ pr: "16px", pl: "16px" }}>
                <AdBanner style={{ zIndex: "1000", marginBottom: "8px" }} />
            </Box>
            <Box
                sx={{
                    padding: "8px",
                    width: "100%",
                    height: "95%",
                    overflowY: "scroll",
                    display: "flex",
                    boxSizing: "content-box",
                    justifyContent: "center"
                }}
            >
                <Masonry
                    columns={2}
                    spacing={2}
                    sx={{ minHeight: "90%" }}
                >
                    {
                        displayNotes && displayNotes.map((item, index) => (
                            <>
                                <NoteListItem note={item} />
                            </>
                        ))
                    }
                </Masonry>
            </Box>
            {
                Math.abs(user.files_left) > 0 && (
                    <Fab onClick={() => { setModalVisible(true) }} sx={{ position: 'absolute', bottom: 64, right: 16 }}>
                        <Add />
                    </Fab>
                )
            }

            <NewNoteModal open={modalVisible} handleClose={handleModalClose} />
        </LayoutWithNav>
    )
}