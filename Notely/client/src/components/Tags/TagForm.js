import { Button, FormControl, Grid, InputLabel, TextField } from "@mui/material"
import React, { useState } from "react"
import { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { addTag, getTagById, updateTag } from "../../modules/tagManager"

export default function TagForm() {
    const history = useHistory()
    const [tag, setTag] = useState({
        name: "",
    })

    const params = useParams()

    const tagId = params.id

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (tagId) {
            getTagById(tagId).then((event) => {
                setTag(event)
                setIsLoading(false)
            })
        } else {
            setIsLoading(false)
        }
    }, [])

    const handleInputChange = (e) => {
        const value = e.target.value
        const key = e.target.id

        const tagCopy = { ...tag }

        tagCopy[key] = value
        setTag(tagCopy)
    }

    const handleSave = (e) => {
        e.preventDefault()

        if (tagId) {
            setIsLoading(true)
            updateTag({
                id: parseInt(tagId),
                name: tag.name,
            }).then(() => history.push("/tag"))
        } else {
            addTag({
                name: tag.name,
            }).then(() => history.push("/tag"))
        }
    }

    return (
        <Grid>
            <FormControl>
                <TextField
                    id="name"
                    type="text"
                    value={tag.name}
                    name="name"
                    placeholder="Tag Name"
                    onChange={handleInputChange}
                />
            </FormControl>
            <Button
                className="btn btn-primary"
                disabled={isLoading}
                onClick={handleSave}
            >
                {tagId ? "Save Tag" : "Add Tag"}
            </Button>
        </Grid>
    )
}
