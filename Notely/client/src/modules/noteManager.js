import { getToken } from "./authManager"

const apiUrl = "/api/note"

export const getAllNotes = () => {
    return getToken().then((token) => {
        return fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("ERROR IN GETTING Notes")
            }
        })
    })
}

export const getAllUntagged = () => {
    return getToken().then((token) => {
        return fetch(apiUrl + "/GetAllUntagged", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("ERROR IN GETTING Notes")
            }
        })
    })
}

export const getAllNotesByTagId = (tagId) => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/GetByTag/${tagId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("ERROR IN GETTING Notes")
            }
        })
    })
}

export const getNotesByRange = () => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/GetByMonth`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("ERROR IN GETTING Notes")
            }
        })
    })
}

export const getTodaysNotes = () => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/GetToday`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("ERROR IN GETTING Notes")
            }
        })
    })
}

export const getNoteById = (id) => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error("ERROR GETTING NOTE BY ID")
            }
        })
    })
}

export const addTagToNote = (noteTag) => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/addTagToNote`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(noteTag),
        })
    })
}

export const addNote = (note) => {
    return getToken().then((token) => {
        return fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        })
    })
}

export const deleteNote = (id) => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
    })
}

export const updateNote = (note) => {
    return getToken().then((token) => {
        return fetch(`${apiUrl}/${note.id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        })
    })
}
