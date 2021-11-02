import { Button, Card, CardContent } from "@mui/material"
import React from "react"
import { Link, useHistory } from "react-router-dom"
import { deleteTag } from "../../modules/tagManager"

export default function Tag({ tag }) {
    const history = useHistory()

    const handleDelete = (evt) => {
        evt.preventDefault()
        if (
            window.confirm(
                `Are you sure you want to delete "${tag.name}"? Press OK to confirm.`
            )
        ) {
            deleteTag(tag.id).then(window.location.reload())
        } else {
            history.push("/tag")
        }
    }

    return (
        <Card className="m-4">
            <CardContent>
                <strong>
                    <Link to={`/tag/edit/${tag.id}`}>{tag.name}</Link>
                </strong>
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
