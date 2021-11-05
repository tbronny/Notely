import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getAllNotes } from "../../modules/noteManager"
import { useHistory } from "react-router"
import FloatingActionButton from "../FloatingActionButton"
import { Container, Grid } from "@mui/material"
import { deleteNote } from "../../modules/noteManager"
import Masonry from "react-masonry-css"

export default function NoteList() {
    const [notes, setNotes] = useState([])

    const history = useHistory()

    const getNotes = () => {
        getAllNotes().then((notes) => setNotes(notes))
    }

    const handleDelete = (noteId) => {
        if (
            window.confirm(
                `Are you sure you want to delete? Press OK to confirm.`
            )
        ) {
            deleteNote(noteId).then(getNotes)
        }
    }

    useEffect(() => {
        getNotes()
    }, [])

    const breakpoints = {
        default: 3,
        1100: 2,
        700: 1,
    }

    return (
        <Container>
            <Masonry
                breakpointCols={breakpoints}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {notes.map((n) => (
                    <div key={n.id}>
                        <Note note={n} handleDelete={handleDelete} />
                    </div>
                ))}
            </Masonry>
            {FloatingActionButton()}
        </Container>
    )
}
