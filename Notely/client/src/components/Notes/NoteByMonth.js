import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getNotesByRange } from "../../modules/noteManager"
import FloatingActionButton from "../FloatingActionButton"

export default function NoteByMonth() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getNotesByRange().then((notes) => setNotes(notes))
    }, [])

    return (
        <section>
            {notes.map((n) => (
                <Note key={n.id} note={n} />
            ))}
            {FloatingActionButton()}
        </section>
    )
}
