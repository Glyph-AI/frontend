import Layout from "@/components/utility/layout";
import LayoutWithNav from "@/components/utility/layout_with_nav";
import { genericRequest, getRequest } from "@/components/utility/request_helper";
import { ConversationHeader } from "@chatscope/chat-ui-kit-react";
import { Box, Card, CardActions, CardContent, CardHeader, CssBaseline, IconButton, Paper, ThemeProvider, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Edit, Preview } from "@mui/icons-material";
import { theme, darkTheme } from '../../components/utility/theme.jsx'


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
    const [content, setContent] = useState("")
    const [editorState, setEditorState] = useState("edit")
    const router = useRouter()
    const { id } = router.query

    const getNote = () => {
        getRequest(`/texts/${id}`, (data) => {
            setNote(data)
            setContent(data.content)
        })
    }

    const embedNote = () => {
        genericRequest(`/texts/${id}/embed`, "POST", null, (data, status) => {
            if (status !== 200) {
                console.log("Embed error")
            }
        })
    }

    const saveNote = () => {
        if (id !== undefined) {
            if (content !== note.content) {
                const update = {
                    name: note.name,
                    content: content,
                    text_type: 'note'
                }
                genericRequest(`/texts/${id}`, "PATCH", JSON.stringify(update), (data, status) => {
                    if (status !== 200) {
                        console.log("Save error")
                    } else {
                        setNote(data)
                    }

                })
            }
        }
    }

    useEffect(() => {
        getNote()
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

    const changeEditorState = () => {
        if (editorState === "edit") {
            setEditorState("preview")
        } else {
            setEditorState("edit")
        }
    }

    return (
        <LayoutWithNav>
            <Box sx={{ height: "100%", padding: "16px 8px 8px 8px", display: "flex" }}>
                <Card sx={{ height: "90%", width: "100%" }}>
                    <CardContent sx={{ height: "100%" }}>
                        <Box sx={{ marginBottom: "8px" }}>
                            <Typography variant="h5">{note.name}</Typography>
                            {/* <Typography variant="body2">{(Date.parse(note.created_at)).toLocaleString("en-US")}</Typography> */}
                        </Box>
                        <Box sx={{ height: "90%" }}>
                            <MDEditor
                                height="100%"
                                value={content}
                                onChange={(val) => { setContent(val) }}
                                commands={[]}
                                extraCommands={[]}
                                theme="dark"
                                preview={editorState}
                                eDragbar={false}
                                hideToolbar
                            />
                        </Box>
                        <Box>
                            <IconButton sx={{ float: "right" }} onClick={changeEditorState} size="large">
                                {editorState === "edit" ? <Preview fontSize="large" /> : <Edit fontSize="large" />}
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </LayoutWithNav>
    )
}