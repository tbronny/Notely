import React, { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { getTagById, addTag, updateTag } from "../../modules/tagManager"

const TagForm = () => {
    const [tag, setTag] = useState({
        name: "",
    })

    const tagId = useParams()

    if (tagId.id && tag.name === "") {
        getTagById(tagId.id).then((tag) => setTag(tag))
    }

    const handleInput = (event) => {
        const newTag = { ...tag }
        newTag[event.target.id] = event.target.value
        setTag(newTag)
    }

    const handleCreateTag = () => {
        addTag(tag).then(history.push("/"))
    }

    const handleClickUpdateTag = () => {
        updateTag(tag).then(history.push("/"))
    }

    const handleClickCancel = () => {
        history.push("/")
    }

    const history = useHistory()

    return (
        <container>
            <div className="tagForm">
                <h3>Add a Tag</h3>
                <div className="container-5">
                    <div className="form-group">
                        <label for="name">Name</label>
                        <input
                            type="name"
                            class="form-control"
                            id="name"
                            placeholder="name"
                            value={tag.name}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    {tagId.id ? (
                        <div>
                            <button
                                type="submit"
                                class="btn btn-primary mr-3"
                                onClick={(event) => {
                                    handleClickUpdateTag()
                                }}
                            >
                                Update
                            </button>

                            <button
                                type="cancel"
                                class="btn btn-primary mx-3"
                                onClick={(event) => {
                                    handleClickCancel()
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                type="submit"
                                class="btn btn-primary"
                                onClick={(event) => {
                                    handleCreateTag()
                                }}
                            >
                                Create
                            </button>
                            <button
                                type="cancel"
                                class="btn btn-primary mx-3"
                                onClick={(event) => {
                                    handleClickCancel()
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </container>
    )
}

export default TagForm
