import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./Notely"
import firebase from "firebase/app"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
}
firebase.initializeApp(firebaseConfig)

ReactDOM.render(<App />, document.getElementById("root"))
