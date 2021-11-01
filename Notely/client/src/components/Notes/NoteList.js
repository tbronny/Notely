import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getAllNotes } from "../../modules/noteManager"
import { useHistory } from "react-router"
import FloatingActionButton from "../FloatingActionButton"

export default function NoteList() {
    const [notes, setNotes] = useState([])

    const history = useHistory()

    const getNotes = () => {
        return getAllNotes().then((notes) => setNotes(notes))
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
