import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import App from "../Notely"
import Login from "./Login"
import NoteByMonth from "./Notes/NoteByMonth"
import NoteForm from "./Notes/NoteForm"
import NoteList from "./Notes/NoteList"
import TodaysNotes from "./Notes/TodaysNotes"
import Register from "./Register"
import TagForm from "./Tags/TagForm"
import TagList from "./Tags/TagList"

export default function ApplicationViews({ isLoggedIn }) {
    return (
        <main>
            <Switch>
                <Route path="/" exact>
                    {isLoggedIn ? <NoteList /> : <Redirect to="/login" />}
                </Route>
                <Route path="/" exact>
                    <NoteList />
                </Route>
                <Route path="/GetByMonth" exact>
                    <NoteByMonth />
                </Route>
                <Route path="/GetToday" exact>
                    <TodaysNotes />
                </Route>
                <Route path="/addNote" exact>
                    <NoteForm />
                </Route>
                <Route path="/note/edit/:id" exact>
                    <NoteForm />
                </Route>
                <Route path="/manageTags" exact>
                    <TagList />
                </Route>
                <Route path="/addTag" exact>
                    <TagForm />
                </Route>
                <Route path="/tag/edit/:id" exact>
                    <TagForm />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
            </Switch>
        </main>
    )
}
