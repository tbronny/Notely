import {
    Button,
    Dialog,
    FormControl,
    Grid,
    Input,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import {
    addNote,
    getNoteById,
    updateNote,
    addTagToNote,
} from "../../modules/noteManager"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import parse from "html-react-parser"
import TagIcon from "@mui/icons-material/Tag"
import { getTags } from "../../modules/tagManager"

export default function NoteForm() {
    const history = useHistory()
    const [note, setNote] = useState({})
    const [tags, setTags] = useState([])
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [dialog, setDialog] = useState(false)
    const params = useParams()
    const noteId = params.id

    useEffect(() => {
        if (noteId) {
            getNoteById(noteId).then((n) => {
                setNote(n)
                setIsLoading(false)
            })
        }
        getTags().then((tags) => setTags(tags))
    }, [])

    const handleInputChange = (e) => {
        const noteCopy = { ...note }
        noteCopy[e.target.id] = e.target.value

        if (noteCopy.content.includes("#")) {
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

    const handleTagSave = (tagId) => {
        addTagToNote({
            noteId: noteId,
            tagId: tagId,
        }).then(() => handleDialogClose())
    }

    console.log(note.id)

    const handleSave = (e) => {
        e.preventDefault()
        if (noteId) {
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
                {tags.map((tag) => (
                    <List>
                        <ListItem button onClick={() => handleTagSave(tag.id)}>
                            <ListItemIcon>
                                <TagIcon />
                            </ListItemIcon>
                            <ListItemText primary={tag.name} />
                        </ListItem>
                    </List>
                ))}
                <Button className="dialog-button" onClick={handleDialogClose}>
                    Close
                </Button>
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
