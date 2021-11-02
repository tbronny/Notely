import React, { useEffect, useState } from "react"
import Tag from "./Tag"
import { getTags } from "../../modules/tagManager"
import { useHistory } from "react-router"
import FloatingActionButton from "../FloatingActionButton"

export default function TagList() {
    const [tags, setTags] = useState([])

    const history = useHistory()

    useEffect(() => {
        getTags().then((tags) => setTags(tags))
    }, [])

    return (
        <section>
            {tags.map((t) => (
                <Tag key={t.id} tag={t} />
            ))}
            {FloatingActionButton()}
        </section>
    )
}
