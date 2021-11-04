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
    return getToken().then((token) => {
        return fetch(`${_apiUrl}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json())
    })
}

export const addTag = (tag) => {
    return getToken().then((token) => {
        return fetch(_apiUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tag),
        }).then(getTags())
    })
}

export const deleteTag = (id) => {
    return fetch(`${_apiUrl}/${id}`, {
        method: "DELETE",
    })
}

export const updateTag = (tag) => {
    return getToken()
        .then((token) => {
            return fetch(_apiUrl, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tag),
            })
        })
        .then(getTags())
}
