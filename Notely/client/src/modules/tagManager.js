import { getToken } from "./authManager"

const _apiUrl = "/api/tag"

export const getTags = () => {
    return getToken().then((token) => {
        return fetch(_apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json())
    })
}

export const getTagById = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((res) => res.json())
}

export const addTag = (tag) => {
    return fetch(_apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tag),
    }).then(getTags())
}

export const deleteTag = (id) => {
    return fetch(`${_apiUrl}/${id}`, {
        method: "DELETE",
    })
}

export const updateTag = (tag) => {
    return fetch(_apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tag),
    }).then(getTags())
}
