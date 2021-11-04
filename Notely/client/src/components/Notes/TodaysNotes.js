import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getTodaysNotes } from "../../modules/noteManager"
import { useHistory } from "react-router"
import FloatingActionButton from "../FloatingActionButton"

export default function TodaysNotes() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getTodaysNotes().then((notes) => setNotes(notes))
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
