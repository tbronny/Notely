import React, { useEffect, useState } from "react"
import Note from "./Note"
import { getAllUntagged, getNotesByRange } from "../../modules/noteManager"
import { useHistory, useParams } from "react-router"
import FloatingActionButton from "../FloatingActionButton"

export default function UntaggedNotes() {
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getAllUntagged().then((notes) => setNotes(notes))
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
