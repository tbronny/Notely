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

        setNote(noteCopy)
    }

    const handleDialogOpen = () => {
        setDialog(true)
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialog(false)
    }

    const handleDialogClose = () => {
        setDialog(false)
    }

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
            updateNote({
                id: parseInt(noteId),
                title: note.title,
                content: parse(note.content),
                createDateTime: note.createDateTime,
                publishDateTime: note.publishDateTime,
                userId: note.userId,
            }).then(() => {
                history.push("/")
            })
        } else {
            addNote({
                title: note.title,
                content: note.content,
                createDateTime: note.createDateTime,
                publishDateTime: note.publishDateTime,
                userId: note.userId,
            }).then(() => {
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
                Existing Tags:
                {note.tags?.map((tag) => (
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
                <Button className="dialog-button" onClick={handleDialogClose}>
                    Close
                </Button>
            </Dialog>
            <Dialog className="privateDialog" open={deleteDialog}>
                {note.tags?.map((tag) => (
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
            <FormControl fullWidth>
                <TextField
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={note.title}
                    onChange={handleInputChange}
                />
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
            <Button className="btn btn-primary" onClick={handleSave}>
                {noteId ? "Update" : "Add Note"}
            </Button>
            {noteId && (
                <>
                    <Button
                        className="btn btn-primary"
                        onClick={handleOpenDeleteTag}
                    >
                        Remove Tag
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={handleDialogOpen}
                    >
                        Add Tag
                    </Button>
                </>
            )}
        </Grid>
    )
}
