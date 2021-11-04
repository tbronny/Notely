import React, { useEffect, useState } from "react"
import Tag from "./Tag"
import { getTags } from "../../modules/tagManager"
import { useHistory } from "react-router"
import FloatingActionButton from "../FloatingActionButton"
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import TagIcon from "@mui/icons-material/Tag"

export default function TagSideBar() {
    const [tags, setTags] = useState([])

    const history = useHistory()

    useEffect(() => {
        getTags().then((tags) => setTags(tags))
    }, [])

    return (
        <List>
            {tags.map((tag) => (
                <ListItem button key={tag.id}>
                    <ListItemIcon>
                        <TagIcon
                            onClick={() =>
                                (window.location.href = `/GetByTag/${tag.id}`)
                            }
                        />
                    </ListItemIcon>
                    <ListItemText primary={tag.name} />
                </ListItem>
            ))}
        </List>
    )
}
