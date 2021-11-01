import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getNotesByRange } from "../../modules/noteManager"
import { useHistory, useParams } from "react-router"
import FloatingActionButton from "../FloatingActionButton"

export default function NoteByMonth() {
    const [notes, setNotes] = useState([])

    const history = useHistory()

    const getNotes = () => {
        return getNotesByRange().then((notes) => setNotes(notes))
    }

    useEffect(() => {
        getNotes()
    }, [])

    console.log("notes", notes.title)

    return (
        <section>
            {notes.map((n) => (
                <Note key={n.id} note={n} />
            ))}
            {FloatingActionButton()}
        </section>
    )
}
