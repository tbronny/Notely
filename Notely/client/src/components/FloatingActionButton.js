import * as React from "react"
import Box from "@mui/material/Box"
import Fab from "@mui/material/Fab"
import EditIcon from "@mui/icons-material/Edit"
import { useHistory } from "react-router-dom"

export default function FloatingActionButton() {
    const history = useHistory()

    return (
        <Box
            sx={{ position: "fixed", bottom: "0", right: "0", padding: "2em" }}
        >
            <Fab
                color="primary"
                aria-label="edit"
                onClick={() => {
                    history.push("/addNote")
                }}
            >
                <EditIcon />
            </Fab>
        </Box>
    )
}
