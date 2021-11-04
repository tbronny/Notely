import { CircularProgress } from "@mui/material"
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Redirect } from "react-router-dom"
import ApplicationViews from "./components/ApplicationViews"
import Login from "./components/Login"
import Navigation from "./components/Navigation"
import { onLoginStatusChange } from "./modules/authManager"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null)

    useEffect(() => {
        onLoginStatusChange(setIsLoggedIn)
    }, [])

    if (isLoggedIn === null) {
        return <CircularProgress />
    }

    return (
        <>
            <Router>
                {/* {isLoggedIn ? ( */}
                <Navigation
                    // setIsLoggedIn={setIsLoggedIn}
                    isLoggedIn={isLoggedIn}
                />

                {/* ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} />
                )} */}
            </Router>
        </>
    )
}

export default App
