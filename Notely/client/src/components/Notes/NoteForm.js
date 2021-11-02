import {
    Button,
    Dialog,
    FormControl,
    Grid,
    Input,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    TextField,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { addNote, getNoteById, updateNote } from "../../modules/noteManager"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import parse from "html-react-parser"

export default function NoteForm() {
    const history = useHistory()
    const [note, setNote] = useState({})
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [dialog, setDialog] = useState(false)
    const params = useParams()

    useEffect(() => {
        if (params.id) {
            getNoteById(params.id).then((n) => {
                setNote(n)
                setIsLoading(false)
            })
        }
    }, [])

    const handleInputChange = (e) => {
        const noteCopy = { ...note }
        noteCopy[e.target.id] = e.target.value

        if (noteCopy.content === "#") {
            setDialog(true)
        }

        setNote(noteCopy)
    }

    const handleDialogClose = () => {
        setDialog(false)
    }

    // const editorInputChange = (event, editor) => {
    //     const data = editor.getData()
    //     setNote(data)
    //     const noteCopy = { ...note.content }
    //     noteCopy[event.target.id] = event.target.value
    //     setNote(noteCopy)
    // }

    const handleSave = (e) => {
        e.preventDefault()
        if (params.id) {
            setIsLoading(true)
            updateNote(note).then(() => {
                history.push("/")
            })
        } else {
            addNote(note).then(() => {
                history.push("/")
            })
        }
    }

    return (
        <Grid>
            <Dialog className="privateDialog" open={dialog}>
                <List>
                    <ListItem button>
                        <ListItemText primary="Groceries" />
                    </ListItem>
                    <ListItem autoFocus button>
                        <ListItemText primary="Personal" />
                    </ListItem>
                    <Button
                        className="dialog-button"
                        onClick={handleDialogClose}
                    >
                        Close
                    </Button>
                </List>
            </Dialog>
            <TextField
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                value={note.title}
                onChange={handleInputChange}
            />
            <TextField
                type="date"
                name="publishDateTime"
                id="publishDateTime"
                valid={note.publishDateTime}
                onChange={handleInputChange}
            />
            <FormControl fullWidth>
                <TextField
                    rows={20}
                    multiline
                    type="text"
                    name="content"
                    id="content"
                    placeholder="Start writing..."
                    value={note.content}
                    onChange={handleInputChange}
                />
            </FormControl>
            {/* <CKEditor
                editor={ClassicEditor}
                id="content"
                data={text}
                value={note.content}
                onChange={editorInputChange}
            /> */}
            <Button className="btn btn-primary" onClick={handleSave}>
                Submit
            </Button>
        </Grid>
    )
}
