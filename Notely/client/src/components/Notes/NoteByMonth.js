import React, { useEffect, useState } from "react"
import Note from "./Note"
import FloatingActionButton from "../FloatingActionButton"
import { Container } from "@mui/material"
import { deleteNote } from "../../modules/noteManager"
import Masonry from "react-masonry-css"
import NoteSearch from "./NoteSearch"
import { getNotesByRange } from "../../modules/noteManager"

export default function NoteByMonth() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getNotesByRange().then((notes) => setNotes(notes))
    }, [])

    const handleDelete = (noteId) => {
        if (
            window.confirm(
                `Are you sure you want to delete? Press OK to confirm.`
            )
        ) {
            deleteNote(noteId).then(
                getNotesByRange().then((notes) => setNotes(notes))
            )
        }
    }

    const breakpoints = {
        default: 3,
        1100: 2,
        700: 1,
    }

    const ConditionalRender = () => {
        if (notes.length < 1) {
            return (
                <div className="message">
                    <p>
                        You haven't made any changes to notes in the last 30
                        days.
                    </p>
                </div>
            )
        } else {
            return (
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
            )
        }
    }

    return (
        <div>
            <div variant="h5" noWrap component="div">
                <NoteSearch filteredNotes={setNotes} />
            </div>
            <Container sx={{ mt: 5 }}>
                {ConditionalRender()}
                {FloatingActionButton()}
            </Container>
        </div>
    )
}
