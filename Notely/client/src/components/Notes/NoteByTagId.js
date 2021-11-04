import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getAllNotesByTagId } from "../../modules/noteManager"
import FloatingActionButton from "../FloatingActionButton"
import { useParams } from "react-router"

export default function NoteByTagId() {
    const [notes, setNotes] = useState([])
    const { tagId } = useParams()

    useEffect(() => {
        getAllNotesByTagId(tagId).then((notes) => setNotes(notes))
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
