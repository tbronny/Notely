import { Button, Card, CardContent } from "@mui/material"
import React from "react"
import { Link, useHistory } from "react-router-dom"
import { deleteNote } from "../../modules/noteManager"

export default function Note({ note }) {
    const history = useHistory()

    const handleDelete = (evt) => {
        evt.preventDefault()
        if (
            window.confirm(
                `Are you sure you want to delete "${note.title}"? Press OK to confirm.`
            )
        ) {
            deleteNote(note.id).then(window.location.reload())
        } else {
            history.push("/")
        }
    }

    return (
        <Card className="m-4">
            <CardContent>
                <strong>
                    <Link to={`/note/edit/${note.id}`}>{note.title}</Link>
                </strong>
                <p>{note.content}</p>
                <p>{note.createDateTime}</p>
                <p>
                    {note.tags?.map((t) => {
                        return <p>{t.name}</p>
                    })}
                </p>
                <div className="font-weight-bold">
                    {note.userProfile.firstName}
                </div>
                <Button
                    className="btn btn-danger float-right"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </CardContent>
        </Card>
    )
}
