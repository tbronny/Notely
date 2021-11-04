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
    deleteTagFromNote,
} from "../../modules/noteManager"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import parse from "html-react-parser"
import TagIcon from "@mui/icons-material/Tag"
import { getTags } from "../../modules/tagManager"
import NoteByTagId from "./NoteByTagId"

export default function NoteForm() {
    const history = useHistory()
    const [note, setNote] = useState({})
    const [tags, setTags] = useState([])
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [dialog, setDialog] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
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

        if (noteId && noteCopy.content && noteCopy.content.includes("#")) {
            setDialog(true)
        }

        setNote(noteCopy)
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialog(false)
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
        if (noteId) {
            addTagToNote({
                noteId: noteId,
                tagId: tagId,
            }).then(() => handleDialogClose())
        }
    }

    const handleOpenDeleteTag = () => {
        setDeleteDialog(true)
    }

    const handleTagDelete = (noteId, tagId) => {
        deleteTagFromNote(noteId, tagId).then(() => handleDeleteDialogClose())
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
            <Dialog className="privateDialog" open={deleteDialog}>
                {tags.map((tag) => (
                    <List>
                        <ListItem
                            button
                            onClick={() => handleTagDelete(noteId, tag.id)}
                        >
                            <ListItemIcon>
                                <TagIcon />
                            </ListItemIcon>
                            <ListItemText primary={tag.name} />
                        </ListItem>
                    </List>
                ))}
                <Button
                    className="dialog-button"
                    onClick={handleDeleteDialogClose}
                >
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
                {noteId ? "Update" : "Add Note"}
            </Button>
            {noteId && (
                <Button
                    className="btn btn-primary"
                    onClick={handleOpenDeleteTag}
                >
                    Remove Tag
                </Button>
            )}
        </Grid>
    )
}
