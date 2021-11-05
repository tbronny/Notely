import React from "react"
import { search } from "../../modules/noteManager"

const NoteSearch = ({ filteredNotes }) => {
    return (
        <>
            Note search:{" "}
            <input
                type="text"
                className="input--wide"
                onKeyUp={(event) =>
                    search(event.target.value).then((terms) => {
                        filteredNotes(terms)
                    })
                }
                placeholder="Search for a note... "
            />
        </>
    )
}

export default NoteSearch
