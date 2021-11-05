import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    IconButton,
    Typography,
} from "@mui/material"
import React from "react"
import { Link, useHistory } from "react-router-dom"
import { red } from "@mui/material/colors"
import parse from "html-react-parser"
import { DeleteOutlined } from "@mui/icons-material"

export default function Note({ note, handleDelete }) {
    const history = useHistory()

    return (
        <div>
            <Card elevation={1} className="noteCard">
                <CardHeader
                    action={
                        <IconButton
                            onClick={(event) => {
                                if (event.target !== event.currentTarget)
                                    return handleDelete(note.id)
                            }}
                        >
                            <DeleteOutlined sx={{ color: red[400] }} />
                        </IconButton>
                    }
                    title={note.title}
                    subheader={note.tags?.map((t) => {
                        return `#${t.name}  `
                    })}
                />
                <CardContent>
                    <Typography
                        varient="body2"
                        color="textSecondary"
                        onClick={(event) => {
                            if (event.target !== event.currentTarget)
                                return history.push(`/note/edit/${note.id}`)
                        }}
                    >
                        <p>{parse(note.content)}</p>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}
