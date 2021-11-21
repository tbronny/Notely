import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import App from "../Notely"
import Login from "./Login"
import NoteByMonth from "./Notes/NoteByMonth"
import NoteByTagId from "./Notes/NoteByTagId"
import NoteDetails from "./Notes/NoteDetails"
import NoteForm from "./Notes/NoteForm"
import NoteList from "./Notes/NoteList"
import TodaysNotes from "./Notes/TodaysNotes"
import UntaggedNotes from "./Notes/UntaggedNotes"
import Register from "./Register"
import TagForm from "./Tags/TagForm"
import TagList from "./Tags/TagList"

export default function ApplicationViews() {
    return (
        <main>
            <Switch>
                <Route path="/" exact>
                    <NoteList />
                </Route>
                <Route path="/GetByMonth" exact>
                    <NoteByMonth />
                </Route>
                <Route path="/GetToday" exact>
                    <TodaysNotes />
                </Route>
                <Route path="/GetAllUntagged" exact>
                    <UntaggedNotes />
                </Route>
                <Route path="/GetByTag/:tagId" exact>
                    <NoteByTagId />
                </Route>
                <Route path="/note/:id" exact>
                    <NoteDetails />
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
