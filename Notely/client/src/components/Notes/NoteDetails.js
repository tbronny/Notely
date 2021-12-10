import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import Note from "./Note"
import {
    deleteNote,
    getAllNotes,
    getAllNotesByTagId,
    getNoteById,
} from "../../modules/noteManager"
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    Typography,
} from "@mui/material"
import { red } from "@mui/material/colors"
import parse from "html-react-parser"
import { DeleteOutlined } from "@mui/icons-material"
import ReactMarkdown from "react-markdown"
import NoteList from "./NoteList"
import remarkGfm from "remark-gfm"

const NoteDetails = () => {
    const [note, setNote] = useState()
    const { id } = useParams()
    const history = useHistory()

    useEffect(() => {
        getNoteById(id).then(setNote)
    }, [])

    if (!note) {
        return null
    }

    return (
        <>
            <Container sx={{ mt: 5 }} className="container">
                <Card elevation={5}>
                    <CardHeader
                        title={note.title}
                        subheader={note.tags?.map((t) => {
                            return `#${t.name}  `
                        })}
                    />
                    <CardContent>
                        <Typography varient="body2" color="textSecondary">
                            {note.content.includes("youtube") ? (
                                <div>
                                    <iframe
                                        className="video"
                                        src={note.content}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div></div>
                            )}

                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {parse(note.content)}
                            </ReactMarkdown>
                        </Typography>
                    </CardContent>
                </Card>
                <Button onClick={() => history.push(`/note/edit/${note.id}`)}>
                    Edit
                </Button>
            </Container>
        </>
    )
}

export default NoteDetails
