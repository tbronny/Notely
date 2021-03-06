import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Link } from "react-router-dom"
import { Switch, Route, Redirect } from "react-router-dom"
import ApplicationViews from "./ApplicationViews"
import { styled, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import MuiDrawer from "@mui/material/Drawer"
import MuiAppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import CssBaseline from "@mui/material/CssBaseline"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import InboxIcon from "@mui/icons-material/MoveToInbox"
import StickyNote2Icon from "@mui/icons-material/StickyNote2"
import TodayIcon from "@mui/icons-material/Today"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import DateRangeIcon from "@mui/icons-material/DateRange"
import AddIcon from "@mui/icons-material/Add"
import SettingsIcon from "@mui/icons-material/Settings"
import { login, logout } from "../modules/authManager"
import Login from "./Login"
import Register from "./Register"
import TagSideBar from "./Tags/TagSideBar"
import NoteSearch from "./Notes/NoteSearch"

const drawerWidth = 240

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
})

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}))

export default function Navigation({ isLoggedIn }) {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [notes, setNotes] = useState([])

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                {isLoggedIn && (
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: "36px",
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" noWrap component="div">
                            Notely
                        </Typography>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            style={{ cursor: "pointer" }}
                            onClick={logout}
                        >
                            Logout
                        </Typography>
                    </Toolbar>
                )}
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {isLoggedIn && (
                    <List>
                        <ListItem button key="Untagged">
                            <ListItemIcon>
                                <InboxIcon
                                    onClick={() =>
                                        (window.location.href =
                                            "/GetAllUntagged")
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText primary="Untagged" />
                        </ListItem>
                        <ListItem button key="today">
                            <ListItemIcon>
                                <TodayIcon
                                    onClick={() =>
                                        (window.location.href = "/GetToday")
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText primary="Today" />
                        </ListItem>
                        <ListItem button key="range">
                            <ListItemIcon>
                                <DateRangeIcon
                                    onClick={() =>
                                        (window.location.href = `/GetByMonth`)
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText primary="Last 30 Days" />
                        </ListItem>
                        <ListItem button key="trash">
                            <ListItemIcon>
                                <DeleteOutlineIcon
                                    onClick={() =>
                                        (window.location.href = "/deletedNotes")
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText primary="Trash" />
                        </ListItem>
                    </List>
                )}
                <Divider />
                {isLoggedIn && (
                    <List>
                        <ListItem button key="trash">
                            <ListItemIcon>
                                <StickyNote2Icon
                                    onClick={() => (window.location.href = "/")}
                                />
                            </ListItemIcon>
                            <ListItemText primary="All Notes" />
                        </ListItem>

                        <TagSideBar />
                        <Divider />
                        <ListItem button key="addTag">
                            <ListItemIcon>
                                <AddIcon
                                    onClick={() =>
                                        (window.location.href = "/addTag")
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText primary="Add Tag" />
                        </ListItem>
                        <ListItem button key="managageTag">
                            <ListItemIcon>
                                <SettingsIcon
                                    onClick={() =>
                                        (window.location.href = "/manageTags")
                                    }
                                />
                            </ListItemIcon>
                            <ListItemText primary="Manage Tags" />
                        </ListItem>
                    </List>
                )}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
                {isLoggedIn && (
                    <>
                        <DrawerHeader />
                        <ApplicationViews />
                    </>
                )}
                {!isLoggedIn && (
                    <>
                        <Switch>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/register">
                                <Register />
                            </Route>
                        </Switch>
                    </>
                )}
            </Box>
        </Box>
    )
}
