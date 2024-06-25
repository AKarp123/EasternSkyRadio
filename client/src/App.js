import "./App.css";
import { Route, Switch } from "react-router-dom";
import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
} from "@mui/material/styles";
import { CssBaseline, Alert, Snackbar } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import ErrorContext from "./providers/ErrorContext";
import Home from "./components/Home/Home";
import ShowPage from "./components/Shows/ShowPage";
import StarParticles from "./components/StarParticles";
import SetList from "./components/Shows/SetList";
import BlogPage from "./components/Blog/BlogPage";
import Login from "./components/Admin/Login";
import UserContext from "./providers/UserContext";
import AdminPage from "./components/Admin/AdminPage";
import NewShow from "./components/Admin/NewShow";
import EditSongs from "./components/Admin/EditSongs";
import EditShows from "./components/Admin/EditShows";

let darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#000000",
        },
    },
});

darkTheme = responsiveFontSizes(darkTheme);

function App() {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const displayError = (errorMessage, variant = "error") => {
        setError({ errorMessage, variant });
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {/* <StarParticles /> */}
            <ErrorContext.Provider value={displayError}>
                <UserContext.Provider value={{ user, setUser }}>
                    <div className="App">
                        {error && (
                            <Snackbar
                                open={error !== undefined && error !== null}
                                autoHideDuration={2000}
                                onClose={() => setError(null)}
                            >
                                <Alert
                                    severity={error.variant}
                                    onClose={() => setError(null)}
                                >
                                    {error.errorMessage}
                                </Alert>
                            </Snackbar>
                        )}
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route exact path="/shows">
                                <ShowPage />
                            </Route>
                            <Route exact path="/shows/:showId">
                                <SetList />
                            </Route>
                            <Route exact path="/blog">
                                <BlogPage />
                            </Route>
                            <Route exact path="/login">
                                <Login />
                            </Route>
                            <Route exact path="/admin">
                                <AdminPage />
                            </Route>
                            <Route exact path="/admin/newshow">
                                <NewShow />
                            </Route>
                            <Route exact path="/admin/editsong">
                                <EditSongs />
                            </Route>
                            <Route exact path="/admin/editshow">
                                <EditShows />
                            </Route>
                        </Switch>
                    </div>
                </UserContext.Provider>
            </ErrorContext.Provider>
        </ThemeProvider>
    );
}

export default App;
