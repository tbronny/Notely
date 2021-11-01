import React, { useEffect, useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import Navigation from "./components/Navigation"

import { onLoginStatusChange } from "./modules/authManager"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null)

    useEffect(() => {
        onLoginStatusChange(setIsLoggedIn)
    }, [])

    return (
        <Router>
            <Navigation isLoggedIn={isLoggedIn} />
        </Router>
    )
}

export default App
